import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscaGrupo'
})
export class BuscaGrupoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
