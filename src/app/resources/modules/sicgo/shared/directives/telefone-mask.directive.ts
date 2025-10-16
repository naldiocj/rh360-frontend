import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTelefoneMask]'
})
export class TelefoneMaskDirective {
  @Input('telefonekvMask') maskType?: 'angola' | 'usa' | string; // Se undefined, detecta automaticamente
 
  constructor(private control: NgControl, private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, '');

    // Detectar código do país
    if (value.startsWith('244')) {
      value = value.substring(3);
      this.maskType = 'angola';
    } else if (value.startsWith('1')) {
      value = value.substring(1);
      this.maskType = 'usa';
    }

    // Se ainda não detectou, tenta pela lógica
    let detectedType = this.maskType;
    if (!detectedType) {
      if (value.startsWith('9') && value.length <= 9) {
        detectedType = 'angola';
      } else if (value.length <= 10) {
        detectedType = 'usa';
      }
    }

    let masked = value;

    // Formatar conforme o tipo
    if (detectedType === 'angola') {
      masked = this.formatAngola(value);
    } else if (detectedType === 'usa') {
      masked = this.formatUSA(value);
    } else if (typeof detectedType === 'string' && detectedType.includes('#')) {
      masked = this.applyCustomMask(value, detectedType);
    }

    this.control.control?.setValue(masked, { emitEvent: false });

    this.validatePhone(value, detectedType);

    this.restoreCursorPosition(input, masked.length);
  }

  private formatAngola(value: string): string {
    if (value.length > 3) value = value.substring(0, 3) + ' ' + value.substring(3);
    if (value.length > 7) value = value.substring(0, 7) + ' ' + value.substring(7, 11);
    return value;
  }

  private formatUSA(value: string): string {
    if (value.length > 0) value = '(' + value;
    if (value.length > 4) value = value.substring(0, 4) + ') ' + value.substring(4);
    if (value.length > 9) value = value.substring(0, 9) + '-' + value.substring(9, 13);
    return value;
  }

  private applyCustomMask(value: string, maskPattern: string): string {
    let result = '';
    let index = 0;
    for (let i = 0; i < maskPattern.length && index < value.length; i++) {
      result += maskPattern[i] === '#' ? value[index++] : maskPattern[i];
    }
    return result;
  }

  private validatePhone(digitsOnly: string, type?: string) {
    const errors: any = {};

    if (type === 'angola' && !/^9[1-9]\d{7}$/.test(digitsOnly)) {
      errors.invalidAngolaPhone = 'Número de Angola inválido (Ex: 923 123 456)';
    } else if (type === 'usa' && !/^\d{10}$/.test(digitsOnly)) {
      errors.invalidUSAPhone = 'Número dos EUA inválido (Ex: (123) 456-7890)';
    }

    this.control.control?.setErrors(Object.keys(errors).length ? errors : null);
  }

  private restoreCursorPosition(input: HTMLInputElement, length: number) {
    setTimeout(() => {
      const position = Math.min(length, input.value.length);
      input.setSelectionRange(position, position);
    });
  }
}