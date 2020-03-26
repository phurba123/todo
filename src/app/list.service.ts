import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // backend url related to list
  private listBackendUrl = 'http://todolistbackend.phursang.xyz/api/v1/list';

  // backend url related to item of list
  private itemBaseUrl = 'http://todolistbackend.phursang.xyz/api/v1/list/item';

  // backend url related to subitem
  private subitemBaseUrl = 'http://todolistbackend.phursang.xyz/api/v1/list/item/subItem';

  constructor(
    private http: HttpClient
  ) { }

  /**Services related to list */
  public getAllListOfUser(authToken,userId) {
    return this.http.get(`${this.listBackendUrl}/${userId}/view/all?authToken=${authToken}`)
  }

  //create new list
  public createNewList(listTitle, authToken,listCreatorId,userId) {
    const params = new HttpParams()
      .set('listTitle', listTitle)
      .set('authToken', authToken)
      .set('listCreatorId',listCreatorId)
      .set('userId',userId)

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

  //marking item as done and undone
  public markItem(data)
  {
    console.log('type : ',typeof(data.isDone))
    console.log('inside service : ',data)
    const params = new HttpParams()
    .set('authToken',data.authToken)
    .set('isDone',data.isDone)

    return this.http.put(`${this.itemBaseUrl}/${data.itemId}/markitem`,params);
  }

  /**End of services related to item in a list */

  /**Services related to subitems */

  //getting subitems of item
  public getSubitemsOfItem(itemId,authToken)
  {
    return this.http.get(`${this.subitemBaseUrl}/${itemId}/view?authToken=${authToken}`)
  }//end of getting subitems

  //adding subitems to item
  public addSubitem(data)
  {
    const params = new HttpParams()
    .set('subItemTitle',data.subItemTitle)
    .set('authToken',data.authToken)

    return this.http.put(`${this.subitemBaseUrl}/${data.itemId}/addItem`,params)
  }

  //deleting subitem
  public deleteSubItem(data)
  {
    const params = new HttpParams()
    .set('authToken',data.authToken)
    .set('itemId',data.itemId)

    return this.http.post(`${this.subitemBaseUrl}/${data.subItemId}/delete`,params)
  }//end of delting subitem

  //edit subitem
  public editSubItem(data)
  {
    const params = new HttpParams()
    .set('authToken',data.authToken)
    .set('subItemTitle',data.subItemTitle)
    .set('modifierId',data.modifierId)
    .set('itemId',data.itemId)

    return this.http.put(`${this.subitemBaseUrl}/${data.subItemId}/edit`,params)
  }

  //**End of services related to subitems */
}
