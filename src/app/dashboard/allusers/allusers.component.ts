import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})

export class AllusersComponent implements OnInit {
  public userDetails;
  public myAuthToken;
  public allUsers;//this will hold all users except me
  public myFriends: any[] = [];
  public friendRequestSent: any[];// holds the userId of users to whom friend request has been sent

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userDetails = this.appService.getUserInfo();
    console.log('myDetails', this.userDetails);
    this.myAuthToken = this.userDetails.authToken;
    this.getUserDetail()
    this.getAllUsers();
  }

  //getting userdetail to set myFriends
  public getUserDetail() {
    this.appService.getUserDetailsById(this.userDetails.userId, this.myAuthToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          //initializing myFriends with data of friends
          this.myFriends = apiResponse['data']['friends'];
          console.log('myfriends : ', this.myFriends)

          //initializing sent friend
          this.friendRequestSent = apiResponse['data']['friendRequestSent'];
          console.log('friend sent : ', this.friendRequestSent)
        }
        else {
          this.toastr.error(apiResponse['message'])
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }

  //getting all users
  public getAllUsers() {
    this.appService.getAllUsers(this.myAuthToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.allUsers = apiResponse['data'];
          // console.log(this.allUsers);
          this.removeMeFromAllUsers(this.allUsers)
        }
        else {
          this.toastr.warning(apiResponse['message'])
        }

      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of getting allUsers

  //removing myself from all users
  public removeMeFromAllUsers(allUsers) {
    allUsers.forEach((users, index) => {
      if (users.userId === this.userDetails.userId) {
        allUsers.splice(index, 1);//removing myself from allUsers using array slice method
        // console.log(allUsers);
      }
    })

    //add status for friend request,if request has been sent or not
    this.addFriendStatus(this.allUsers)
  }//end of removing myself from allUsers

  public addFriendStatus(allUsers) {
    allUsers.map((user) => {
      // console.log('length : ', this.friendRequestSent.length)
      if(this.friendRequestSent)
      {
        if (this.friendRequestSent.length > 0) {
          for (let i = 0; i < this.friendRequestSent.length; i++) {
            if (this.friendRequestSent[i].friendId === user.userId) {
              user.status = 'requested';
              break;
            }
            else {
              user.status = 'not requested'
            }
          }
        }
      }
     
      else {
        //if there is not a single friendrequest sent by users than set user status to not requested for all
        user.status = 'not requested'
      }

      //if that user is on my friend list than add its status to friends
      if (this.myFriends.length > 0) {
        for (let i = 0; i < this.myFriends.length; i++) {
          if (this.myFriends[i].friendId === user.userId) {
            user.status = 'friends';
            break;
          }
        }
      }
    })
    console.log(allUsers)
  }

  // function for sending friend request
  public sendFriendRequest(user) {
    console.log('insied')
    let data =
    {
      senderId: this.userDetails.userId, //my userId
      receiverId: user.userId,
      authToken: this.myAuthToken,
      senderName: this.userDetails.userName,
      receiverName: `${user.firstName} ${user.lastName}`
    }
    console.log('data : ', data)
    //calling service method for sending friend request
    this.appService.sendFriendRequest(data).subscribe(
      (apiResponse) => {
        console.log('apiResponse : ', apiResponse)
        if (apiResponse['status'] === 200) {
          this.toastr.success('Friend request sent');

          //push userid to friendrequestsent array
          let data =
          {
            friendId: user.userId
          }

          this.friendRequestSent.push(data);

          //set this user status to requested
          this.addSingleUserFriendStatus(user.userId)
          // console.log(this.friendRequestSent)
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

  //setting single user status to requested after clicking add button 
  public addSingleUserFriendStatus(userId) {
    this.allUsers.map((user) => {
      if (user.userId === userId) {
        user.status = 'requested';
      }
    })
  }

}
