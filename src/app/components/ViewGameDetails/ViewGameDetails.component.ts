import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { IGame } from 'src/models/game';
import { GameService } from 'src/services/game.service';
import { OfferService } from 'src/services/offer.service';

@Component({
  selector: 'app-ViewGameDetails',
  templateUrl: './ViewGameDetails.component.html',
  styleUrls: ['./ViewGameDetails.component.css']
})
export class ViewGameDetailsComponent implements OnInit {
  gameData!:IGame;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              protected offerService: OfferService,
              private logger: NGXLogger) { }

  ngOnInit() {
    let gameId = this.route.snapshot.paramMap.get('id');
    gameId && this.gameService.getGame(gameId).subscribe((result)=>{
      this.logger.log(result);
      this.gameData  = result;
    })
  }

}
