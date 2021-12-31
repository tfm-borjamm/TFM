import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';
import { Publication } from '../models/publication.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private db: AngularFireDatabase, private http: HttpClient) {}

  public getFavorites(id: string): Promise<string[]> {
    return this.db.list<string>(`favorites/${id}/users`).valueChanges().pipe(take(1)).toPromise();
  }

  public setFavorite(idUser: string, publication: Publication): Promise<any> {
    return Promise.all([
      this.db
        .object(`users/${idUser}/myFavorites/${publication.id}`)
        .set({ id: publication.id, state: publication.state }),
      this.db.object(`favorites/${publication.id}/users/${idUser}`).set(idUser),
      this.db.object(`favorites/${publication.id}/id`).set(publication.id),
    ]);
  }

  public async removeFavorite(idUser: string, idPublication: string): Promise<any> {
    const userFavoritesRef = this.db.object(`favorites/${idPublication}`);
    const isTheLastOne = (favorite: any) => {
      if (favorite !== null) {
        delete favorite?.users[idUser];
        if (Object.keys(favorite?.users).length === 0) return null;
      }
      return favorite;
    };

    return Promise.all([
      userFavoritesRef.query.ref.transaction(isTheLastOne),
      this.db.object(`users/${idUser}/myFavorites/${idPublication}`).remove(),
    ]);
  }

  public getAllFavorites(): Promise<any> {
    return this.http
      .get<any>('https://tfm-borjamm-default-rtdb.europe-west1.firebasedatabase.app/favorites.json?shallow=true')
      .toPromise();
  }
}
