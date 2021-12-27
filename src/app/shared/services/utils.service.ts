import { TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';
import { Consult } from 'src/app/shared/models/consult.model';
import { User } from 'src/app/shared/models/user.model';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient,
    private notificationService: NotificationService,
    private capitalizePipe: CapitalizePipe,
    private titlecasePipe: TitleCasePipe
  ) {}

  generateID(): string {
    return this.db.createPushId();
  }

  getArrayFromObject(object: any): any[] {
    if (object) return Object.keys(object).map((key: string) => object[key]);
    return [];
  }

  setFormatPhonesCodes(codes: any): string[] {
    return codes.map((prefix: any) => prefix.code + ' (' + prefix.dial_code + ')').sort();
  }

  getTelephoneComplete(user: User): string {
    const code = user.code.split(' ')[1].replace(/[{()}]/g, ''); // Numbercode
    return code + user.telephone;
  }

  async errorHandling(e: any) {
    // Tiparlo de la mejor manera...
    let error = e;
    if (!e.code && e.error) error = e.error;
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          // console.error('El usuario no se encuentra registrado en la aplicación');
          this.notificationService.errorNotification('errors.register');
          break;
        case 'auth/popup-closed-by-user':
          this.notificationService.errorNotification('errors.close_window');
          break;
        case 'auth/network-request-failed':
          this.notificationService.errorNotification('errors.internet');
          break;
        case 'auth/email-already-in-use':
          this.notificationService.errorNotification('errors.email_exists');
          break;
        case 'auth/wrong-password':
          this.notificationService.errorNotification('errors.login');
          break;
        case 'auth/account-exists-with-different-credential':
          const provider = e.provider;
          const providerName: { [key: string]: string } = {
            password: 'errors.auth_provider_email',
            'google.com': 'errors.auth_provider_google',
            'facebook.com': 'errors.auth_provider_facebook',
          };
          const messageError = providerName[provider] || 'errors.auth_provider_error';
          this.notificationService.errorNotification(messageError);
          break;
        default:
          this.notificationService.errorNotification(error.message);
          // console.error(error.message);
          break;
      }
    }
  }

  getServerTimeStamp(): Promise<{ timestamp: number }> {
    const url = 'https://tfm-borjamm-functions.netlify.app/.netlify/functions/current-time';
    return this.http.get<{ timestamp: number }>(url).pipe(take(1)).toPromise();
  }

  deleteUser(id: string): Promise<any> {
    const url = 'https://tfm-borjamm-functions.netlify.app/.netlify/functions/delete-user';
    const body = {
      id: id,
    };
    return this.http.post<any>(url, JSON.stringify(body)).toPromise();
  }

  createUser(user: { email: string; password: string }): Promise<any> {
    const url = 'https://tfm-borjamm-functions.netlify.app/.netlify/functions/create-user';
    const body = {
      user: user,
    };
    return this.http.post<any>(url, JSON.stringify(body)).toPromise();
  }

  sendEmail(consult: Consult): Promise<{ message: string; error?: string }> {
    const url = 'https://tfm-borjamm-functions.netlify.app/.netlify/functions/send-email';
    const body = {
      email_dest: consult.email,
      question_msg: this.capitalizePipe.transform(consult.message),
      answer_msg: this.capitalizePipe.transform(consult.reply.message),
      name: this.titlecasePipe.transform(consult.name),
      language: consult.language,
    };
    return this.http.post<any>(url, JSON.stringify(body)).toPromise();
  }

  setLocalStorage(id: string, storage: any): void {
    try {
      // localStorage.setItem(id, JSON.stringify(storage));
      sessionStorage.setItem(id, JSON.stringify(storage));
    } catch (e) {
      this.errorHandling(e);
    }
  }

  getLocalStorage(id: string): any {
    // return JSON.parse(localStorage.getItem(id));
    const storage = sessionStorage.getItem(id);
    try {
      return JSON.parse(storage);
    } catch (e) {
      return null;
    }
  }

  removeLocalStorage(id: string): void {
    sessionStorage.removeItem(id);
  }

  // isAObject(storage: any) {
  //   return typeof storage === 'object' && storage !== null;
  // }

  // clearLocalStorage() {
  //   try {
  //     // localStorage.clear();
  //     sessionStorage.clear();
  //   } catch (e) {
  //     this.errorHandling(e);
  //   }
  // }

  // /**
  //  * Función que devuelve los identificadores de las actividades favoritas del usuario logado.
  //  * @return array con el id de las actividades favoritas del usuario logado.
  //  */
  // getUserFavoriteActivities(idUser: number): Observable<number[]> {
  //   let idActivitiesUserFavorites: number[];
  //   idActivitiesUserFavorites = JSON.parse(localStorage.getItem('lStorageFavorites' + idUser));
  //   if (idActivitiesUserFavorites === null)
  //   {
  //     idActivitiesUserFavorites = new Array<number>();
  //   }
  //   return of(idActivitiesUserFavorites);
  // }

  // /**
  //  * Función que actualiza los identificadores de las actividades favoritas del usuario logado.
  //  * @param idActivitiesUserFavorites - array con los id de las actividades favoritas del usuario
  //  */
  // setUserFavoriteActivities(idActivitiesUserFavorites: number[], idUser: number): Observable<boolean> {
  //   try {
  //     localStorage.setItem('lStorageFavorites' + idUser, JSON.stringify(idActivitiesUserFavorites));
  //     return of(true);
  //   }
  //   catch (e) {
  //     throw throwError(e);
  //   }
  // }
}
