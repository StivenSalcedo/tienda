import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'main',
  standalone: true
})
export class MainPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

@Pipe({ name: 'orderby',
pure:false,standalone:true})
export class orderByPipe  implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}


