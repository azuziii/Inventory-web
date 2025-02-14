import { FormArray, FormGroup, Validators } from '@angular/forms';

export function getErrorMessage(
  formGroup: FormGroup | FormArray,
  controlName: string,
  errors: Record<string, any>,
): string | null {
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

  return null;
}
