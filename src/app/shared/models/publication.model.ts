import { PublicationState } from '../enums/publication-state';

export class Publication {
  id: string;
  idAuthor: string;
  nameAuthor?: string;
  name: string;
  type: string;
  size: string;
  province: string;
  images: any;
  breed: string;
  description: string;
  sex: string;
  age: string;
  date: number;
  filter: string;
  vaccinate: string;
  sterile: string;
  chip: string;
  dewormed: string;
  shipping: string;
  state: PublicationState;
}
