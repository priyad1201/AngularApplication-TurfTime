import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthenticateService } from 'src/services/authenticate.service';
import { UserDataService } from 'src/services/user-data.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleBasedGuard implements CanActivate {
  constructor(private authService: AuthenticateService, private userData: UserDataService, private router: Router){}
  role:string = '';
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      this.userData.getRoleFromStore().subscribe((value)=>{
        const roleFromToken = this.authService.getRoleFromToken();
        this.role = value || roleFromToken;
      });
        const data = route.data as { role: string };

        const isAuthorized = this.role === data.role;
        if(!isAuthorized){
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'You are not allowed to view this page',
          });
          if(this.role=="Admin"){
            this.router.navigate(['/admin-home']);
          }
          else if(this.role=="User"){
            this.router.navigate(['/user-home']);
          }
        }
        return isAuthorized;
    }
}

