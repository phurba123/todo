import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // backend url related to list
  private listBackendUrl = 'http://localhost:3000/api/v1/list';

  // backend url related to item of list
  private itemBaseUrl = 'http://localhost:3000/api/v1/list/item';

  constructor(
    private http: HttpClient
  ) { }

  //getting all the list of user
  public getAllListOfUser(authToken) {
    return this.http.get(`${this.listBackendUrl}/view/all?authToken=${authToken}`)
  }

  //create new list
  public createNewList(listTitle, authToken) {
    const params = new HttpParams()
      .set('listTitle', listTitle)
      .set('authToken', authToken)

    return this.http.post(`${this.listBackendUrl}/create`, params);
  }

  //getting single list by list id
  public getSingleList(listId,authToken)
  {
    return this.http.get(`${this.listBackendUrl}/${listId}/view?authToken=${authToken}`)
  }

  //editing list title by list id
  public editListTitle(listId,authToken,newTitle)
  {
    const params = new HttpParams()
    .set('listTitle',newTitle)
    .set('authToken',authToken)

    return this.http.put(`${this.listBackendUrl}/${listId}/editTitle`,params);
  }

  //add new item to a list
  public addItemToList(listId, itemTitle, authToken) {
    const params = new HttpParams()
      .set('itemTitle', itemTitle)
      .set('authToken', authToken);

    return this.http.put(`${this.itemBaseUrl}/${listId}/addItem`, params);
  }//end of adding new item to list
}
