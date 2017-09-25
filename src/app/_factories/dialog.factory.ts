import { MessageFactory } from './message.factory';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";

import { Dialog, User, Message } from "../_models/_models";
import { ApiService } from '../_services/api.service';
import { UserService } from "../_services/user.service";


@Injectable()
export class DialogFactory {

    constructor(
        private userService :UserService,
        private apiService  :ApiService,
        private messageFactory :MessageFactory,
    ) { }

    
    public async getDialogFromData(data :any) :Promise<Dialog> {
        let dialog = new Dialog();

        dialog.id        = data.id;
        dialog.title     = data.title;
        dialog.creatorId = data.creatorId;
        
        dialog.isCreator = (data.creatorId == this.userService.currentUser.id) ? true : false;

        dialog.dialogReferences = data.dialogReferences;

        dialog.dialogUsers = new Array<User>();
        dialog.messages    = new Array<Message>();
        
        let referenceForCurrentUserIndex :number;

        for (let i = 0; i < dialog.dialogReferences.length; i++) {
            
            // Checking reference for current user;
            if (dialog.dialogReferences[i].userId == this.userService.currentUser.id){
                dialog.isActive = dialog.dialogReferences[i].isActive;
                referenceForCurrentUserIndex = i;    
            } else 

            // Checking othe references;
            if (dialog.dialogReferences[i].isActive){
                let user = await this.userService.getById(dialog.dialogReferences[i].userId);
                
                dialog.dialogUsers.push(user);
            }
        }

        dialog.dialogReferences.splice(referenceForCurrentUserIndex, 1);
        
        if (data.lastMessage){
            dialog.messages.push(await this.messageFactory.getMessageFromData(data.lastMessage));
        }

        return dialog;
    }


    public async updateDialogFromData(dialog :Dialog, data :any) :Promise<any> {

        dialog.title       = data.title;
        dialog.dialogUsers = [];
        
        dialog.dialogReferences = data.dialogReferences;

        let referenceForCurrentUserIndex :number;

        for (let i = 0; i < dialog.dialogReferences.length; i++) {
            
            // Checking reference for current user;
            if (dialog.dialogReferences[i].userId == this.userService.currentUser.id){
                dialog.isActive = dialog.dialogReferences[i].isActive;
                referenceForCurrentUserIndex = i;    
            } else 

            // Checking othe references;
            if (dialog.dialogReferences[i].isActive){
                let user = await this.userService.getById(dialog.dialogReferences[i].userId);
                
                dialog.dialogUsers.push(user);
            }
        }
        
        dialog.dialogReferences.splice(referenceForCurrentUserIndex, 1);
    }
}