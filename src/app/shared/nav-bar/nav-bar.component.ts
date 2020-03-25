import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {Location} from '@angular/common'
import { HistoryService } from 'src/app/history.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers:[Location]
})
export class NavBarComponent implements OnInit {
  @Input() component: string;//used for getting what component currently is using this nav

  public activeComponent;//used for storing currently active component;
  public friendDetails;
  public userDetails;
  public myAuthToken;

  public allHistories:any[];

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    private location:Location,
    private historyService:HistoryService
  ) { }

  ngOnInit() {
    this.activeComponent = this.component;
    this.friendDetails = this.appService.getFriendInfo();
    this.userDetails = this.appService.getUserInfo();
    this.myAuthToken = this.userDetails.authToken;

    if(this.friendDetails.isFriendSelected==false)
    {
      this.getAllHistory(this.userDetails.userId);
    }
    else
    {
      this.getAllHistory(this.friendDetails.friendId)
    }

  }

  public getAllHistory(userId)
  {
    this.historyService.getAllHistories(userId,this.myAuthToken).subscribe(
      (apiresponse)=>
      {
        if(apiresponse['status']===200)
        {
          console.log('fj',apiresponse)
          this.allHistories = apiresponse['data'];
          console.log('')
        }
        
      },
      (err)=>
      {
        this.router.navigate(['/error/server'])
      }
    )
  }

  //logging out
  public logout() {
    this.appService.signout(this.myAuthToken).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          this.toastr.success('Logged Out');
          //delete local storages
          this.appService.deleteFriendInfo();
          this.appService.deleteUserInfo();

          //navigate to signin page
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 1000)
        }
        else {
          this.toastr.warning(apiresponse['message'])
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of logout

  /** if iam currently on friend dashboard,than by clicking back button i will go to my dashboard by clearing 
currently selected friend from local storage*/

  public goBackFromFriendDashboard() {
    console.log('inside')

    this.manageFriendInfo();
    //after deleting friend info navigate to home component,than,my details will show
    this.location.back();

  }

  public manageFriendInfo()
  {

    //reset friendinfo from local storage
    this.appService.deleteFriendInfo();

    let friendInfo =
    {
      isFriendSelected: false,
      friendId: '',
      friendName: ''
    }
    this.appService.setFriendInfo(friendInfo)
  }

}
