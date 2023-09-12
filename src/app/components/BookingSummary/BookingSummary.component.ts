import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { advanceAmount } from 'src/app/environments/environment';
import { AuthenticateService } from 'src/services/authenticate.service';
import { CartService } from 'src/services/cart.service';
import { UserDataService } from 'src/services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-BookingSummary',
  templateUrl: './BookingSummary.component.html',
  styleUrls: ['./BookingSummary.component.css']
})
export class BookingSummaryComponent implements OnInit {

  userCart:any;
  sportName!: string;
  gameDetails: any[] = [];
  advanceAmount = advanceAmount;
  termsAndConditions: boolean = false;
  errorMessage: string | undefined;
  paymentStatus:number = 0;

  constructor(private userDataService: UserDataService,
              protected authService: AuthenticateService,
              private logger: NGXLogger,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit() {
    this.userDataService.getEmailFromStore().subscribe(value=>{
      const EmailFromToken = this.authService.getEmailFromToken();
      const emailId = value || EmailFromToken;
      this.authService.getUser(emailId).subscribe((data)=>{
        if(data){
          this.userCart = data;

          this.userCart.myBookings.forEach((booking:any) => {
            if(booking.paymentStatus == "unpaid"){
              this.paymentStatus = this.paymentStatus + 1;
            }
            else if(booking.paymentStatus=="paid"){
              this.paymentStatus = this.paymentStatus - 0;
            }
          });
        }
      })
    });
  }
  proceedToPayment(bookingId:number){
    if (this.termsAndConditions) {
      this.router.navigateByUrl(`/user-paymentDetails/${bookingId}`);
      this.errorMessage = undefined;
    } else {
      this.errorMessage = 'Please agree to the Terms and Conditions';
    }
  }
  cancelBooking(bookingId: number){
    Swal.fire({
      title: 'Are you sure to cancel booking?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.cancelBooking(bookingId).subscribe({
          next:()=>{
            this.ngOnInit();
          },
          error:(errorMessage)=>{
            this.logger.error(errorMessage.message);
          }
          });
          Swal.fire(
            'Cancelled!',
            'Your booking has been cancelled.',
            'success'
          )
        }
    });
  }
}
