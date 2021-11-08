import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as firebase from 'firebase/compat/app';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Consult } from '../models/consult.model';

@Injectable({
  providedIn: 'root',
})
export class ConsultService {
  constructor(private db: AngularFireDatabase, private utilsService: UtilsService) {}

  async createConsult(consult: Consult): Promise<void> {
    // consult.creation_date = firebase.default.database.ServerValue.TIMESTAMP as number;
    const timestamp = (await this.utilsService.getServerTimeStamp()).timestamp;
    consult.creation_date = timestamp;
    return this.db.object<Consult>(`consults/${consult.id}`).update(consult);
  }
}
