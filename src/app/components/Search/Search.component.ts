import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { IGame } from 'src/models/game';
import { GameService } from 'src/services/game.service';

@Component({
  selector: 'app-Search',
  templateUrl: './Search.component.html',
  styleUrls: ['./Search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: IGame[] | undefined;
  constructor(private route : ActivatedRoute, private gameService: GameService, private logger: NGXLogger) { }

  ngOnInit() {
    let query = this.route.snapshot.paramMap.get('searchValue');
    this.logger.log(query);
    query && this.gameService.searchProducts(query).subscribe((result)=>{
      this.searchResult = result;
    })
  }

}
