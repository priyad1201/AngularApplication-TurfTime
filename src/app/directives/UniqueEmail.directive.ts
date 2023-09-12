import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { AuthenticateService } from 'src/services/authenticate.service';

@Directive({
  selector: '[UniqueEmail]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorDirective, multi:true}]
})
export class UniqueEmailValidatorDirective implements AsyncValidator {
  constructor(private authService: AuthenticateService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.authService.checkEmailExist(control.value).pipe(
      map(users=>{
        if(users){
          return {'uniqueEmail': true}
        }
        else{
          return null;
        }
      })
    );
  }
}
