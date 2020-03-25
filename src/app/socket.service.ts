import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://localhost:3000";
  public socket;

  constructor() {
    //connection to base url
    this.socket = io(this.baseUrl)
  }

  /**Events to be emitted 
  */

 //verify user event,data--userId,authToken
 public verifyUser(data)
 {
   this.socket.emit('verifyUser',data);
 }
  /**
   * End of events to be emitted
   */

   //notify updates related to list/items and subitems,--friendId,userId,data(message),friendemailId,friendName
   public notifyUpdates(data)
   {
     this.socket.emit('notify-updates',data);
   }
   /**Events to be listened 
  */

  //listen for autherror,(userId)
  public listenForAuthError(userId)
  {
    return Observable.create((observer) => {
      this.socket.on(`auth-error-${userId}`, (message) => {
        observer.next(message);
      });//On method
    });//end observable
  }

  // listen for updates
  public listenForUpdates(userId)
  {
    return Observable.create((observer)=>
    {
      this.socket.on(userId,(message)=>
      {
        observer.next(message)
      })
    })
  }
  /**
   * End of events to be listened
   */
}
