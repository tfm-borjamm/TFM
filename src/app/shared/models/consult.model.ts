import { ConsultState } from '../enums/consult-state.enum';
import { Reply } from './reply.model';

export class Consult {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  language: string;
  creation_date: number;
  state: ConsultState;
  reply?: Reply;
}
