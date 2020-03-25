import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public myUserId;
  public myAuthToken;
  public myUserDetails;
  public myFriends: any;
  public userDetails;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.myUserId = this.route.snapshot.paramMap.get('userId');
    this.userDetails = this.appService.getUserInfo()
    this.myAuthToken = this.userDetails.authToken;
    // console.log(this.myAuthToken)
    this.getUserDetail();
  }

  public getUserDetail() {
    if (this.myUserId) {
      this.appService.getUserDetailsById(this.myUserId, this.myAuthToken).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.myUserDetails = apiResponse['data'];
            // console.log(this.myUserDetails);

            //initializing myFriends variable to hold array of friends
            this.myFriends = apiResponse['data']['friends'];
          }
        }
      );
    }
  }//

  //friend is selected from friend list
  public friendClicked(friend) {
    console.log(friend)

    //first,delete friendInfo from local storage and set new
    this.appService.deleteFriendInfo();

    // get friend details from server to get his email ,email will be used while sending mail from backend
    this.appService.getUserDetailsById(friend.friendId, this.myAuthToken).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {

          //set new friendinfo
          let friendInfo =
          {
            isFriendSelected: true,
            friendId: friend.friendId,
            friendName: friend.friendName,
            friendEmail: apiresponse['data']['email']
          }
          this.appService.setFriendInfo(friendInfo);

          //than navigate to user component displaying friends data
          this.router.navigate(['/user']);
        }
        else {
          this.toastr.warning(apiresponse['message'])
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    );
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
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of logout

}
