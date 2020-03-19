import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
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
  public newEditListTitle;//for editing list title
  public selectedList;//list gets selected when user click on one of the list;
  public listChecked = false;
  public newItemTitle;//title of newly created item

  constructor(
    private cookie: CookieService,
    private listService: ListService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.myauthToken = this.cookie.get('token')
    this.getAllToDoListOfUser();
  }

  //getting all the list of current user
  public getAllToDoListOfUser() {
    this.listService.getAllListOfUser(this.myauthToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.allList = apiResponse['data'];
          console.log('all list : ', this.allList)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  //public adding new list
  public addNewList() {
    if (!this.newListTitle) {
      this.toastr.warning('Title is empty')
    }
    else {
      this.listService.createNewList(this.newListTitle, this.myauthToken).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.toastr.success('List Created');
            this.newListTitle = "";//clearing input text after adding new list;
            this.getAllToDoListOfUser()
          }
        },
        (err) => {
          console.log(err)
          this.toastr.error(err.error.message)
        }
      )
    }
  }//end of adding new list

  //gets called when user click on any list
  public getSingleList(listId) {
    if (listId) {
      this.listService.getSingleList(listId, this.myauthToken).subscribe(
        (apiResponse) => {
          console.log(apiResponse);
          this.selectedList = apiResponse['data'];
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

  // adding new item to list
  public addNewItem() {
    if (this.selectedList) {
      if (this.newItemTitle) {
        this.listService.addItemToList(this.selectedList.listId, this.newItemTitle, this.myauthToken)
          .subscribe(
            (apiResponse) => {
              if (apiResponse['status'] === 200) {
                //console.log(apiResponse);

                //recalling getSingleList after adding a new item to get it reflected on a view
                this.getSingleList(this.selectedList.listId);
                this.newItemTitle = "";//clearing text after adding item to list;

                this.toastr.success('new item added')
              }
              else {
                this.toastr.error(apiResponse['message'])
              }
            },
            (err) => {
              //redirect to internal error
              console.log(err)
            }
          )
      }

    }
  }

  //function to editListTitle
  public editListTitle() {
    if (!this.newEditListTitle) {
      this.toastr.warning('Title is required')
    }
    else {
      this.listService.editListTitle(this.selectedList.listId, this.myauthToken, this.newEditListTitle).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.getAllToDoListOfUser();
            this.getSingleList(this.selectedList.listId);
            this.newEditListTitle = "";//cleart edit text box after updating list title

            this.toastr.success('list updated')
          }
        },
        (err) => {

        }
      );
    }

  }

  // public listChecker()
  // {
  //   console.log('list checked')
  // }

  ngOnChanges(change: SimpleChange) {
    console.log('change : ', change)
  }

}
