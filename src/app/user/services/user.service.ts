import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
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

  createUser(user: User) {
    return this.db.object(`users/${user.id}`).update(user);
  }

  getUserById(id: string): Promise<User> {
    return this.db.object<User>(`users/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  async updateUser(user: any, emailEquals: boolean = true): Promise<any> {
    // if (!emailEquals) {
    //   const usr = await this.afAuth.currentUser;
    //   const update = await usr.updateEmail(user.email).catch((e) => this.utilsService.errorHandling(e));
    // }
    return this.db
      .object(`users/${user.id}`)
      .update(user)
      .catch((e) => this.utilsService.errorHandling(e));
  }

  async deleteUser(user: User): Promise<any> {
    if (user.role === 'company') {
      const publicationsUser = this.utilsService
        .getArrayFromObject(user.myPublications)
        .map((id) => this.db.object(`publications/${id}`).remove());
      const promiseStorage = this.utilsService
        .getArrayFromObject(user.myPublications)
        .map((id) => this.storage.ref(`publications/${id}`).listAll().toPromise());
      const publicationsStorage = await Promise.all(promiseStorage);
      let filesUser: any = [];

      if (publicationsStorage) {
        publicationsStorage.forEach((p) => {
          filesUser = filesUser.concat(p.items.map((i) => i.delete()));
        });
      }

      return Promise.all([
        this.db.object<User>(`users/${user.id}`).remove(),
        Promise.all(publicationsUser),
        Promise.all(filesUser),
      ]);
    } else if (user.role === 'client') {
      const favoritesUser = this.utilsService
        .getArrayFromObject(user.myFavorites)
        .map((id) => this.db.object(`favorites/${id}/${user.id}`).remove());
      return Promise.all([this.db.object<User>(`users/${user.id}`).remove(), Promise.all(favoritesUser)]);
    }
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
