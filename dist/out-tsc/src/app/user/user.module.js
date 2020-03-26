import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    NgModule({
        declarations: [SignupComponent, SignInComponent, ForgotPasswordComponent],
        imports: [
            CommonModule,
            RouterModule,
            FormsModule
        ]
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map