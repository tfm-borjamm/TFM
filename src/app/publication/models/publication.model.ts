import { State } from '../enums/state.enum';

export class Publication {
  id: string;
  idAutor: string;
  name: string;
  type: string;
  size: string;
  province: string;
  images: any;
  breed: string;
  description: string;
  sex: string;
  vaccinate: string;
  sterile: string;
  chip: string;
  age: string;
  date: any;
  dewormed: string;
  filter: string;
  // countFavorites: number;
  state: State;
}
