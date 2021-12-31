import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private utilsService: UtilsService, private userService: UserService) {}

  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): void {
    this.afAuth.signOut();
  }

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getCurrentUser(): Observable<firebase.default.User> {
    return this.afAuth.authState;
  }

  async getCurrentUserUID(): Promise<string> {
    try {
      const user = await this.afAuth.authState.pipe(take(1)).toPromise();
      return user ? user?.uid : null;
    } catch (e) {
      this.utilsService.errorHandling(e);
      return null;
    }
  }

  async getCurrentUserLogged(): Promise<User> {
    try {
      const uid = await this.getCurrentUserUID();
      const user = await this.userService.getUserById(uid ?? '');
      return user ? user : null;
    } catch (e) {
      this.utilsService.errorHandling(e);
      return null;
    }
  }

  async loginWithProvider(pro: string): Promise<firebase.default.auth.UserCredential> {
    const providerLogin =
      pro === 'google.com'
        ? new firebase.default.auth.GoogleAuthProvider()
        : new firebase.default.auth.FacebookAuthProvider();
    const userCredendial = await this.afAuth.signInWithPopup(providerLogin).catch(async (err) => {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.email;
        const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
        err['provider'] = methods[0];
      }
      return this.utilsService.errorHandling(err);
    });

    if (!userCredendial) return null;
    return userCredendial;
  }
}
