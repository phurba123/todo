import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {
  public userDetail: any;
  public myAuthToken;
  public myFriendRequests: any[] = [];

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userDetail = this.appService.getUserInfo();
    this.myAuthToken = this.userDetail.authToken;

    this.getAllMyFriendRequests();
  }

  public getAllMyFriendRequests() {
    this.appService.getFriendRequests(this.userDetail.userId, this.myAuthToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          //console.log(apiResponse)
          this.myFriendRequests = (apiResponse['data']['friendRequestReceived'])

          //set status of friend request as not accepted
          console.log('myfriend : ',this.myFriendRequests);
          
          if(this.myFriendRequests)
          {
            //console.log(this.myFriendRequests.length)

            //setting status as notaccepted for all friend requests present,if present
            this.setStatusOfRequestNotAccepted(this.myFriendRequests)
          }
        }
        else {
          this.toastr.warning(apiResponse['message'])
        }

      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }

  //setting status as notaccepted for all friend requests present
  public setStatusOfRequestNotAccepted(myRequests) {
    myRequests.map((request) => {
      request.status = 'notaccepted'
    })

    // console.log('myRequests', this.myFriendRequests)
  }//end of setting status as notaccepted

  //accepting friend request
  public acceptFriendRequest(sender) {
    console.log(sender)

    let data =
    {
      senderId: sender.friendId,
      senderName: sender.friendName,
      receiverId: this.userDetail.userId,
      receiverName: this.userDetail.userName,
      authToken: this.myAuthToken
    }

    console.log('data : ', data)

    this.appService.acceptFriendRequest(data).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          this.toastr.success('Request Accepted');
          //set this request status to accepted
          this.setRequestToAccepted(sender)
        }
        else {
          this.toastr.warning(apiresponse['message'])
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }

  //setting request to accepted
  public setRequestToAccepted(sender) {
    this.myFriendRequests.map((request) => {
      if (sender.friendId === request.friendId) {
        request.status = "accepted"
      }
    })
  }//end of setting request to accepted

}
