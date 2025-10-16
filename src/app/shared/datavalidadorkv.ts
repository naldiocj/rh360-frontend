import { AbstractControl, ValidatorFn } from '@angular/forms'; 
// just an interface for type safety.
export function pastOrPresentDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate > today ? { 'futureDate': { value: control.value } } : null;
  };
}