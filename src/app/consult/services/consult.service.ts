import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as firebase from 'firebase/compat/app';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { State } from '../enums/state.enum';
import { Consult } from '../models/consult.model';

@Injectable({
  providedIn: 'root',
})
export class ConsultService {
  constructor(private db: AngularFireDatabase, private utilsService: UtilsService, private http: HttpClient) {}

  async createConsult(consult: Consult): Promise<void> {
    return this.db.object<Consult>(`consults/${consult.id}`).set(consult);
  }

  getConsults(filter: any): Promise<Consult[]> {
    let query;
    filter === State.answered
      ? (query = (ref: firebase.default.database.Reference) => ref.orderByChild('state').equalTo(State.answered))
      : (query = (ref: firebase.default.database.Reference) => ref.orderByChild('state').startAfter(State.answered));

    return this.db.list<Consult>('/consults', query).valueChanges().pipe(take(1)).toPromise();
  }

  getConsultById(id: string): Promise<Consult> {
    return this.db.object<Consult>(`consults/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  updateConsult(consult: Consult): Promise<[void, any]> {
    // Método para contestar a la consulta!
    return Promise.all([
      this.db.object<Consult>(`consults/${consult.id}`).update(consult),
      this.utilsService.sendEmail(consult),
    ]);
  }

  deleteConsult(id: string): Promise<void> {
    return this.db.object(`consults/${id}`).remove();
  }

  setState(id: string, state: State): Promise<void> {
    return this.db.object<State>(`consults/${id}/state`).set(state);
  }

  getAllConsults(): Promise<any[]> {
    return this.http
      .get<any>('https://tfm-borjamm-default-rtdb.europe-west1.firebasedatabase.app/consults.json?shallow=true')
      .toPromise();
  }

  getConsultsLastSevenDays(currenTime: number): Promise<Consult[]> {
    const TIMESTAMP_SEVEN_DAYS = 86400000 * 7;
    const query = (ref: firebase.default.database.Reference) =>
      ref
        .orderByChild('creation_date')
        .startAt(currenTime - TIMESTAMP_SEVEN_DAYS)
        .endAt(currenTime);
    return this.db.list<Consult>('consults', query).valueChanges().pipe(take(1)).toPromise();
  }
}
