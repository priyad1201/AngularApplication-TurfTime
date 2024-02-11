import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  Days:any;
  Hours:any;
  Minutes:any;
  Seconds:any;
  isOfferValid:boolean = false;
  offerMessage:undefined | string;

  constructor() { }

  applyOffer(){
    this.isOfferValid = true;
    const x = setInterval(()=>{
      var countDownDate = new Date("October 29,2023 17:45:00").getTime();
      var todayDate = new Date().getTime();

      var offerTimeAvailable = countDownDate - todayDate;

      this.Days = Math.floor(offerTimeAvailable / (1000 * 60 * 60 * 24));
      this.Hours = Math.floor((offerTimeAvailable % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.Minutes = Math.floor((offerTimeAvailable % (1000 * 60 * 60)) / (1000 * 60));
      this.Seconds = Math.floor((offerTimeAvailable % (1000 * 60)) / 1000);

      if(offerTimeAvailable<0){
          clearInterval(x);
          this.offerMessage = "Offer Expired";
          this.isOfferValid = false;
      }
      // const offerDetails = {
      //   isOfferValid: this.isOfferValid,
      //   days: this.Days,
      //   hours: this.Hours,
      //   minutes: this.Minutes,
      //   seconds: this.Seconds
      // };
      // localStorage.setItem('offerDetails', JSON.stringify(offerDetails));
    },1000);

  }
  endOffer(){
    this.isOfferValid = false;
    // localStorage.removeItem('offerDetails');
  }
}
