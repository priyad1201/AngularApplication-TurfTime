import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private emailId$ = new BehaviorSubject<string>("");
  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }
  public setRoleForStore(role:string){
    this.role$.next(role);
  }
  public getNameFromStore(){
    return this.fullName$.asObservable();
  }
  public setNameForStore(name:string){
    this.fullName$.next(name);
  }
  public getEmailFromStore(){
    return this.emailId$.asObservable();
  }
  public setEmailForStore(emailId:string){
    this.emailId$.next(emailId);
  }
}
