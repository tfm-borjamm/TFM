import { State } from '../enums/state.enum';

export class Consult {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  creation_date: number;
  state: State;
  admin?: {
    reply_date: number;
    reply: string;
  };
}
