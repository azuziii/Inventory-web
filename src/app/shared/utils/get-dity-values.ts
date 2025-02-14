import { FormArray, FormGroup } from '@angular/forms';

export function getDirtyValues<T>(formGroup: FormGroup): T {
  const values: Record<string, any> = {};
  Object.keys(formGroup.controls).forEach((control) => {
    const target = formGroup.get(control);
    if (target instanceof FormArray && target.dirty) {
      values[control] = ((target as FormArray).controls as FormGroup[])
        .filter((c) => c.dirty)
        .map((c) => {
          const dirtyFields: Record<string, any> = {};
          Object.keys(c.controls).forEach((k) => {
            const arrayControlTarget = c.get(k);
            if (arrayControlTarget?.dirty) {
              dirtyFields[k] = arrayControlTarget.value;
            }
          });
          return dirtyFields;
        });
    } else if (target!.dirty) {
      values[control] = target!.value;
    }
  });
  return values as T;
}
