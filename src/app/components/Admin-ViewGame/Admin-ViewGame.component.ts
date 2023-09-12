import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { IGame } from 'src/models/game';
import { GameService } from 'src/services/game.service';
import { OfferService } from 'src/services/offer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Admin-ViewGame',
  templateUrl: './Admin-ViewGame.component.html',
  styleUrls: ['./Admin-ViewGame.component.css']
})
export class AdminViewGameComponent implements OnInit {
  gamesList: IGame[] = [];
  isOfferValid:boolean = false;
  Days:any;
  Hours:any;
  Minutes:any;
  Seconds:any;
  constructor(private gameService: GameService,
              protected offerService: OfferService,
              private logger: NGXLogger) { }

  ngOnInit():void {
    // if(this.offerService.isOfferValid){
    //   this.checkIfOfferValid();
    // }
    this.gameService.getAllGames().subscribe({
      next: (games) =>{
        this.logger.log(games);
        this.gamesList = games;
      },
      error: (error)=>{
        this.logger.error(error.message)
      }
    });
  }
  checkIfOfferValid(){
    const storedOfferDetails = localStorage.getItem('offerDetails');
    if (storedOfferDetails) {
      const offerDetails = JSON.parse(storedOfferDetails);
      this.isOfferValid = offerDetails.isOfferValid;
      this.Days = offerDetails.days;
      this.Hours = offerDetails.hours;
      this.Minutes = offerDetails.minutes;
      this.Seconds = offerDetails.seconds;
    }
    const x = setInterval(()=>{
      var countDownDate = new Date("August 08,2023 17:45:00").getTime();
      var todayDate = new Date().getTime();

      var offerTimeAvailable = countDownDate - todayDate;

      this.Days = Math.floor(offerTimeAvailable / (1000 * 60 * 60 * 24));
      this.Hours = Math.floor((offerTimeAvailable % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.Minutes = Math.floor((offerTimeAvailable % (1000 * 60 * 60)) / (1000 * 60));
      this.Seconds = Math.floor((offerTimeAvailable % (1000 * 60)) / 1000);

      if(offerTimeAvailable<0){
          clearInterval(x);
          this.isOfferValid = false;
      }
    },1000);
  }
  endOffer(){
    this.offerService.endOffer();
    this.isOfferValid = false;
  }
  deleteGame(id:number){
    this.logger.warn("You are trying to delete game!")
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameService.deleteGame(id).subscribe(()=>{
          this.logger.info("Game deleted");
         this.ngOnInit();
        });
        Swal.fire(
          'Deleted!',
          'Your data has been deleted.',
          'success'
        )
      }
    });
  }
}
