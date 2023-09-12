import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private baseUrl:string = `${environment.apiBaseUrl}User/`;
  private userPayLoad:any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayLoad = this.decodedToken();
  }

  signUp(userObject:any){
    return this.http.post<any>(`${this.baseUrl}register`,userObject);
  }
  login(loginObject:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObject);
  }
  signOut(){
    localStorage.clear();
    this.router.navigate(['user-home']);
  }
  getAllUser(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl);
  }
  getUser(emailId:string){
    return this.http.get<any>(`${this.baseUrl+emailId}`);
  }
  checkEmailExist(emailId:string):Observable<boolean>{
    return this.http.get<boolean>(`${this.baseUrl}CheckEmailExist?emailId=${encodeURIComponent(emailId)}`);
  }
  editUser(userId:number,updatedDetails:any){
    return this.http.put<any>(`${this.baseUrl}`+userId,updatedDetails)
  }
  storeToken(tokenValue:string){
    localStorage.setItem('token', tokenValue)
  }
  getToken(){
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }
  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token)
  }
  getNameFromToken(){
    if(this.userPayLoad){
      return this.userPayLoad.name;
    }
  }
  getRoleFromToken(){
    if(this.userPayLoad)
      return this.userPayLoad.role
  }
  getEmailFromToken(){
    if(this.userPayLoad)
      return this.userPayLoad.email
  }
}
