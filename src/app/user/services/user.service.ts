import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from '../enums/role.enum';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private utilsService: UtilsService,
    private storage: AngularFireStorage
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.db.list<User>(`users`).valueChanges();
  }

  getUsersAdmin(role: string): Promise<User[]> {
    const query = (ref: firebase.default.database.Reference) => ref.orderByChild('role').equalTo(role);
    return this.db.list<User>(`users`, query).valueChanges().pipe(take(1)).toPromise();
  }

  createUser(user: User) {
    return this.db.object(`users/${user.id}`).update(user);
  }

  getUserById(id: string): Promise<User> {
    return this.db.object<User>(`users/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  async updateUser(user: any): Promise<any> {
    // if (!emailEquals) {
    //   const usr = await this.afAuth.currentUser;
    //   const update = await usr.updateEmail(user.email).catch((e) => this.utilsService.errorHandling(e));
    // }
    return this.db.object(`users/${user.id}`).update(user);
  }

  async deleteUser(user: User): Promise<any> {
    const isClient = user.role === Role.client;
    if (!isClient) {
      const myPublications = this.utilsService.getArrayFromObject(user.myPublications);
      const myHistory = this.utilsService.getArrayFromObject(user.myHistory);
      const totalIds = myPublications.concat(myHistory);

      const promisesItemsStorage = totalIds.map((id) => this.storage.ref(`publications/${id}`).listAll().toPromise());
      const publicationsStorage = await Promise.all(promisesItemsStorage).catch((e) =>
        this.utilsService.errorHandling(e)
      );

      let filesUser: any = [];

      if (publicationsStorage) {
        publicationsStorage.forEach((p) => {
          filesUser = filesUser.concat(p.items.map((i) => i.delete()));
        });
      }

      const deletePublicationsUser = myPublications.map((id) => this.db.object(`publications/${id}`).remove());
      const deletePublicationsHistoryUser = myHistory.map((id) => this.db.object(`history/${id}`).remove());

      const promisesFavorites = totalIds.map((id) =>
        this.db.object(`favorites/${id}`).valueChanges().pipe(take(1)).toPromise()
      );
      const usersToDeleteFavorites = await Promise.all(promisesFavorites); // [{id:, users:}, {id:, users:}]
      const onlyFavorites = usersToDeleteFavorites.filter((x) => x); // Quitando los nulos

      const promisesPublicationsFavorites = onlyFavorites.map((favorite: any) =>
        this.db.object(`favorites/${favorite.id}`).remove()
      );

      let promisesUsersFavorites: any[] = [];

      onlyFavorites.forEach((favorite: any) => {
        const users = this.utilsService.getArrayFromObject(favorite.users);
        users.forEach((idUser) => {
          promisesUsersFavorites.push(this.db.object(`users/${idUser}/myFavorites/${favorite.id}`).remove());
        });
      });

      return Promise.all([
        this.db.object<User>(`users/${user.id}`).remove(),
        Promise.all(deletePublicationsUser),
        Promise.all(deletePublicationsHistoryUser),
        Promise.all(promisesPublicationsFavorites),
        Promise.all(promisesUsersFavorites),
        Promise.all(filesUser),
      ]);
    } else if (isClient) {
      const myFavorites = this.utilsService.getArrayFromObject(user.myFavorites);
      const favoritesUser = myFavorites.map((id) => this.db.object(`favorites/${id}/${user.id}`).remove());

      return Promise.all([this.db.object<User>(`users/${user.id}`).remove(), Promise.all(favoritesUser)]);
    }
  }

  testFavorite() {
    // return this.db.list(`favorites/${'-Morp8YC-gKNCAUycGtl'}/users`).valueChanges().pipe(take(1)).toPromise();
    return Promise.all([
      this.db.object(`favorites/${'-Morp8YC-gKNCAUycGtl'}`).valueChanges().pipe(take(1)).toPromise(),
      this.db.object(`favorites/${'-MosCwP-RbyZsEmmiNz-'}`).valueChanges().pipe(take(1)).toPromise(),
      this.db.object(`favorites/${'-MosCwP-sdsd-'}`).valueChanges().pipe(take(1)).toPromise(),
    ]);
  }
}

// createUserRRSS() {
// if(user.rol == "C") {
//   return this.db.object(`users/${id}/details`).update(user);
// }else{
//   return Promise.all([
//     this.db.object(`users/${id}/details`).set(user),
//     this.db.object(`users/${id}/idEmployees/${employee.id}`).set(employee.id),
//     this.db.object(`business/${id}`).set(id),
//     this.db.object(`employees/${employee.id}`).set(employee)
//   ]);
// }
// }
