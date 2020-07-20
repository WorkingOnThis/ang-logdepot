import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreLugar'
})
export class NombreLugarPipe implements PipeTransform {

  transform(input, splitChar, splitIndex): any {
    return input.split(splitChar)[splitIndex];
  }

}
