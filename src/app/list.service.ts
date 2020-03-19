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

  /**Services related to list */
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
  public getSingleList(listId, authToken) {
    return this.http.get(`${this.listBackendUrl}/${listId}/view?authToken=${authToken}`)
  }

  //editing list title by list id
  public editListTitle(listId, authToken, newTitle) {
    const params = new HttpParams()
      .set('listTitle', newTitle)
      .set('authToken', authToken)

    return this.http.put(`${this.listBackendUrl}/${listId}/editTitle`, params);
  }

  //deleting list
  public deleteList(listId, authToken) {
    const params = new HttpParams()
      .set('authToken', authToken);

    return this.http.post(`${this.listBackendUrl}/${listId}/delete`, params)
  }

  /**End of services related to list */

  /**Services related to item in a list */

  //add new item to a list
  public addItemToList(listId, itemTitle, authToken) {
    const params = new HttpParams()
      .set('itemTitle', itemTitle)
      .set('authToken', authToken);

    return this.http.put(`${this.itemBaseUrl}/${listId}/addItem`, params);
  }//end of adding new item to list

  //delete item in a list
  public deleteItem(itemId, listId, authToken) {
    const params = new HttpParams()
      .set('listId', listId)
      .set('authToken', authToken)

    return this.http.post(`${this.itemBaseUrl}/${itemId}/deleteItem`, params);
  }

  //edit item with a new title
  public editItem(data)
  {
    const params = new HttpParams()
    .set('itemTitle',data.itemTitle)
    .set('authToken',data.authToken)

    return this.http.put(`${this.itemBaseUrl}/${data.itemId}/editItemTitle`,params);
  }

  /**End of services related to item in a list */
}
