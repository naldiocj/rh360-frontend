import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortPatente'
})
export class ShortPatentePipe implements PipeTransform {

  transform(value: string,): unknown {
    console.log(value)
    return value.split('-')[0];;
  }

}
