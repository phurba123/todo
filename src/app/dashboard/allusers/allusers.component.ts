import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {
  public userDetails;
  public myAuthToken;
  public allUsers;//this will hold all users except me
  public myFriends:any[];
  public friendRequestSent:any;// holds the userId of users to whom friend request has been sent

  constructor(
    private appService:AppService,
    private cookie:CookieService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    this.userDetails=this.appService.getUserInfo();
    console.log('myDetails',this.userDetails);
    this.myAuthToken=this.cookie.get('token')
    this.getUserDetail()
    this.getAllUsers();
  }

  //getting userdetail to set myFriends
  public getUserDetail()
  {
    this.appService.getUserDetailsById(this.userDetails.userId,this.myAuthToken).subscribe(
      (apiResponse)=>
      {
        if(apiResponse['status']===200)
        {
          //initializing myFriends with data of friends
          this.myFriends = apiResponse['data']['friends'];

          //initializing sent friend
          this.friendRequestSent = apiResponse['data']['friendRequestSent'];
          console.log('friend sent : ',this.friendRequestSent)
        }
        else{
          this.toastr.error(apiResponse['message'])
        }
      },
      (err)=>
      {
        this.toastr.error(err.error.message)
      }
    )
  }

  //getting all users
  public getAllUsers()
  {
    this.appService.getAllUsers(this.myAuthToken).subscribe(
      (apiResponse)=>
      {
        if(apiResponse['status']===200)
        {
          this.allUsers=apiResponse['data'];
          // console.log(this.allUsers);
          this.removeMeFromAllUsers(this.allUsers)
        }
        else
        {
          //handle this later
          // console.log(apiResponse)
        }
        
      },
      (err)=>
      {
        console.log(err)
      }
    )
  }//end of getting allUsers

  //removing myself from all users
  public removeMeFromAllUsers(allUsers)
  {
    allUsers.forEach((users,index)=>
    {
      if(users.userId===this.userDetails.userId)
      {
        allUsers.splice(index,1);//removing myself from allUsers using array slice method
        // console.log(allUsers);
      }
    })
  }//end of removing myself from allUsers

  // function for sending friend request
  public sendFriendRequest(user)
  {
    let data = 
    {
      senderId:this.userDetails.userId, //my userId
      receiverId:user.userId,
      authToken:this.myAuthToken
    }
    console.log('data : ',data)
    //calling service method for sending friend request
    this.appService.sendFriendRequest(data).subscribe(
      (apiResponse)=>
      {
        console.log('apiResponse : ',apiResponse)
        if(apiResponse['status']===200)
        {
          this.toastr.success('Friend request sent');

          //push userid to friendrequestsent array
          let data = 
          {
            friendId:user.userId
          }

          this.friendRequestSent.push(data);
          console.log(this.friendRequestSent)
        }
        else
        {
          this.toastr.warning(apiResponse['message'])
        }
      },
      (err)=>
      {
        this.toastr.error(err.error.message)
      }
    )
  }

}
