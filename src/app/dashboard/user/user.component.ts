import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/list.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

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
  public selectedItemOfList: any;
  public itemEditTitle: string;//for editing the title of an item

  public userDetails:any;

  constructor(
    private listService: ListService,
    private toastr: ToastrService,
    private appService : AppService,
    private router:Router
  ) { }

  ngOnInit() {
    this.userDetails = this.appService.getUserInfo();
    this.myauthToken=this.userDetails.authToken;
    console.log('userDetails',this.userDetails)
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
          console.log('selectedList', this.selectedList)
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
      else {
        this.toastr.warning('item cannot be empty');
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

            this.toastr.success('list updated');
          }
        },
        (err) => {

        }
      );
    }

  }

  //function to delete list
  public deleteList() {
    if (this.selectedList) {
      this.listService.deleteList(this.selectedList.listId, this.myauthToken).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            setTimeout(() => {
              this.toastr.success('List deleted')
            }, 100)
            this.getAllToDoListOfUser();

            //clear selected list after deleting list
            this.selectedList = "";
          }
        }
      );
    }
  }

  public verticalEllipseClick(item) {
    this.selectedItemOfList = item;
    // console.log('selectedItemOfList', this.selectedItemOfList)
    //As user clicks on another item in a list ,clear its previous item edit title
    this.itemEditTitle="";
  }

  //function to delete item
  public deleteItem() {
    // console.log("selectedList : ",this.selectedList);
    // console.log('selectedItem : ',this.selectedItemOfList)
    if (this.selectedItemOfList) {
      this.listService.deleteItem(this.selectedItemOfList.itemId, this.selectedList.listId, this.myauthToken)
        .subscribe(
          (apiResponse) => {
            if (apiResponse['status'] === 200) {
              this.toastr.success('item deleted');
              this.getSingleList(this.selectedList.listId)
              //empty selected item of list after deleting that item
              this.selectedItemOfList = "";
            }
          }
        );
    }
  }

  //function to edit item title
  public editItem() {
    if (!this.itemEditTitle) {
      this.toastr.warning('nothing to edit')
    }
    else {
      //editing item
      let data =
      {
        itemId: this.selectedItemOfList.itemId,
        itemTitle: this.itemEditTitle,
        authToken: this.myauthToken
      }

      this.listService.editItem(data).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.toastr.success('item edited');

            // for refreshing the selected list
            this.getSingleList(this.selectedList.listId)
          }
        },
        (err) => {
          console.log(err)
        }
      );
    }
  }

  // public listChecker()
  // {
  //   console.log('list checked')
  // }

 


}
