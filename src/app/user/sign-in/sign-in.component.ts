import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public email:any;
  public password:any;

  constructor(
    private toastr:ToastrService,
    private appService : AppService,
    private router:Router,
    private cookie:CookieService
  ) { }

  ngOnInit() {
  }

  //signIn function
  public signIn()
  {
    if(!this.email)
    {
      this.toastr.warning('Enter email')
    }
    else if(!this.password)
    {
      this.toastr.warning('Enter password')
    }
    else
    {
      let data = 
      {
        email:this.email,
        password:this.password
      };

      this.appService.signIn(data).subscribe((apiResponse)=>
      {
        //console.log(apiResponse)
        if(apiResponse['status']===200)
        {
          this.toastr.success('SignIn success');

          //set authToken to cookie
          this.cookie.set('token',apiResponse['data']['authToken'])
          //on successfull sign in ,navigate to user dashboard
          setTimeout(()=>
          {
            this.router.navigate(['user'])
          })
        }
        else
        {
          this.toastr.error(apiResponse['message'])
        }
      },
      (err)=>
      {
        this.toastr.error(err.message)
      })
    }
  }

  //signin using enter keypress
  public signInUsingKeyPress(event)
  {
    if(event.keyCode===13)
    {
      this.signIn()
    }
  }//end of keypress event

}
