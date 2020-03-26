import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { UserComponent } from './dashboard/user/user.component';
const routes = [
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'user', component: UserComponent }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map