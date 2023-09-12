import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { onError, onSuccess } from 'src/app/SweetAlert';
import { AuthenticateService } from 'src/services/authenticate.service';
import { UserDataService } from 'src/services/user-data.service';


@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  // styleUrls: ['./Login.component.css']
  styles:[`input.ng-invalid{border:1px solid red;}
        input.ng-valid{border:1px solid green;}
        input.ng-untouched{border:1px solid }`
  ]
})
export class LoginComponent implements OnInit {
  returnUrl: string='';
  role:string = '';
  closeResult = '';
  public resetPasswordEmail!: string;
  public isValidEmail!:boolean;
  constructor(private authService: AuthenticateService,
              private router: Router,
              private userData: UserDataService,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }
  onLogin(loginObject: any){
    this.authService.login(loginObject).subscribe({
      next: (response) =>{

        this.authService.storeToken(response.token);
        const tokenPayLoad = this.authService.decodedToken();
        this.userData.setNameForStore(tokenPayLoad.name);
        this.userData.setRoleForStore(tokenPayLoad.role);
        this.userData.setEmailForStore(tokenPayLoad.email);

        onSuccess('Logged In Successfully');
        this.userData.getRoleFromStore().subscribe(value=>{
          const roleFromToken = this.authService.getRoleFromToken();
          this.role = value || roleFromToken;
          if(this.returnUrl){
            this.router.navigateByUrl(this.returnUrl);
          }
          else{
            if(this.role=="Admin")
              this.router.navigate(['/admin-home']);
            else if(this.role == "User")
              this.router.navigate(['/user-home']);
          }
        });
      },
      error: ()=>{
        onError('Invalid Login Credentials');
      }
    })
  }
  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
  // checkValidEmail(event: string){
  //   const value = event;
  //   const pattern = /^[a-zA-Z]{1}([a-zA-Z0-9_\.\-])+@([a-z]{4,})+\.([a-z]{2,3})+$/;
  //   this.isValidEmail = pattern.test(value);
  //   return this.isValidEmail;
  // }
}
