import { PublicationState } from '../enums/publication-state';

export class Publication {
  id: string;
  idAuthor: string;
  nameAutor?: string;
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
  date: number;
  dewormed: string;
  filter: string;
  state: PublicationState;
}
