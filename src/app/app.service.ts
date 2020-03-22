import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private userBackendUrl = 'http://localhost:3000/api/v1/user'

  constructor(
    private http: HttpClient
  ) { }

  /**Services related to users */

  //signup
  public signUp(data) {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('password', data.password)
      .set('mobileNumber', data.mobileNumber)
      .set('countryName', data.countryName)
    return this.http.post(`${this.userBackendUrl}/signup`, params);
  }//end of signup

  //signIn
  public signIn(data) {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.userBackendUrl}/signin`, params);
  }//end of signIn

  //getting all users
  public getAllUsers(authToken)
  {
    return this.http.get(`${this.userBackendUrl}/view/all?authToken=${authToken}`)
  }

  //getting userdetails by userid
  public getUserDetailsById(userId,authToken)
  {
    return this.http.get(`${this.userBackendUrl}/${userId}/view?authToken=${authToken}`)
  }

  //for sending friend request
  public sendFriendRequest(data)
  {
    const params = new HttpParams()
    .set('senderId',data.senderId)
    .set('receiverId',data.receiverId)
    .set('authToken',data.authToken)
    .set('senderName',data.senderName)
    .set('receiverName',data.receiverName)

    return this.http.put(`${this.userBackendUrl}/request/friend`,params);
  }//end of sending friend request

  //for getting friend request received
  public getFriendRequests(userId,authToken)
  {
    return this.http.get(`${this.userBackendUrl}/${userId}/view/friendrequests?authToken=${authToken}`)
  }

  //accepting friend request
  public acceptFriendRequest(data)
  {
    const params = new HttpParams()
    .set('senderId',data.senderId)
    .set('senderName',data.senderName)
    .set('receiverId',data.receiverId)
    .set('receiverName',data.receiverName)
    .set('authToken',data.authToken)

    return this.http.post(`${this.userBackendUrl}/accept/friend/request`,params)
  }//end of accepting friend request

  /**End of services related to users */



  /**Countries related service*/

  //getting countries
  public getCountryNames() {
    return this.http.get('../assets/countryNames.json')
  }//end of getting countries

  //getting country codes
  public getCountryCodes() {
    return this.http.get('../assets/countryCodes.json');
  }
  /**End of countries related service  */


  /**Local storage */

  //setting user info
  public setUserInfo(userDetail)
  {
    localStorage.setItem('userInfo',JSON.stringify(userDetail));
  }

  //getting userDetails
  public getUserInfo()
  {
   return JSON.parse(localStorage.getItem('userInfo'));
  }
}
