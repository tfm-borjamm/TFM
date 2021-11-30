import { ConsultState } from '../enums/consult-state.enum';

export class Consult {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  creation_date: number;
  state: ConsultState;
  admin?: {
    reply_date: number;
    reply: string;
  };
}
