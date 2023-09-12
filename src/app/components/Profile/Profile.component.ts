import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { onSuccess } from 'src/app/SweetAlert';
import { AuthenticateService } from 'src/services/authenticate.service';
import { UserDataService } from 'src/services/user-data.service';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css']
})
export class ProfileComponent implements OnInit {
  userCart:any;
  totalBookings:number = 0;
  totalCart:number = 0;
  closeResult = '';
  editProfile!: FormGroup;
  constructor(private userDataService: UserDataService,
              private modalService: NgbModal,
              private authService: AuthenticateService,
              private formBuilder: FormBuilder,
              private logger: NGXLogger) { }

  ngOnInit() {
    this.editProfile = this.formBuilder.group({
      fullName:[''],
      emailId:[''],
      mobileNumber:['']
    });
    this.userDataService.getEmailFromStore().subscribe(value=>{
      const EmailFromToken = this.authService.getEmailFromToken();
      const emailId = value || EmailFromToken;
      this.authService.getUser(emailId).subscribe((data)=>{
        if(data){
          this.userCart = data;
          
          this.editProfile.patchValue({
            fullName: this.userCart.fullName,
            emailId: this.userCart.emailId,
            mobileNumber: this.userCart.mobileNumber,
          });
          this.userCart.myBookings.forEach((booking:any)=>{
            if(booking.paymentStatus=="paid"){
              this.totalBookings = this.totalBookings + 1;
            }
            else if(booking.paymentStatus == "unpaid"){
              this.totalCart = this.totalCart + 1;
            }
          });
        }
      });
    });

  }
  openEditForm(content: any) {
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
  onSubmit(){
    const modifiedUserDetails ={
      fullName :this.editProfile.value.fullName,
      emailId: this.editProfile.value.emailId,
      mobileNumber: this.editProfile.value.mobileNumber
    }
    this.authService.editUser(this.userCart.userId,modifiedUserDetails).subscribe({
      next:()=>{
        onSuccess('Profile Updated Successfully');
        this.ngOnInit();
      },
      error:(errorMessage)=>{
        alert(errorMessage.message);
        this.logger.error(errorMessage.message);
      }
    })
  }
}
