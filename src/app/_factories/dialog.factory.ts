import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";

import { Dialog, User } from "../_models/_models";
import { ApiService } from '../_services/api.service';
import { UserService } from "../_services/user.service";


@Injectable()
export class DialogFactory {

    constructor(
        private userService :UserService,
        private apiService  :ApiService,
    ) { }

    public async getDialogFromData(data :any) :Promise<Dialog> {
        let dialog = new Dialog();

        dialog.id = data.id;
        dialog.title = data.title;
        dialog.isCreator = data.isCreator;
        dialog.isActive = data.isActive;
        dialog.creatorId = data.creatorId;

        dialog.dialogUsers = [];
        dialog.messages = [];

        dialog.dialogReferences = data.dialogReferences;

        for (let i = 0; i < data.dialogReferences.length; i++) {
            let user = await this.userService.getById(data.dialogReferences[i].userId);

            dialog.dialogUsers.push(user);
        }

        return dialog;
    }

    public async updateDialogFromData(dialog :Dialog, data :any) :Promise<any> {

        dialog.title       = data.title;
        dialog.isActive    = data.isActive;
        dialog.dialogUsers = [];
        
        for (let i = 0; i < data.dialogReferences.length; i++){
            let user = await this.userService.getById(data.dialogReferences[i].userId);

            dialog.dialogUsers.push(user);
        }
    }
}