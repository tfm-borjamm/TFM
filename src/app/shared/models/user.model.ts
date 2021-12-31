import { Role } from '../enums/role.enum';

export class User {
  id: string;
  email: string;
  name: string;
  street: string;
  cp: string;
  code: string;
  telephone: string;
  province: string;
  role: Role;
  added_date: number;
  myPublications?: { [idPublication: string]: { id: [idPublication: string]; state: string }[] };
  myFavorites?: { [idPublication: string]: [idPublication: string][] };
  myHistory?: { [idPublication: string]: [idPublication: string][] };
}
