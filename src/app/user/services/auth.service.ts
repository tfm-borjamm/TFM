import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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

  register(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getCurrentUser(): Observable<firebase.default.User> {
    return this.afAuth.authState;
  }

  async getCurrentUserUID(): Promise<string> {
    const user = await this.afAuth.authState.pipe(take(1)).toPromise();
    return user?.uid;
  }

  async getCurrentUserLogged(): Promise<User> {
    const uid = await this.getCurrentUserUID();
    const user = await this.userService.getUserById(uid ?? '');
    return user;
  }

  // Autenticación mediante redes sociales (Facebook o Google)!
  async loginWithProvider(pro: string): Promise<firebase.default.auth.UserCredential> {
    const providerLogin =
      pro === 'google.com'
        ? new firebase.default.auth.GoogleAuthProvider()
        : new firebase.default.auth.FacebookAuthProvider();
    const userCredendial = await this.afAuth.signInWithPopup(providerLogin).catch(async (err) => {
      // Hacerlo manualmente (Manera que se hará fijo!!!)
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.email;
        const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
        err['provider'] = methods[0];
      }
      return this.utilsService.errorHandling(err);

      // Redireccionamiento automático
      // if (err.code === 'auth/account-exists-with-different-credential') {
      //   // The pending Facebook credential.
      //   const pendingCred = err.credential;
      //   // The provider account's email address.
      //   const email = err.email;
      //   // Get the sign-in methods for this email.
      //   const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
      //   console.log('Proveedores de Autenticación: ', methods);

      //   if (methods[0] === 'google.com') {
      //     const provider = new firebase.default.auth.GoogleAuthProvider();
      //     const userCredential = await this.afAuth.signInWithPopup(provider).catch((e) => this.utilsService.errorHandling(e));
      //     return userCredential;
      //   } else if (methods[0] === 'facebook.com') {
      //     const provider = new firebase.default.auth.FacebookAuthProvider();
      //     const userCredential = await this.afAuth.signInWithPopup(provider).catch((e) => this.utilsService.errorHandling(e));
      //     return userCredential;
      //   } else if (methods[0] === 'password') {
      //     var password = prompt('Contraseña', '');
      //     const loginEmail = await this.afAuth.signInWithEmailAndPassword(email, password);
      //     const userCredential = loginEmail.user.linkWithCredential(pendingCred);
      //     return userCredential;
      //   }
      // } else {
      //   return this.utilsService.errorHandling(err);
      // }
    });

    if (!userCredendial) return null;
    return userCredendial;
  }
}

// async loginWithGoogle(): Promise<firebase.default.auth.UserCredential> {
//   const userCredential = new firebase.default.auth.GoogleAuthProvider();
//   const googleUser = await this.afAuth.signInWithPopup(userCredential).catch((e) => console.error(e));
//   if (!googleUser) return null;
//   return googleUser;
// }

// async loginWithFacebook() {
// const userCredential = new firebase.default.auth.FacebookAuthProvider();
// const facebookUser = await (await this.afAuth.currentUser)
//   .linkWithPopup(userCredential)
//   .catch((e) => console.error(e));
// if (!facebookUser) return null;
// return facebookUser;
// }
