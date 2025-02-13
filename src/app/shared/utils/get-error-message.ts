import { FormGroup, Validators } from '@angular/forms';

export function getErrorMessage(
  formGroup: FormGroup,
  controlName: string,
  errors: Record<string, any>,
) {
  const target = formGroup.get(controlName);
  if (target && target.invalid && target.touched) {
    const targetErrors = target.errors;
    if (!targetErrors) return null;
    const errorKeys = Object.keys(targetErrors);
    if (!errorKeys.length) return null;
    const activeKey = errorKeys.find(
      (key) => targetErrors[key],
    ) as keyof typeof Validators;
    return errors[activeKey];
  }
}
