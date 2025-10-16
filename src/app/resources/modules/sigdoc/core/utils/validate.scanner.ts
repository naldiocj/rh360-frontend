import { AbstractControl, ValidationErrors } from '@angular/forms';

export function scanRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && value.length > 0) {
    return null; // O valor é válido
  }
  return { scanRequired: true }; // O valor é inválido
}
