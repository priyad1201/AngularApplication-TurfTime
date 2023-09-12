import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  baseUrl: string = `${environment.apiBaseUrl}Feedback/`;
  constructor(private http: HttpClient) { }
  getAllFeedback(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl)
  }
  addFeedback(data:any){
    return this.http.post<any>(this.baseUrl,data);
  }
  deleteFeedback(feedbackId:number){
    return this.http.delete(this.baseUrl+feedbackId);
  }
}
