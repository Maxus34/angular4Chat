import { WsChatService } from './ws.chat.service';
import { Injectable, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";
 
import { Dialog, User } from "../_models/_models";
import { UserService } from './user.service';
import { ApiService } from './api.service';

import { DialogHelper } from '../_helpers/dialog.helper';
import { DialogFactory, MessageFactory } from '../_factories/_factories';

@Injectable()
export class ChatService implements OnInit{
    
    private dialogsList :Dialog[];

    private _dialogHelpers :DialogHelper[] = [];

    constructor (
        private apiService :ApiService,
        private userService :UserService,
        private wsChatService :WsChatService,
        private dialogFactory :DialogFactory,
        private messageFactory :MessageFactory,
    ) { }

    ngOnInit(){
    }
   
    async getDialogsList () { 
        if (this.dialogsList == undefined){
            let response;

            try{
                response = await this.apiService.apiPOST('dialogs.get', {}).toPromise()
            } catch (err) { console.log(err); }
                
            this.dialogsList = [];
                    
            for (let i = 0; i < response.items.length; i++){
                this.dialogsList.push(await this.getDialogFromData( response.items[i]));
            }
        }
            
        return this.dialogsList;
    }
    

    deleteDialog(id :number) :Promise<any>{
        return this.apiService.apiPOST('dialogs.get', {})
            .toPromise();
    }

    async getDialogHelper(id :number) :Promise<DialogHelper>{
        
        // Waiting while dialogs list will be loaded
        await this.getDialogsList();
        
        // Searching for dialog
        let dialog = this.dialogsList.find( (dialog) => {
            return dialog.id == id;
        });
        if (!dialog){ throw new Error("Dialog does not exists"); }
    
        // Searching for DialogHelper in cache
        let dialogHelper = this._dialogHelpers.find( (helper) => {
            return helper.dialog.id == dialog.id;
        })
        if (dialogHelper){ return dialogHelper; } 
        
        // Else creating new DialogHelper and adding it to cache
        dialogHelper = new DialogHelper(dialog, this.apiService, this.userService, this.dialogFactory, this.messageFactory, this.wsChatService);
        this._dialogHelpers.push(dialogHelper);

        return dialogHelper;
    }


    public async createDialog(title, users = []){
        let response = await this.apiService.apiPOST('dialogs.create', { title, users })
        .toPromise();

        if (response.result) {
            //let dialog = await this.getDialogFromData(response.item);
            let dialog = await this.dialogFactory.getDialogFromData(response.item);

            this.dialogsList.push(dialog);
            return dialog;
        } else {
            
        }
    }

    public async getDialogFromData(data) :Promise<Dialog>{
        let dialog = new Dialog();

        dialog.id        = data.id;
        dialog.title     = data.title ;
        dialog.isCreator = data.isCreator;
        dialog.isActive  = data.isActive;
        dialog.creatorId = data.creatorId;

        dialog.dialogUsers = [];
        dialog.messages = [];
        
        dialog.dialogReferences = data.dialogReferences;
        
        for (let i = 0; i < data.dialogReferences.length; i++){
            let user = await this.userService.getById(data.dialogReferences[i].userId);

            dialog.dialogUsers.push(user);
        }

        return dialog;
    }
}