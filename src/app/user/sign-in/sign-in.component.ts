import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

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
    private appService : AppService
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
        if(apiResponse['status']===200)
        {
          this.toastr.success('SignIn success')
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

  public signInUsingKeyPress(event)
  {
    if(event.keyCode===13)
    {
      this.signIn()
    }
  }

}
