import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { IGame } from 'src/models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  baseApiUrl:string = `${environment.apiBaseUrl}Game/`;

  constructor(private httpClient : HttpClient) { }
    getAllGames(): Observable<IGame[]>{
      return this.httpClient.get<IGame[]>(this.baseApiUrl)
    }
    addGame(data:FormData): Observable<IGame>{
       return this.httpClient.post<IGame>(this.baseApiUrl,data);
    }
    getGame(id:string): Observable<IGame>{
      return this.httpClient.get<IGame>(this.baseApiUrl+id);
    }
    getGameDetails(sportName: string): Observable<IGame>{
      return this.httpClient.get<IGame>(`${this.baseApiUrl}sportName?sportName=`+sportName);
    }
    getSportAvailableInVenue(venueName:string): Observable<IGame[]>{
      return this.httpClient.get<IGame[]>(`${this.baseApiUrl}venueName?venueName=`+encodeURIComponent(venueName))
    }
    // getSportName(name:string){
    //   return this.httpClient.get<string>(`${this.baseApiUrl}/api/Game/sport/${name}`);
    // }
    searchProducts(searchValue: string): Observable<IGame[]>{
      return this.httpClient.get<IGame[]>(`${this.baseApiUrl}search?sportName=${searchValue}`)
    }
    editGame(id:number,updateGameRequest:FormData): Observable<IGame>{
      return this.httpClient.put<IGame>(`${this.baseApiUrl}`+id,updateGameRequest);
    }

    deleteGame(id:number): Observable<IGame>{
      return this.httpClient.delete<IGame>(this.baseApiUrl+id);
    }

}
