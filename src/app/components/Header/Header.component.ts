import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGame } from 'src/models/game';
import { AuthenticateService } from 'src/services/authenticate.service';
import { GameService } from 'src/services/game.service';
import { UserDataService } from 'src/services/user-data.service';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {

  fullName:string = '';
  role:string = '';
  searchResult: IGame[] | undefined;

  menuType:string = 'default';
  constructor(public authService: AuthenticateService,
             private userData: UserDataService,
            private gameService: GameService,
            private router: Router) { }

  ngOnInit() {

    this.userData.getNameFromStore().subscribe(value=>{
      const fullNameFromToken = this.authService.getNameFromToken();
      this.fullName = value || fullNameFromToken;
    });

    this.userData.getRoleFromStore().subscribe(value=>{
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = value || roleFromToken;
      if(this.role =="Admin")
        this.menuType = 'admin'
      else if(this.role == "User")
        this.menuType = 'default'
      else
        this.menuType = 'default'
    });
  }
  logout(){
    this.authService.signOut();
    this.menuType = 'default'
  }
  searchProduct(query:KeyboardEvent){
    if(query){
      const element =query.target as HTMLInputElement;
      this.gameService.searchProducts(element.value).subscribe((result)=>{
        this.searchResult =result;
      })
    }
  }
  hideSearch(){
    this.searchResult =undefined
  }

  redirectToDetails(id:number){
    this.router.navigate(['/user-viewGameDetails/'+ id])
  }
  submitSearch(searchValue:String){
    this.router.navigate([`user-search/${searchValue}`]);
  }
}
