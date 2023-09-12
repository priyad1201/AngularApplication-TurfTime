import { FormGroup } from "@angular/forms";

export function ConfirmedValidator(controlName:string, matchingControlName:string){
  return (formGroup:FormGroup)=>{
    const password = formGroup.controls[controlName];
    const confirmPassword = formGroup.controls[matchingControlName];
    if(password.value!=confirmPassword.value){
      confirmPassword.setErrors({confirmedValidator:true})
    }
    else{
      confirmPassword.setErrors(null);
    }
  }
}
