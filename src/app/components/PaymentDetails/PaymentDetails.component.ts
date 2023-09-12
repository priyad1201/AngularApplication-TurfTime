import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { onError } from 'src/app/SweetAlert';
import { advanceAmount } from 'src/app/environments/environment';
import { IDeactivateGuard } from 'src/guards/deactivate.guard';
import { AuthenticateService } from 'src/services/authenticate.service';
import { BookedslotService } from 'src/services/bookedslot.service';
import { CartService } from 'src/services/cart.service';
import { PaymentService } from 'src/services/payment.service';
import { UserDataService } from 'src/services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-PaymentDetails',
  templateUrl: './PaymentDetails.component.html',
  styleUrls: ['./PaymentDetails.component.css'],
  styles:[`input.ng-invalid{border:1px solid red;}
        input.ng-valid{border:1px solid green;}
        input.ng-untouched{border:1px solid; }`
  ]
})
export class PaymentDetailsComponent implements OnInit, IDeactivateGuard {

  isUpiHidden:boolean = true;
  isCardHidden:boolean = true;
  selectedPaymentMethod:string='';
  userCart:any;
  currentCartDetails: any;
  paymentDetails:boolean = true;
  paymentMessage:boolean = false;
  advanceAmount = advanceAmount;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private paymentService: PaymentService,
              private route: ActivatedRoute,
              private userDataService: UserDataService,
              private authService: AuthenticateService,
              private bookedSlotService: BookedslotService,
              private cartService: CartService,
              private logger: NGXLogger) { }

  paymentForm=this.formBuilder.group({
    cardHolderName:['',Validators.required],
    cardNumber:['',[Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[1-9][0-9])$/),this.expirationDateValidator]],
    cvv:['',[Validators.required,Validators.pattern(/^\d{3}$/)]],
    virtualPaymentAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+@+[a-zA-Z]+$/)]],
  })
  ngOnInit() {
    const bookingIdString = this.route.snapshot.paramMap.get('id');
    if(bookingIdString  ){
      const bookingId = parseInt(bookingIdString, 10);
      this.userDataService.getEmailFromStore().subscribe(value=>{
        const EmailFromToken = this.authService.getEmailFromToken();
        const emailId = value || EmailFromToken;
        this.authService.getUser(emailId).subscribe((data)=>{
          if(data){
            this.userCart = data;
            this.bookedSlotService.getBookingDetails(this.userCart.userId,bookingId).subscribe((response)=>{
              this.currentCartDetails = response;
            })
          }
        });
      });
    }
  }
  canExit() :boolean{
    if(confirm("Are you sure want to exit?")){
      return true
    }
    else{
      return false
    }
  }
  expirationDateValidator(control:any) {
    if (!control.value) {
      return null;
    }
    const [expMonth, expYear] = control.value.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return { expired: true };
    }
    return null;
  }
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    console.log(this.selectedPaymentMethod)
    if (method === 'cardPayment') {
      this.paymentForm.get('cardHolderName')?.enable();
      this.paymentForm.get('cardNumber')?.enable();
      this.paymentForm.get('expiryDate')?.enable();
      this.paymentForm.get('cvv')?.enable();

      this.paymentForm.get('virtualPaymentAddress')?.disable();

    } else if (method === 'upiPayment') {
      this.paymentForm.get('cardHolderName')?.disable();
      this.paymentForm.get('cardNumber')?.disable();
      this.paymentForm.get('expiryDate')?.disable();
      this.paymentForm.get('cvv')?.disable();

      this.paymentForm.get('virtualPaymentAddress')?.enable();
    }
  }

  doPayment(data:any){

    const timestamp = Date.now().toString();
    const reservationId = "#TT"+ timestamp;

    const body = {
      userId: this.userCart.userId,
      bookingId: this.currentCartDetails.bookingId,
      totalAmount: this.currentCartDetails.totalAmount,
      advanceAmount: this.advanceAmount,
      balanceAmount: this.currentCartDetails.totalAmount - this.advanceAmount,
      paymentType: this.selectedPaymentMethod,
      paymentDate: new Date().toISOString(),
      virtualPaymentAddress: data.virtualPaymentAddress,
      cardHolderName: data.cardHolderName,
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cvv: data.cvv
    }
    this.paymentService.addPaymentDetails(body).subscribe({
      next: ()=>{
        this.cartService.updateCart(this.userCart,this.currentCartDetails.bookingId,reservationId);
        this.paymentDetails = false;
        this.paymentMessage = true;
        setTimeout(() => {
          this.router.navigate(['/user-bookingInformation']);
        }, 5000);
      },
      error:(errorMessage)=>{
        onError("Something went wrong! Try again later");
        this.logger.error(errorMessage.message);
      }
    });
  }
}
