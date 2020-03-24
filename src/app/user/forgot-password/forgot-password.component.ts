import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public email;

  constructor(
    private toastr:ToastrService,
    private router:Router,
    private appService:AppService
  ) { }

  ngOnInit() {
  }

  //function for resetting password
  public resetPassword() {
    console.log('inside resetPass')
    if (!this.email) {
      this.toastr.warning('Email required')
    }
    else {
      this.appService.forgotPassword(this.email).subscribe((apiResponse) => {
        console.log(apiResponse)
        if (apiResponse['status'] === 200) {
          this.toastr.success(apiResponse['message']);
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 1500);
        }
        else {
          this.toastr.warning(apiResponse['message'])
        }
      },
        (err) => {
          this.toastr.error(err.error.message)
        })
    }
  }//end of resetting function

  public keyPressEvent(event) {
    
    if (event.keyCode === 13) {
      this.resetPassword()
    }
  }

}
