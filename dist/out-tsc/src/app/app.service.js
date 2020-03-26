import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
let AppService = class AppService {
    constructor(http) {
        this.http = http;
        this.userBackendUrl = 'http://localhost:3000/api/v1/user';
    }
    //services for user management
    //signup
    signUp(data) {
        const params = new HttpParams()
            .set('firstName', data.firstName)
            .set('lastName', data.lastName)
            .set('email', data.email)
            .set('password', data.password)
            .set('mobileNumber', data.mobileNumber)
            .set('countryName', data.countryName);
        return this.http.post(`${this.userBackendUrl}/signup`, params);
    } //end of signup
    //signIn
    signIn(data) {
        const params = new HttpParams()
            .set('email', data.email)
            .set('password', data.password);
        return this.http.post(`${this.userBackendUrl}/signin`, params);
    } //end of signIn
    /**Countries related service*/
    //getting countries
    getCountryNames() {
        return this.http.get('../assets/countryNames.json');
    } //end of getting countries
    //getting country codes
    getCountryCodes() {
        return this.http.get('../assets/countryCodes.json');
    }
};
AppService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], AppService);
export { AppService };
//# sourceMappingURL=app.service.js.map