import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private db: AngularFireDatabase, private http: HttpClient) {}

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

  async errorHandling(e: any) {
    // Tiparlo de la mejor manera...
    let error = e;
    if (!e.code && e.error) error = e.error;
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          console.error('El usuario no se encuentra registrado en la aplicación');
          break;
        case 'auth/email-already-in-use':
          console.error('El email introducido ya se encuentra registrado en la aplicación');
          break;
        case 'auth/wrong-password':
          console.error('El email o la contraseña introducida es incorrecta');
          break;
        case 'auth/account-exists-with-different-credential':
          const provider = e.provider;
          const providerName: { [key: string]: string } = {
            password: 'correo y contraseña.',
            'google.com': 'Google.',
            'facebook.com': 'Facebook.',
          };
          const messageError = providerName[provider] || 'ninguno.';
          console.error(`Por favor, autenticate mediante ${messageError}`);
          break;
        default:
          console.error(error.message);
          break;
      }
    }
  }

  getServerTimeStamp(): Promise<{ timestamp: number }> {
    const url = 'https://tfm-borjamm-functions.netlify.app/.netlify/functions/current-time';
    return this.http.get<{ timestamp: number }>(url).toPromise();
  }
}
