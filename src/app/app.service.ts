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

  //services for user management

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
}
