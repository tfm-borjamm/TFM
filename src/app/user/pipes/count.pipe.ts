import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count',
})
export class CountPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): number {
    return this.count(value) + this.count(args[0]);
  }

  count(publications: any): number {
    return publications ? Object.keys(publications).length : 0;
  }
}
