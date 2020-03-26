import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
let ListService = class ListService {
    constructor(http) {
        this.http = http;
        // backend url related to list
        this.listBackendUrl = 'http://localhost:3000/api/v1/list';
        // backend url related to item of list
        this.itemBaseUrl = 'http://localhost:3000/api/v1/list/item';
    }
    //getting all the list of user
    getAllListOfUser(authToken) {
        return this.http.get(`${this.listBackendUrl}/view/all?authToken=${authToken}`);
    }
    //create new list
    createNewList(listTitle, authToken) {
        const params = new HttpParams()
            .set('listTitle', listTitle)
            .set('authToken', authToken);
        return this.http.post(`${this.listBackendUrl}/create`, params);
    }
    //getting single list by list id
    getSingleList(listId, authToken) {
        return this.http.get(`${this.listBackendUrl}/${listId}/view?authToken=${authToken}`);
    }
    //editing list title by list id
    editListTitle(listId, authToken, newTitle) {
        const params = new HttpParams()
            .set('listTitle', newTitle)
            .set('authToken', authToken);
        return this.http.put(`${this.listBackendUrl}/${listId}/editTitle`, params);
    }
    //deleting list
    deleteList(listId, authToken) {
        const params = new HttpParams()
            .set('authToken', authToken);
        return this.http.post(`${this.listBackendUrl}/${listId}/delete`, params);
    }
    //add new item to a list
    addItemToList(listId, itemTitle, authToken) {
        const params = new HttpParams()
            .set('itemTitle', itemTitle)
            .set('authToken', authToken);
        return this.http.put(`${this.itemBaseUrl}/${listId}/addItem`, params);
    } //end of adding new item to list
};
ListService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], ListService);
export { ListService };
//# sourceMappingURL=list.service.js.map