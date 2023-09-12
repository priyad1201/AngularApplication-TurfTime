import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { onError } from 'src/app/SweetAlert';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  bookingIndex!: number;
  private baseUrl:string = `${environment.apiBaseUrl}User/`;
  constructor(private httpClient: HttpClient, private router: Router, private logger: NGXLogger) { }

  addToBooking(userId:number,cartData:any){

    const modifiedUser = [{ op:'add', path:'/myBookings/-',value:cartData}]
    return this.httpClient.patch<any>(this.baseUrl+userId+'/UpdateBooking',modifiedUser,this.httpOptions).subscribe({
      next: ()=>{
        Swal.fire(
          'Added to cart!',
          'Do payment to confirm your slot',
          'success'
        )
        this.router.navigate(['/user-bookingSummary'])
      },
      error:(errorMessage)=>{
        onError(errorMessage.message);
        this.logger.error(errorMessage.message)
      }
    });
  }
  cancelBooking(bookingId:number){
    return this.httpClient.delete(this.baseUrl+bookingId);
  }
  updateCart(userCart:any,bookingId:number,reservationId:string){

    this.bookingIndex = userCart.myBookings.findIndex((slot:any) => slot.bookingId === bookingId);

    if(this.bookingIndex != -1){
      const modifiedUser: any[] = [
        { op: "replace", path: "/myBookings/" + this.bookingIndex + "/reservationId", value: reservationId },
        { op: "replace", path: "/myBookings/" + this.bookingIndex + "/paymentStatus", value: "paid" }
      ];
      this.httpClient.patch<any>(`${this.baseUrl}${userCart.userId}/UpdateBooking`, modifiedUser).subscribe({
        next: ()=>{
          this.logger.info("Payment Details Updated")
        },
        error: (errorMessage)=>{
          this.logger.error(errorMessage.message);
        }
      });
    }
  }
}
