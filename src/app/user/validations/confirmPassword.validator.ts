import { FormGroup, ValidatorFn } from '@angular/forms';

// export function confirmPassword(group: FormGroup) {
//   const password = group.get('password').value;
//   const repeatPassword = group.get('repeat_password').value;
//   return password === repeatPassword ? null : { invalidMatch: true };
// }

export function confirmPassword(targetKey: string, toMatchKey: string): any {
  return (group: FormGroup): { [key: string]: any | null } => {
    const target = group.controls[targetKey];
    const toMatch = group.controls[toMatchKey];
    if (target.dirty && toMatch.dirty) {
      const isMatch = target.value === toMatch.value;
      const message = targetKey + ' != ' + toMatchKey;
      return !isMatch ? { equalValue: message } : null;
    }
    return null;
  };
}
