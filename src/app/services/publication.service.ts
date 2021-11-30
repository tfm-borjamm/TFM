import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { Publication } from '../shared/models/publication.model';
import * as firebase from 'firebase/compat/app';
import { PublicationState } from '../shared/enums/publication-state';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private utilsService: UtilsService,
    private http: HttpClient
  ) {}

  public async getPublications(options: any): Promise<Publication[]> {
    // startAt => Incluye la key
    // startAfter => Excluye la key
    // Mismo comportamiento para endAt y endBefore
    const { filterKey, filterValue, idLastItem, limitItems } = options;
    let query;
    console.log('Opciones: ', options);

    if (!filterKey) {
      if (!idLastItem) {
        query = (ref: firebase.default.database.Reference) => ref.orderByKey().limitToFirst(limitItems);
      } else {
        query = (ref: firebase.default.database.Reference) =>
          ref.orderByKey().startAfter(idLastItem).limitToFirst(limitItems);
      }
    } else {
      if (!idLastItem) {
        query = (ref: firebase.default.database.Reference) =>
          ref.orderByChild(filterKey).startAt(filterValue).endBefore(`${filterValue}\uf8ff`).limitToFirst(limitItems);
      } else {
        query = (ref: firebase.default.database.Reference) =>
          ref
            .orderByChild(filterKey)
            .startAfter(filterValue, idLastItem)
            .endBefore(`${filterValue}\uf8ff`)
            .limitToFirst(limitItems);
      }
    }

    return this.db.list<Publication>('/publications', query).valueChanges().pipe(take(1)).toPromise();
  }

  public async getPublicationsID(options: any): Promise<string[]> {
    // Favoritos, Mis publicaciones, Mi historial
    const { idLastItem, limitItems, url } = options;

    // Siguientes y principio
    const query = !idLastItem
      ? (ref: firebase.default.database.Reference) => ref.orderByKey().limitToFirst(limitItems)
      : (ref: firebase.default.database.Reference) => ref.orderByKey().startAfter(idLastItem).limitToFirst(limitItems);

    return this.db.list<string>(url, query).valueChanges().pipe(take(1)).toPromise();
  }

  public async getPublicationsAdmin(tab: string): Promise<Publication[]> {
    // Debemos tener en cuenta que debemos saber qué referencia usar...
    const url = tab === PublicationState.available ? '/publications' : '/history';
    return this.db.list<Publication>(url).valueChanges().pipe(take(1)).toPromise();
  }

  // Peticiones del storage
  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any): Promise<number> {
    return this.storage.upload(nombreArchivo, datos).percentageChanges().toPromise();
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string): Promise<any> {
    return this.storage.ref(nombreArchivo).getDownloadURL().toPromise();
  }

  public deleteCloudStorage(nombreArchivo: string): Promise<any> {
    return this.storage.ref(nombreArchivo).delete().pipe(take(1)).toPromise();
  }

  // Base de datos: Peticiones
  public getPublicationById(id: string, url: string = 'publications'): Promise<Publication> {
    return this.db.object<Publication>(`${url}/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  public createPublication(publication: Publication): Promise<[void, void]> {
    if (!publication.date) publication.date = firebase.default.database.ServerValue.TIMESTAMP as number;
    return Promise.all([
      this.db.object(`publications/${publication.id}`).update(publication),
      this.db.object(`users/${publication.idAuthor}/myPublications/${publication.id}`).set(publication.id),
    ]);
  }

  public updatePublication(publication: Publication): Promise<void> {
    return this.db.object(`publications/${publication.id}`).update(publication);
  }

  public async deletePublication(publication: Publication): Promise<any> {
    // Eliminación de los id favorites de los usuarios
    const arrayUsersId = await this.db
      .list<string>(`favorites/${publication.id}/users`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch((e) => this.utilsService.errorHandling(e));

    if (!arrayUsersId) return null;

    const userPromises = arrayUsersId.map((id: string) =>
      this.db.object(`users/${id}/myFavorites/${publication.id}`).remove()
    );

    // Eliminación de la carpeta del storage
    const promisesStorage = await this.storage.ref(`publications/${publication.id}`).listAll().toPromise();

    const promiseDeleteItems = promisesStorage.items.map((item) => item.delete());

    if (publication.state === PublicationState.available) {
      return Promise.all([
        this.db.object(`publications/${publication.id}`).remove(),
        this.db.object(`favorites/${publication.id}`).remove(),
        Promise.all(userPromises),
        Promise.all(promiseDeleteItems),
        this.db.object(`users/${publication.idAuthor}/myPublications/${publication.id}`).remove(),
      ]);
    } else {
      return Promise.all([
        this.db.object(`history/${publication.id}`).remove(),
        this.db.object(`favorites/${publication.id}`).remove(),
        Promise.all(userPromises),
        Promise.all(promiseDeleteItems),
        this.db.object(`users/${publication.idAuthor}/myHistory/${publication.id}`).remove(),
      ]);
    }
  }

  public async updatePublicationState(publication: Publication): Promise<any> {
    publication.state = PublicationState.adopted;

    const arrayUsersId = await this.db
      .list<string>(`favorites/${publication.id}/users`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch((e) => this.utilsService.errorHandling(e));

    if (!arrayUsersId) return null;

    const userPromises = arrayUsersId.map((id: string) =>
      this.db.object(`users/${id}/myFavorites/${publication.id}/state`).set(publication.state)
    );

    return Promise.all([
      this.db.object<Publication>(`publications/${publication.id}`).remove(),
      this.db.object<Publication>(`history/${publication.id}`).set(publication),
      this.db.object(`users/${publication.idAuthor}/myPublications/${publication.id}`).remove(),
      this.db.object(`users/${publication.idAuthor}/myHistory/${publication.id}`).set(publication.id),
      Promise.all(userPromises),
    ]);
  }

  getAllPublications(): Promise<any[]> {
    return this.http
      .get<any>('https://tfm-borjamm-default-rtdb.europe-west1.firebasedatabase.app/publications.json?shallow=true')
      .toPromise();
  }

  getAllPublicationsHistory(): Promise<any[]> {
    return this.http
      .get<any>('https://tfm-borjamm-default-rtdb.europe-west1.firebasedatabase.app/history.json?shallow=true')
      .toPromise();
  }

  getPublicationsLastSevenDays(currenTime: number): Promise<Publication[]> {
    const TIMESTAMP_SEVEN_DAYS = 86400000 * 7;
    const query = (ref: firebase.default.database.Reference) =>
      ref
        .orderByChild('date')
        .startAt(currenTime - TIMESTAMP_SEVEN_DAYS)
        .endAt(currenTime);
    return this.db.list<Publication>('publications', query).valueChanges().pipe(take(1)).toPromise();
  }
}
