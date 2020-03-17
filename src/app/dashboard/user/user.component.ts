import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ListService } from 'src/app/list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public myauthToken;
  public allList;//store all list of user
  public newListTitle;

  constructor(
    private cookie:CookieService,
    private listService : ListService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    this.myauthToken=this.cookie.get('token')
    this.getAllToDoListOfUser();
  }

  //getting all the list of current user
  public getAllToDoListOfUser()
  {
    this.listService.getAllListOfUser(this.myauthToken).subscribe(
      (apiResponse)=>
      {
        if(apiResponse['status']===200)
        {
          this.allList = apiResponse['data'];
        }
      },
      (err)=>
      {
        console.log(err)
      }
    )
  }

  //public adding new list
  public addNewList()
  {
    if(!this.newListTitle)
    {
      this.toastr.warning('Title is empty')
    }
    else
    {
      this.listService.createNewList(this.newListTitle,this.myauthToken).subscribe(
        (apiResponse)=>
        {
          if(apiResponse['status']===200)
          {
            this.toastr.success('List Created');
            this.newListTitle="";//clearing input text after adding new list
          }
        },
        (err)=>
        {
          console.log(err)
          this.toastr.error(err.error.message)
        }
      )
    }
  }//end of adding new list

}
