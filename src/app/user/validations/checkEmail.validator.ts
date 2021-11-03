import { AbstractControl, ValidatorFn } from '@angular/forms';

export function checkEmail(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    const emailCheck = regex.test(control.value);
    return !emailCheck ? { emailValidator: { value: control.value } } : null;
  };
}
