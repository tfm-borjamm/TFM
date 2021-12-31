import { Sex } from '../enums/sex.enum';
import { Size } from '../enums/size.enum';
import { PublicationState } from '../enums/publication-state';
import { Type } from '../enums/type.enum';

export class Publication {
  id: string;
  idAuthor: string;
  nameAuthor?: string;
  name: string;
  type: Type;
  size: Size;
  province: string;
  images: any;
  breed: string;
  description: string;
  sex: Sex;
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
