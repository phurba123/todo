import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listBackendUrl = 'http://localhost:3000/api/v1/list'

  constructor(
    private http:HttpClient
  ) { }

  //getting all the list of user
  public getAllListOfUser(authToken)
  {
    return this.http.get(`${this.listBackendUrl}/view/all?authToken=${authToken}`)
  }

  //create new list
  public createNewList(listTitle,authToken)
  {
    const params = new HttpParams()
    .set('listTitle',listTitle)
    .set('authToken',authToken)

    return this.http.post(`${this.listBackendUrl}/create`,params);
  }
}
