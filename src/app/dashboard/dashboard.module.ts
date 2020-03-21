import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FriendsComponent } from './friends/friends.component';
import { AllusersComponent } from './allusers/allusers.component';



@NgModule({
  declarations: [UserComponent, FriendsComponent, AllusersComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class DashboardModule { }
