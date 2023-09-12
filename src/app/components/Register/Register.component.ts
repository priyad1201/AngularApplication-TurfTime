import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { onError, onSuccess } from 'src/app/SweetAlert';
import { ConfirmedValidator } from 'src/app/validators/ConfirmValidator';
import { AuthenticateService } from 'src/services/authenticate.service';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  // styleUrls: ['./Register.component.css']
  styles:[`input.ng-invalid{border:1px solid red;}
        input.ng-valid{border:1px solid green;}
        input.ng-untouched{border:1px solid }`
  ]
})
export class RegisterComponent implements OnInit{

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              private router: Router) { }

  registerForm=this.formBuilder.group({
    fullName:[,[Validators.required,Validators.minLength(3),
                Validators.pattern("^(?!.*(.)\\1\\1)[A-Za-z]{2,}$"),
            ]],
    emailId:['',[Validators.required,
              Validators.email,
              Validators.pattern("^(?!.*([a-zA-Z0-9_\\.-])\\1\\1)[a-zA-Z]{1}[a-zA-Z0-9_\\.-]*@([a-z]{4,})+\\.([a-z]{2,3})+$"),
            ]],
    mobileNumber:[,[Validators.required,
                    Validators.pattern("^[6-9][0-9]{9}$")],
                    // [UniqueNumberValidator(this.authService)]
                  ],
    password:["",[Validators.required,
            Validators.minLength(8),
            Validators.pattern("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*\\W).{8,}$"),
            // [UniquePasswordValidator(this.authService)],
            ]],
    confirmPassword:["",[Validators.required,
              Validators.minLength(8)]],
    },{validator:ConfirmedValidator('password','confirmPassword')})

    ngOnInit() {}


    signUp(){
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (response=>{
          onSuccess('Registered  Successfully!');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }),
        error: (errorMessage=>{
          onError(errorMessage.message);
        })
      });
    }

}
