import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePublication',
})
export class ImagePublicationPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return !value ? '../../../assets/images/image-not-found.svg' : value;
  }
}
