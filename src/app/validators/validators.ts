import { AbstractControl } from '@angular/forms';

export function ValidateNegativeNumber(control: AbstractControl) {
    if (control.value <= 0)
        return { inValidRollNo: true };
    return null;
}

export function ValidateMobilePhone(control: AbstractControl) {
    let len = 0;
    if (control.value != undefined) {
        len = (control.value).length;
    }
    if (len !== 10)
        return { invalidPhoneNo: true };
    return null;
}