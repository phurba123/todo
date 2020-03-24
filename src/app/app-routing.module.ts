import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { UserComponent } from './dashboard/user/user.component';
import { FriendsComponent } from './dashboard/friends/friends.component';
import { AllusersComponent } from './dashboard/allusers/allusers.component';
import { FriendRequestsComponent } from './dashboard/friend-requests/friend-requests.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';


const routes: Routes = [
  {path:'signin',component:SignInComponent},
  {path:'signup',component:SignupComponent},
  {path:'',redirectTo:'signin',pathMatch:'full'},
  {path:'forgotpassword',component:ForgotPasswordComponent},
  {path:'user',component:UserComponent},
  {path:'user/:userId/friends',component:FriendsComponent},
  {path:'user/allusers',component:AllusersComponent},
  {path:'user/friendrequests',component:FriendRequestsComponent},

  {path:'error/server',component:ServerErrorComponent},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
