import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const prepositions = new Set(['da', 'de', 'do', 'das', 'e', 'o', 'of', 'the']);
    const values = value.split(' ');

    return values
      .map(val => {
        val = val.toLowerCase();
        return prepositions.has(val)
          ? val
          : val.charAt(0).toUpperCase() + val.slice(1);
      })
      .join(' ');
  }

}
