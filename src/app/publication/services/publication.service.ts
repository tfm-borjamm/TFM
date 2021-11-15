import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Publication } from '../models/publication.model';
import * as firebase from 'firebase/compat/app';
import { State } from '../enums/state.enum';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(
    private db: AngularFireDatabase,
    private httpClient: HttpClient,
    private storage: AngularFireStorage,
    private utilsService: UtilsService // private favoriteService: FavoriteService
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

    console.log(url);

    // Siguientes y principio
    const query = !idLastItem
      ? (ref: firebase.default.database.Reference) => ref.orderByKey().limitToFirst(limitItems)
      : (ref: firebase.default.database.Reference) => ref.orderByKey().startAfter(idLastItem).limitToFirst(limitItems);

    return this.db.list<string>(url, query).valueChanges().pipe(take(1)).toPromise();
  }

  public async getPublicationsAdmin(tab: string): Promise<Publication[]> {
    // Debemos tener en cuenta que debemos saber qué referencia usar...
    const url = tab === State.available ? '/publications' : '/history';
    return this.db.list<Publication>(url).valueChanges().pipe(take(1)).toPromise();
  }

  // Peticiones del storage
  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos).percentageChanges().toPromise();
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo).getDownloadURL().toPromise();
  }

  public deleteCloudStorage(nombreArchivo: string): Promise<void> {
    return this.storage.ref(nombreArchivo).delete().pipe(take(1)).toPromise();
  }

  // Base de datos: Peticiones
  public getPublicationById(id: string, url = 'publications') {
    return this.db.object<Publication>(`${url}/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  public createPublication(publication: Publication) {
    publication.date = firebase.default.database.ServerValue.TIMESTAMP;
    return Promise.all([
      this.db.object(`publications/${publication.id}`).update(publication),
      this.db.object(`users/${publication.idAutor}/idPublications/${publication.id}`).set(publication.id),
    ]);
  }

  public updatePublication(publication: Publication) {
    return this.db.object(`publications/${publication.id}`).update(publication);
  }

  public async deletePublication(publication: Publication) {
    // Eliminación de los id favorites de los usuarios
    const users = await this.db
      .object(`favorites/${publication.id}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch((e) => this.utilsService.errorHandling(e));

    const arrayUsersId = this.utilsService.getArrayFromObject(users);

    const userPromises = arrayUsersId.map((id: string) =>
      this.db.object(`users/${id}/idFavorites/${publication.id}`).remove()
    );

    // Eliminación de la carpeta del storage
    const promiseStorage = await this.storage.ref(`publications/${publication.id}`).listAll().toPromise();

    const promiseDeleteItems = promiseStorage.items.map((item) => item.delete());

    return Promise.all([
      this.db.object(`publications/${publication.id}`).remove(),
      this.db.object(`favorites/${publication.id}`).remove(),
      Promise.all(userPromises),
      Promise.all(promiseDeleteItems),
      this.db.object(`users/${publication.idAutor}/idPublications/${publication.id}`).remove(),
    ]);
  }

  //   public async getPublicationsDeprecated(options: any): Promise<any> {

  //     const { filterKey, filterValue, idLastItem, limitItems } = options;

  //     console.log('Opciones: ', options);

  //     if (!filterKey) {
  //       // Paginación sin filtros: Sólo por claves !
  //       if (!idLastItem) {
  //         return this.db
  //           .list('/publications', (ref) => ref.orderByKey().limitToFirst(limitItems))
  //           .valueChanges()
  //           .pipe(take(1))
  //           .toPromise();
  //       } else {
  //         return this.db
  //           .list('/publications', (ref) => ref.orderByKey().startAfter(idLastItem).limitToFirst(limitItems))
  //           .valueChanges()
  //           .pipe(take(1))
  //           .toPromise();
  //       }
  //     } else {
  //       if (!idLastItem) {
  //         return (
  //           this.db
  //             .list('/publications', (ref) =>
  //               ref
  //                 .orderByChild(filterKey)
  //                 .startAt(filterValue)
  //                 .endBefore(`${filterValue}\uf8ff`)
  //                 .limitToFirst(limitItems)
  //             ) // Cuando quiero empezar desde el principio
  //             // .list('/publications', (ref) => ref.orderByChild(filterKey).equalTo(filterValue).limitToFirst(limitItems)) // Cuando quiero empezar desde el principio
  //             .valueChanges()
  //             .pipe(take(1))
  //             .toPromise()
  //         );
  //       } else {
  //         return (
  //           this.db
  //             .list('/publications', (ref) =>
  //               ref
  //                 .orderByChild(filterKey)
  //                 .startAfter(filterValue, idLastItem)
  //                 .endBefore(`${filterValue}\uf8ff`)
  //                 .limitToFirst(limitItems)
  //             ) // Cuando quiero empezar a partir el siguiente
  //             // .list('/publications', (ref) => ref.orderByChild(filterKey).equalTo(filterValue).limitToFirst(limitItems))
  //             .valueChanges()
  //             .pipe(take(1))
  //             .toPromise()
  //         );
  //       }
  //     }

  //     // return (
  //     //   this.db
  //     //     // .list('/publications', (ref) => ref.orderByChild('province').equalTo('PROVINCIA_A', '6').limitToFirst(15))
  //     //     // .list('/publications', (ref) => ref.orderByChild('province').startAt('PROVINCIA_A', '15').limitToFirst(5)) // Cuando quiero empezar a partir de la key
  //     //     // El starAt me ordena primero las que coinciden y luego me pone las que no al final, para pillarlas con startAfter
  //     //     .valueChanges()
  //     //     .pipe(take(1))
  //     //     .toPromise()
  //     //   // \uf8ff
  //     // );
  //   }

  // // return this.db.list<TravelGroupModel>('travel_groups', ref => ref.orderByChild('details/location/id').equalTo(locationID)).valueChanges();

  //   // public getCountPublications() {
  //   //   const url = 'https://tfm-borjamm-default-rtdb.europe-west1.firebasedatabase.app/publications.json?shallow=true';
  //   //   return this.httpClient.get(url).toPromise();
  //   // }

  //   // getUserById(id: string) {
  //   //   return Promise.all([
  //   //     this.db.object(`users/clientes/${id}`).valueChanges().pipe(take(1)).toPromise(),
  //   //     this.db.object(`users/protectoras/${id}`).valueChanges().pipe(take(1)).toPromise(),
  //   //     this.db.object(`users/admin/${id}`).valueChanges().pipe(take(1)).toPromise(),
  //   //   ]).catch((e) => console.error('ERRRRRR', e));
  //   // }

  //   // return this.db.list<any>('publications').valueChanges().pipe(take(1)).toPromise();

  //   // const refBase = this.db.database.ref('publications');
  //   // const refFilter = refBase.orderByChild('type').equalTo('TIPO_B').limitToFirst(5);
  //   // return refFilter.once('value', (s) => s);

  //   // Inicio => filters : "tipo_provincia" // tipo // provincia
  //   // Favoritos o Publicaciones => id // filters : "tipo_provincia" // tipo // provincia
  //   // return this.db
  //   //   .list('/users', (ref) => ref.orderByKey().startAt(start).limitToFirst(3))
  //   //   .valueChanges()
  //   //   .pipe(take(1))
  //   //   .toPromise();
  //   // return this.db.database.ref('users').limitToFirst(1).get();
  //   // return this.db
  //   //   .object<Publication>(`publications`)
  //   //   .valueChanges()
  //   //   .pipe(take(1))
  //   //   .toPromise();

  // // public listAllCloudStorage(directorio: string) {
  //   //   return this.storage.ref(directorio).listAll().pipe(take(1)).toPromise();
  //   // }

  //   // public getAllPublication(): Observable<Publication[]> {
  //   //   return this.db.list<Publication>(`publications`).valueChanges();
  //   // }

  //   // public getPublications(): Promise<Publication> {
  //   //   return this.db.object<Publication>('publications').valueChanges().pipe(take(1)).toPromise();
  //   // }
}
