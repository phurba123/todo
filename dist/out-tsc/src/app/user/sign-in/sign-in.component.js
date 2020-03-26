import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let SignInComponent = class SignInComponent {
    constructor(toastr, appService, router, cookie) {
        this.toastr = toastr;
        this.appService = appService;
        this.router = router;
        this.cookie = cookie;
    }
    ngOnInit() {
    }
    //signIn function
    signIn() {
        if (!this.email) {
            this.toastr.warning('Enter email');
        }
        else if (!this.password) {
            this.toastr.warning('Enter password');
        }
        else {
            let data = {
                email: this.email,
                password: this.password
            };
            this.appService.signIn(data).subscribe((apiResponse) => {
                //console.log(apiResponse)
                if (apiResponse['status'] === 200) {
                    this.toastr.success('SignIn success');
                    //set authToken to cookie
                    this.cookie.set('token', apiResponse['data']['authToken']);
                    //on successfull sign in ,navigate to user dashboard
                    setTimeout(() => {
                        this.router.navigate(['user']);
                    });
                }
                else {
                    this.toastr.error(apiResponse['message']);
                }
            }, (err) => {
                console.log('inside err');
                console.log('error ', err);
                this.toastr.error(err.message);
            });
        }
    }
    //signin using enter keypress
    signInUsingKeyPress(event) {
        if (event.keyCode === 13) {
            this.signIn();
        }
    } //end of keypress event
};
SignInComponent = tslib_1.__decorate([
    Component({
        selector: 'app-sign-in',
        templateUrl: './sign-in.component.html',
        styleUrls: ['./sign-in.component.css']
    })
], SignInComponent);
export { SignInComponent };
//# sourceMappingURL=sign-in.component.js.map