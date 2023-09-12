import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthenticateService } from 'src/services/authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {

  constructor(private authService: AuthenticateService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      if(this.authService.isLoggedIn()){
        return true;
      }
      else{
        this.router.navigate(["/login"],{queryParams:{returnUrl:state.url}});
        return false;
      }
    }
}

