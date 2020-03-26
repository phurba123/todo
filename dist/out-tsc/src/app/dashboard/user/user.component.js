import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let UserComponent = class UserComponent {
    constructor(cookie, listService, toastr) {
        this.cookie = cookie;
        this.listService = listService;
        this.toastr = toastr;
        this.listChecked = false;
    }
    ngOnInit() {
        this.myauthToken = this.cookie.get('token');
        this.getAllToDoListOfUser();
    }
    //getting all the list of current user
    getAllToDoListOfUser() {
        this.listService.getAllListOfUser(this.myauthToken).subscribe((apiResponse) => {
            if (apiResponse['status'] === 200) {
                this.allList = apiResponse['data'];
                console.log('all list : ', this.allList);
            }
        }, (err) => {
            console.log(err);
        });
    }
    //public adding new list
    addNewList() {
        if (!this.newListTitle) {
            this.toastr.warning('Title is empty');
        }
        else {
            this.listService.createNewList(this.newListTitle, this.myauthToken).subscribe((apiResponse) => {
                if (apiResponse['status'] === 200) {
                    this.toastr.success('List Created');
                    this.newListTitle = ""; //clearing input text after adding new list;
                    this.getAllToDoListOfUser();
                }
            }, (err) => {
                console.log(err);
                this.toastr.error(err.error.message);
            });
        }
    } //end of adding new list
    //gets called when user click on any list
    getSingleList(listId) {
        if (listId) {
            this.listService.getSingleList(listId, this.myauthToken).subscribe((apiResponse) => {
                console.log(apiResponse);
                this.selectedList = apiResponse['data'];
                console.log('selectedList', this.selectedList);
            }, (err) => {
                console.log(err);
            });
        }
    }
    // adding new item to list
    addNewItem() {
        if (this.selectedList) {
            if (this.newItemTitle) {
                this.listService.addItemToList(this.selectedList.listId, this.newItemTitle, this.myauthToken)
                    .subscribe((apiResponse) => {
                    if (apiResponse['status'] === 200) {
                        //console.log(apiResponse);
                        //recalling getSingleList after adding a new item to get it reflected on a view
                        this.getSingleList(this.selectedList.listId);
                        this.newItemTitle = ""; //clearing text after adding item to list;
                        this.toastr.success('new item added');
                    }
                    else {
                        this.toastr.error(apiResponse['message']);
                    }
                }, (err) => {
                    //redirect to internal error
                    console.log(err);
                });
            }
        }
    }
    //function to editListTitle
    editListTitle() {
        if (!this.newEditListTitle) {
            this.toastr.warning('Title is required');
        }
        else {
            this.listService.editListTitle(this.selectedList.listId, this.myauthToken, this.newEditListTitle).subscribe((apiResponse) => {
                if (apiResponse['status'] === 200) {
                    this.getAllToDoListOfUser();
                    this.getSingleList(this.selectedList.listId);
                    this.newEditListTitle = ""; //cleart edit text box after updating list title
                    this.toastr.success('list updated');
                }
            }, (err) => {
            });
        }
    }
    //function to delete list
    deleteList() {
        if (this.selectedList) {
            this.listService.deleteList(this.selectedList.listId, this.myauthToken).subscribe((apiResponse) => {
                if (apiResponse['status'] === 200) {
                    setTimeout(() => {
                        this.toastr.success('List deleted');
                    }, 100);
                    this.getAllToDoListOfUser();
                    //clear selected list after deleting list
                    this.selectedList = "";
                }
            });
        }
    }
    verticalEllipseClick(item) {
        this.selectedItemOfList = item;
        console.log('selectedItemOfList', this.selectedItemOfList);
    }
    //function to delete item
    deleteItem() {
        if (this.selectedItemOfList) {
            //delete item
        }
    }
};
UserComponent = tslib_1.__decorate([
    Component({
        selector: 'app-user',
        templateUrl: './user.component.html',
        styleUrls: ['./user.component.css']
    })
], UserComponent);
export { UserComponent };
//# sourceMappingURL=user.component.js.map