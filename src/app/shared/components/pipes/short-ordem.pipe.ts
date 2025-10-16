import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortOrdem'
})
export class ShortOrdemPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.split(',')[0];
  }

}
