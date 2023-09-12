import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatMobileNumber'
})
export class FormatMobileNumberPipe implements PipeTransform {

  transform(value: string): string {

    const phoneNumber = value.replace(/\D/g, '');
    // const formattedPhoneNumber = `(${phoneNumber.substr(0, 3)}) ${phoneNumber.substr(3, 3)}-${phoneNumber.substr(6)}`;
    const formattedPhoneNumber = `+91 ${phoneNumber}`;
    return formattedPhoneNumber;
  }

}
