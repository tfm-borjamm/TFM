import { ConsultState } from '../enums/consult-state.enum';
import { Reply } from './Reply.model';

export class Consult {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  creation_date: number;
  state: ConsultState;
  reply?: Reply;
  // admin?: { //admin
  //   reply_date: number;
  //   reply: string;
  // };
}
