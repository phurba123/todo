import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl ="http://localhost:3000/api/v1/histories"

  constructor(
    private http:HttpClient
  ) { }

  //get all histories of user
  public getAllHistories(userId,authToken)
  {
    return this.http.get(`${this.baseUrl}/${userId}/view/all?authToken=${authToken}`);
  }

  //add history--must contain userId and category
  public addHistory(data)
  {
    const params = new HttpParams()
    .set('userId',data.userId)
    .set('category',data.category)
    .set('listId',data.listId)
    .set('message',data.message)
    .set('itemId',data.itemId)
    .set('subItemId',data.subItemId)
    .set('authToken',data.authToken)

    return this.http.post(`${this.baseUrl}/add`,params)
  }
}

// historyId: shortid.generate(),
//                 userId: req.body.userId,
//                 listId: req.body.listId,
//                 category: req.body.category,
//                 createdOn: timeLib.now(),
//                 itemId: req.body.itemId,
//                 subItemId: req.body.subItemId,
//                 message: req.body.message

// let baseUrl = `${appConfig.apiVersion}/histories`;
//     //adding new history
//     //params-
//     app.post(`${baseUrl}/add`,authMiddleware.isAuthorized,historiesController.addHistory);

//     app.get(`${baseUrl}/:userId/view/all`,authMiddleware.isAuthorized,historiesController.getAllHistoryOfUser)

//     app.post(`${baseUrl}/:userId/delete`,authMiddleware.isAuthorized,historiesController.deleteHistoryOfUser)
