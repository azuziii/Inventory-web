import { FormGroup } from '@angular/forms';

export function getDirtyValues<T>(formGroup: FormGroup): T {
  const values: Record<string, any> = {};
  Object.keys(formGroup.controls).forEach((control) => {
    if (formGroup.get(control)!.dirty) {
      values[control] = formGroup.get(control)!.value;
    }
  });
  return values as T;
}
