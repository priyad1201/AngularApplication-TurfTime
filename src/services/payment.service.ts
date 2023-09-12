import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl:string = `${environment.apiBaseUrl}Payment/`;
  constructor(private httpClient: HttpClient) { }

  addPaymentDetails(data:any){
    return this.httpClient.post<any>(this.baseUrl,data);
  }

}
