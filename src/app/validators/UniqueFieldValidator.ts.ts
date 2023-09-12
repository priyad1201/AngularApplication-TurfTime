// import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
// import { Observable, map } from "rxjs";
// import { GameService } from "src/services/game.service";

// export function UniqueNameValidator(gameService:GameService): AsyncValidatorFn {
//   return(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     return gameService.getSportName(control.value).pipe(
//       map(games=>{
//         return games && games.length > 0 ? {'uniqueSportName':true} : null;
//       })
//     );
//   }
// }

