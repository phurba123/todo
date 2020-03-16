import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName;
  public lastName;
  public mobileNumber;
  public password;
  public email;

  public allCountries;
  public countries:any[]=[];
  public countryCode:any;
  public countryName: string;
  public country:any;//will store country shorthand
  public countryCodes:any;

  constructor(
    private appService: AppService,
    private toastr:ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.getCountries();
    this.getCountryCodes();
  }

  public onChangeOfCountry() {

    this.countryCode = this.countryCodes[this.country];
    this.countryName = this.allCountries[this.country];
  }//end onChangeOfCountry

  //getting country names
  public getCountries() {
    this.appService.getCountryNames()
      .subscribe((data) => {
        this.allCountries = data;
        for (let x in data) {

          let singleCountry = {
            name: data[x],
            code: x
          }
          this.countries.push(singleCountry);
        }
        this.countries = this.countries.sort((first, second) => {
          return first.name.toUpperCase() < second.name.toUpperCase() ? -1 : (first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
        });//end sort
      })//end subscribe

  }

  public getCountryCodes() {
    this.appService.getCountryCodes()
      .subscribe((data) => {
        this.countryCodes = data;
      })//end subscribe
  }//end getCountries

  //signing up
  public signUp()
  {
    if(!this.firstName)
    {
      this.toastr.warning('Enter first name')
    }
    else if(!this.lastName)
    {
      this.toastr.warning('Enter last name')
    }
    else if(!this.email)
    {
      this.toastr.warning('Enter email')
    }
    else if(!this.password)
    {
      this.toastr.warning('Enter password')
    }
    else if(!this.mobileNumber)
    {
      this.toastr.warning('Enter mobile number')
    }
    else
    {
      let data = 
      {
        firstName:this.firstName,
        lastName:this.lastName,
        email:this.email,
        password:this.password,
        mobileNumber:`${this.countryCode} ${this.mobileNumber}`,
        countryName:this.countryName
      }

      this.appService.signUp(data).subscribe((apiResponse)=>
      {
        if(apiResponse['status']===200)
        {
          this.toastr.success('signup success');
          setTimeout(()=>
          {
            this.router.navigate(['signin'])
          },1000)

        }
        else
        {
          this.toastr.error(apiResponse['message'])
        }
      },
      (error)=>
      {
        console.log('error : ',error )
        this.toastr.error(error.name)
      })
    }
  }

  //keypress signup 
  public signUpUsingKeyPress(event)
  {
   
    if(event.keyCode===13)
    {
      this.signUp();
    }
  }
}
