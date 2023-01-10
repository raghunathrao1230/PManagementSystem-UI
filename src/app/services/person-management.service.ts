import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PersonModel } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonManagementService {

  personMgmtApiUrl:string;
  constructor(private _http: HttpClient) { 
    this.personMgmtApiUrl=environment.personManagementApi;
  }

  savePersons(personModels:PersonModel[]):Observable<ApiResponse<string>>
  {
    return this._http.post<ApiResponse<string>>(this.personMgmtApiUrl,personModels)
  }
  
  getPersons():Observable<ApiResponse<PersonModel[]>>
  {
    return this._http.get<ApiResponse<PersonModel[]>>(this.personMgmtApiUrl)
  }
}
