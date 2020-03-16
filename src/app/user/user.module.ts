import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms'



@NgModule({
  declarations: [SignupComponent, SignInComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class UserModule { }
