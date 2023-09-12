import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticateService } from 'src/services/authenticate.service';

import { Router } from '@angular/router';
import { onSessionExpired } from 'src/app/SweetAlert';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticateService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      });
    }
    return next.handle(request).pipe(
      catchError((error:any)=>{
        if(error instanceof HttpErrorResponse){
          if(error.status === 401){
            onSessionExpired();
            this.router.navigate(['/login']);
          }
        }
        return throwError(()=> new Error("Something went wrong"))
      })
    );
  }
}
