import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import { AppService } from 'src/app/app.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public myUserId;
  public myAuthToken;
  public myUserDetails;
  public myFriends:any;

  constructor(
    private route:ActivatedRoute,
    private appService:AppService,
    private cookie:CookieService
  ) { }

  ngOnInit() {
    this.myUserId=this.route.snapshot.paramMap.get('userId');
    this.myAuthToken= this.cookie.get('token')
    // console.log(this.myAuthToken)
    this.getUserDetail();
  }

  public getUserDetail()
  {
    if(this.myUserId)
    {
      this.appService.getUserDetailsById(this.myUserId,this.myAuthToken).subscribe(
        (apiResponse)=>
        {
          if(apiResponse['status']===200)
          {
            this.myUserDetails= apiResponse['data'];
            // console.log(this.myUserDetails);

            //initializing myFriends variable to hold array of friends
            this.myFriends=  apiResponse['data']['friends'];
          }
        }
      );
    }
  }

}
