import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { IGame } from 'src/models/game';
import { AuthenticateService } from 'src/services/authenticate.service';
import { FeedbackService } from 'src/services/feedback.service';
import { GameService } from 'src/services/game.service';

@Component({
  selector: 'app-Admin-Home',
  templateUrl: './Admin-Home.component.html',
  styleUrls: ['./Admin-Home.component.css']
})
export class AdminHomeComponent implements OnInit {
  totalGames:number = 0;
  totalBookedSlots: number = 0;
  totalFeedback: number = 0;
  constructor(private gameService: GameService,
              private userService: AuthenticateService,
              private feedbackService: FeedbackService,
              private logger: NGXLogger) { }

  ngOnInit() {
    this.gameService.getAllGames().subscribe((data:IGame[])=>{
      this.totalGames = data.length;
    });
    this.userService.getAllUser().subscribe((response)=>{
      this.logger.log(response);
      response.forEach(user => {
        this.totalBookedSlots = user.myBookings.length + this.totalBookedSlots;
      });
    });
    this.feedbackService.getAllFeedback().subscribe((response)=>{
      this.totalFeedback = response.length;
    })
  }

}
