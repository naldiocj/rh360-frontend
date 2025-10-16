import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceSeparator'
})
export class SpaceSeparatorPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null) {
      return '';
    }

    // Converter para string, caso seja número
    const stringValue = value.toString();

    // Adicionar espaço como separador de milhares
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
