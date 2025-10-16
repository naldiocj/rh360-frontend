import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroFrente'
})
export class ZeroFrenteNPipe implements PipeTransform {

  transform(value: number): string {
    return value > 10 ? value.toString() : `0${value}`;
  }

}
