import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscaDelituoso'
})
export class BuscaDelituosoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
