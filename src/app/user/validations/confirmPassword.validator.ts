import { FormGroup } from '@angular/forms';

export function confirmPassword(group: FormGroup) {
  const password = group.get('password').value;
  const repeatPassword = group.get('repeat_password').value;
  return password === repeatPassword ? null : { invalidMatch: true };
}
