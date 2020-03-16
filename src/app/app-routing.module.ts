import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';


const routes: Routes = [
  {path:'signin',component:SignInComponent},
  {path:'signup',component:SignupComponent},
  {path:'',redirectTo:'signin',pathMatch:'full'},
  {path:'forgotpassword',component:ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
