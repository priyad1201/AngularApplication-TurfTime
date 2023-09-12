import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';

export interface IDeactivateGuard{
  canExit:()=>boolean | Promise<boolean> | Observable<boolean>;
}
export class DeactivateGuard implements CanDeactivate<IDeactivateGuard> {
  canDeactivate(
    component: IDeactivateGuard): boolean | Promise<boolean> | Observable<boolean>{
    return component.canExit?component.canExit():false;
  }

}
