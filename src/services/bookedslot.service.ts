import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { IBookedSlot } from 'src/models/bookedslot';

@Injectable({
  providedIn: 'root'
})
export class BookedslotService {
  private baseUrl:string = `${environment.apiBaseUrl}BookedSlot/`;
  constructor(private httpClient: HttpClient) { }

  getBookedSlot(): Observable<IBookedSlot[]>{
    return this.httpClient.get<IBookedSlot[]>(`${this.baseUrl}`)
  }
  checkSlotAvailability(venue: string, sportName: string, date:string): Observable<any[]> {
    const apiUrl = `${this.baseUrl}checkAvailability?venueName=${encodeURIComponent(venue)}&sportName=${encodeURIComponent(sportName)}&dateOfSlot=${encodeURIComponent(date)}`;
    return this.httpClient.get<any[]>(apiUrl);
  }
  getBookingDetails(userId:number,bookingId:number){
    return this.httpClient.get<any>(this.baseUrl+bookingId+'?userId='+userId);
  }
}
