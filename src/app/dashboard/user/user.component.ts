import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/list.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { SocketService } from 'src/app/socket.service';
import { HistoryService } from 'src/app/history.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [Location]
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
  public subItemsOfItem: any[] = [];
  public newSubItemTitle: any;
  public editSubItemTitle;
  public currentSubItem: any;

  public userDetails: any;
  public friendDetails: any;

  constructor(
    private listService: ListService,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
    private location: Location,
    private socketService: SocketService,
    private historyService :HistoryService
  ) { }

  ngOnInit() {
    this.userDetails = this.appService.getUserInfo();
    this.myauthToken = this.userDetails.authToken;
    this.friendDetails = this.appService.getFriendInfo();
    console.log('userDetails', this.userDetails)
    console.log('authtoken : ', this.myauthToken);

    //socket event verifyUser
    this.verifyUser();

    this.validateUser();

    //listen for updates
    this.listenForUpdates();

  }
  //validate if friend  is selected or not
  public validateUser() {
    if (this.friendDetails.isFriendSelected) {
      this.getAllToDoListOfUser(this.friendDetails.friendId)
    }
    else {
      this.getAllToDoListOfUser(this.userDetails.userId);
    }
  }

  //verify user
  public verifyUser() {
    let data =
    {
      userId: this.userDetails.userId,
      authToken: this.myauthToken
    }
    this.socketService.verifyUser(data);
    //listen for autherror,will get notified if authToken is invalid
    this.socketService.listenForAuthError(this.userDetails.userId).subscribe((message) => {
      this.toastr.error(message);
    })
  }//end of verifyUser

  //listen for updates
  public listenForUpdates() {
    this.socketService.listenForUpdates(this.userDetails.userId).subscribe((message) => {
      this.getAllToDoListOfUser(this.userDetails.userId);
      if (this.selectedList) {
        this.getSingleList(this.selectedList.listId);
        //this.getSubItems(this.selectedList);
      }
      this.toastr.info(message);
    })
  }

  //getting all the list of current user
  public getAllToDoListOfUser(userId) {
    this.listService.getAllListOfUser(this.myauthToken, userId).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.allList = apiResponse['data'];
          console.log('all list : ', this.allList)
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }

  //public adding new list
  public addNewList() {
    if (!this.newListTitle) {
      this.toastr.warning('Title is empty')
    }
    else {
      let currentUserId = "";//user id to whom this lists belongs to,

      //if new list is being created on friend lists,than
      if (this.friendDetails.isFriendSelected) {
        //if friend is selected,than this current lists belongs to that friend,but creator will be me
        currentUserId = this.friendDetails.friendId;
      }
      else {
        currentUserId = this.userDetails.userId
      }
      this.listService.createNewList(this.newListTitle, this.myauthToken, this.userDetails.userId, currentUserId).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.toastr.success('List Created');
            //console.log(apiResponse)
            this.newListTitle = "";//clearing input text after adding new list;
            this.allList.push(apiResponse['data']);

            //if friend list is being added ,notify that friend
            if (currentUserId != this.userDetails.userId) {
              let historydata =
              {
                userId:currentUserId,
                category:'list-add',
                message:`${this.userDetails.userName} has added a new list to your list's`,
                listId:apiResponse['data']['listId'],
                authToken:this.myauthToken
              }
              //save on history
              this.saveHistory(historydata);

              let data =
              {
                friendId: currentUserId,
                message: `${this.userDetails.userName} has added a new list to your list's`,
                friendEmail: this.friendDetails.friendEmail,
                friendName: this.friendDetails.friendName,
                
              }

              this.socketService.notifyUpdates(data)
            }
          }
        },
        (err) => {
          this.router.navigate(['/error/server'])
        }
      )
    }
  }//end of adding new list

  //save on history
  public saveHistory(data)
  {
    this.historyService.addHistory(data).subscribe(
      (apiresponse)=>
      {
        if(apiresponse['status']===200)
        {
          console.log(' : ',apiresponse)
        }
      },
      (err)=>
      {
        //
      }
    )
  }

  //gets called when user click on any list
  public getSingleList(listId) {
    if (listId) {
      this.listService.getSingleList(listId, this.myauthToken).subscribe(
        (apiResponse) => {
          console.log(apiResponse);
          this.selectedList = apiResponse['data'];

          this.getSubItems(this.selectedList)
          console.log('selectedList', this.selectedList)
        },
        (err) => {
          this.router.navigate(['/error/server'])
        }
      )
    }
  }

  //getting subitems
  public getSubItems(selectedlist) {
    this.subItemsOfItem = [];
    console.log(selectedlist['items'].length)

    //iterate through items of list
    if (selectedlist['items'].length > 0) {
      selectedlist['items'].map((singleItem) => {
        this.listService.getSubitemsOfItem(singleItem.itemId, this.myauthToken).subscribe(
          (apiresponse) => {
            // if subitem is present than only push it onto suitemslist
            if (apiresponse['data']) {
              this.subItemsOfItem.push(apiresponse['data'])
              //console.log('subitem',this.subItemsOfItem)
            }

          }
        )
      })
    }

  }//end of getting subitems

  // adding new item to list
  public addNewItem() {
    if (this.selectedList) {
      if (this.newItemTitle) {
        this.listService.addItemToList(this.selectedList.listId, this.newItemTitle, this.myauthToken)
          .subscribe(
            (apiResponse) => {
              if (apiResponse['status'] === 200) {
                console.log(apiResponse);

                //recalling getSingleList after adding a new item to get it reflected on a view
                this.getSingleList(this.selectedList.listId);
                this.newItemTitle = "";//clearing text after adding item to list;

                this.toastr.success('new item added');

                //if new item is being added on friends list,than update friend
                if (this.friendDetails.isFriendSelected) {

                  //saving history
                  let historydata =
                  {
                    userId:this.friendDetails.friendId,
                    category:'item-add',
                    message:`${this.userDetails.userName} has added a new item to your list's`,
                    listId:this.selectedList.listId,
                    itemId:apiResponse['data']['itemId'],
                    authToken:this.myauthToken
                  }
                  console.log('historydata : ',historydata);
                  //save on history
                  this.saveHistory(historydata);
                  
                  let data =
                  {
                    friendId: this.friendDetails.friendId,
                    message: `${this.userDetails.userName} has added a new item to your list`,
                    friendEmail: this.friendDetails.friendEmail,
                    friendName: this.friendDetails.friendName
                  }

                  this.socketService.notifyUpdates(data);
                }
              }
              else {
                this.toastr.error(apiResponse['message'])
              }
            },
            (err) => {
              //redirect to internal error
              this.router.navigate(['/error/server'])
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
            this.validateUser();
            this.getSingleList(this.selectedList.listId);
            this.newEditListTitle = "";//cleart edit text box after updating list title

            //notify if friends list is being edited
            if (this.friendDetails.isFriendSelected) {

              //save history
              let historydata =
              {
                userId:this.friendDetails.friendId,
                category:'list-edit',
                message:`${this.userDetails.userName} has edited your list`,
                authToken:this.myauthToken
              }
              //console.log('historydata : ',historydata);
              //save on history
              this.saveHistory(historydata);

              let data =
              {
                friendId: this.friendDetails.friendId,
                message: `${this.userDetails.userName} has edited list on your list's`,
                friendEmail: this.friendDetails.friendEmail,
                friendName: this.friendDetails.friendName
              }
              this.socketService.notifyUpdates(data);
            }

            this.toastr.success('list updated');
          }
        },
        (err) => {
          this.router.navigate(['/error/server'])
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

            //notify if friend list is being deleted
            if (this.friendDetails.isFriendSelected) {

              //save history
              let historydata =
              {
                userId:this.friendDetails.friendId,
                category:'list-delete',
                message:`${this.userDetails.userName} has deleted a list on your list's`,
                listId:this.selectedList.listId,
                authToken:this.myauthToken
              }
              console.log('historydata : ',historydata);
              //save on history
              this.saveHistory(historydata);
              let data =
              {
                friendId: this.friendDetails.friendId,
                message: `${this.userDetails.userName} has deleted a list on your list's`,
                friendEmail: this.friendDetails.friendEmail,
                friendName: this.friendDetails.friendName
              }
              this.socketService.notifyUpdates(data);
            }
            setTimeout(() => {
              this.toastr.success('List deleted')
            }, 100)
            this.validateUser();

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
    this.itemEditTitle = "";
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
              //notify friend if friend item is deleted
              if (this.friendDetails.isFriendSelected) {

                //save history
                let historydata =
                {
                  userId:this.friendDetails.friendId,
                  category:'item-delete',
                  message:`${this.userDetails.userName} has deleted a item your list's`,
                  listId:this.selectedList.listId,
                  authToken:this.myauthToken
                }
                console.log('historydata : ',historydata);
                //save on history
                this.saveHistory(historydata);
                let data =
                {
                  friendId: this.friendDetails.friendId,
                  message: `${this.userDetails.userName} has deleted item on your list's`,
                  friendEmail: this.friendDetails.friendEmail,
                  friendName: this.friendDetails.friendName
                }
                this.socketService.notifyUpdates(data);
              }
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

            //notify friend if friend item is edited
            if (this.friendDetails.isFriendSelected) {

              //save history
              let historydata =
              {
                userId:this.friendDetails.friendId,
                category:'item-edit',
                message:`${this.userDetails.userName} has edited item on your list's`,
                listId:this.selectedList.listId,
                authToken:this.myauthToken
              }
              console.log('historydata : ',historydata);
              //save on history
              this.saveHistory(historydata);
              let data =
              {
                friendId: this.friendDetails.friendId,
                message: `${this.userDetails.userName} has edited item on your list's`,
                friendEmail: this.friendDetails.friendEmail,
                friendName: this.friendDetails.friendName
              }
              this.socketService.notifyUpdates(data);
            }

            // for refreshing the selected list
            this.getSingleList(this.selectedList.listId)
          }
        },
        (err) => {
          this.router.navigate(['/error/server'])
        }
      );
    }
  }

  // public listChecker()
  // {
  //   console.log('list checked')
  // }

  //adding subitem
  public addSubItem(item) {
    console.log(item)

    let data =
    {
      itemId: item.itemId,
      subItemTitle: this.newSubItemTitle,
      authToken: this.myauthToken
    }

    this.listService.addSubitem(data).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {

          //adding temp data to subitems
          this.getSubItems(this.selectedList)
          console.log('subitem : ', this.subItemsOfItem)
          this.toastr.success('subitem added')

          //notify if friends subitem is being added
          if (this.friendDetails.isFriendSelected) {

            //save history
            let historydata =
            {
              userId:this.friendDetails.friendId,
              category:'subitem-add',
              message:`${this.userDetails.userName} has added subitem on your list's`,
              listId:this.selectedList.listId,
              authToken:this.myauthToken
            }
            console.log('historydata : ',historydata);
            //save on history
            let data =
            {
              friendId: this.friendDetails.friendId,
              message: `${this.userDetails.userName} has added subItem on your list's`,
              friendEmail: this.friendDetails.friendEmail,
              friendName: this.friendDetails.friendName
            }
            this.socketService.notifyUpdates(data);
          }
        }
      }
    )

    this.newSubItemTitle = "";
  }//

  //edit subitem
  public editSubItem(subitem, item) {
    console.log('subitem', subitem)
    console.log('item : ', item)

    //modifier will be the account user only,
    let data =
    {
      subItemId: subitem.subItemId,
      modifierId: this.userDetails.userId,
      authToken: this.myauthToken,
      subItemTitle: this.editSubItemTitle,
      itemId: item.itemId
    }
    console.log('data', data)

    this.listService.editSubItem(data).subscribe(
      (apiresponse) => {
        console.log('apiresponse', apiresponse)
        if (apiresponse['status'] === 200) {
          this.getSubItems(this.selectedList)
          this.toastr.success('subitem edited');

          //notify if friends subitem is being edited
          if (this.friendDetails.isFriendSelected) {

            //save history
            let historydata =
            {
              userId:this.friendDetails.friendId,
              category:'subitem-edit',
              message:`${this.userDetails.userName} has edited subitem on your list's`,
              listId:this.selectedList.listId,
              authToken:this.myauthToken
            }
            console.log('historydata : ',historydata);
            //save on history
            let data =
            {
              friendId: this.friendDetails.friendId,
              message: `${this.userDetails.userName} has edited subitem on your list's`,
              friendEmail: this.friendDetails.friendEmail,
              friendName: this.friendDetails.friendName
            }
            this.socketService.notifyUpdates(data);
          }
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of edit subitem

  //delete subitem
  public deleteSubItem(subitem, item) {
    console.log(subitem.subItemId)
    let data =
    {
      subItemId: subitem.subItemId,
      authToken: this.myauthToken,
      itemId: item.itemId
    }

    this.listService.deleteSubItem(data).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          // console.log(this.subItemsOfItem);

          //subitem is deleted ,but remove it from subitem array temporarily to refresh the page
          //console.log(this.subItemsOfItem[0])
          this.subItemsOfItem[0].subItems.map((currentsubitem, index) => {
            if (currentsubitem.subItemId === subitem.subItemId) {
              //removing currently deleted subitem from subitems array using slice method of array
              this.subItemsOfItem[0].subItems.splice(index, 1);
            }
          });

          this.toastr.success('subitem deleted');

          //notify if friends subitem is being deleted
          if (this.friendDetails.isFriendSelected) {

            //save history
            let historydata =
            {
              userId:this.friendDetails.friendId,
              category:'subitem-delete',
              message:`${this.userDetails.userName} has deleted subitem on your list's`,
              listId:this.selectedList.listId,
              authToken:this.myauthToken
            }
            console.log('historydata : ',historydata);
            //save on history
            let data =
            {
              friendId: this.friendDetails.friendId,
              message: `${this.userDetails.userName} has deleted subitem on your list's`,
              friendEmail: this.friendDetails.friendEmail,
              friendName: this.friendDetails.friendName
            }
            this.socketService.notifyUpdates(data);
          }
        }
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of delete of subitems

  public setSelectedSubItem(subitem) {
    this.currentSubItem = subitem;
  }

  //marking item for done and undone
  public markItem(item) {
    //console.log('item : ',item)
    let itemDone = !item.itemDone;
    let data =
    {
      itemId: item.itemId,
      isDone: itemDone,
      authToken: this.myauthToken
    }

    //console.log('data : ',data)

    this.listService.markItem(data).subscribe(
      (apiresponse) => {
        console.log(this.selectedList.items)
        //this.getSingleList(this.selectedList.listId)
        //make change to selected list temporaily to reflect change in data
        this.selectedList.items.map((singleItem) => {
          if (singleItem.itemId === item.itemId) {
            console.log('hey')
            console.log('itemdone : ', itemDone)
            singleItem.itemDone = itemDone
          }
        })
      },
      (err) => {
        this.router.navigate(['/error/server'])
      }
    )
  }//end of marking item as done and undone

}
