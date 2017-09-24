import { AuthenticationService } from './authentication.service';
import { WsChatService } from './ws.chat.service';
import { Injectable, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";
 
import { Dialog, User } from "../_models/_models";
import { WsDialogEventData, WsMessageEventData} from "../_models/ws-data.events";

import { UserService } from './user.service';
import { ApiService } from './api.service';

import { DialogHelper } from '../_helpers/dialog.helper';
import { DialogFactory, MessageFactory } from '../_factories/_factories';

@Injectable()
export class ChatService{
    
    private dialogsList :Dialog[];

    private _dialogHelpers :DialogHelper[] = [];

    constructor (
        private authService :AuthenticationService,
        private apiService :ApiService,
        private userService :UserService,
        private wsChatService :WsChatService,
        private dialogFactory :DialogFactory,
        private messageFactory :MessageFactory,
    ) { 
        this.subsctibeOnWsEvents();

        this.authService.events.onLogin
            .subscribe( (user) => {
                if (user) {
                    this.dialogsList = undefined;
                    this._dialogHelpers = [];
                }
            })
     }

    
     protected subsctibeOnWsEvents () {
        this.wsChatService.events.dialogCreated
            .subscribe( (event :WsDialogEventData) => {
                this.handleDialogCreated(event);
            });

        this.wsChatService.events.dialogUpdated
            .subscribe( (event :WsDialogEventData) => {
                console.log(`Got event DialogUpdated`, event);
                this.handleDialogUpdated(event);
            });
    }
   
    // ------------- WS Events Handlers ----------------------
    protected async handleDialogCreated(event :WsDialogEventData){
        let dialog = await this.dialogFactory.getDialogFromData(event.item);
        this.dialogsList.push(dialog);
    }    

    protected async handleDialogUpdated(event :WsDialogEventData){
        
        let dialogUpdated = this.dialogsList.find((dialog) => {
            return dialog.id == event.item.id;
        });

        if (dialogUpdated) {
            this.dialogFactory.updateDialogFromData(dialogUpdated, event.item);
        }
    }
    // -------------------------------------------------------


    async getDialogsList () { 
        if (this.dialogsList == undefined){
            let response;

            try{
                response = await this.apiService.apiPOST('dialogs.get', {}).toPromise()
            } catch (err) { console.log(err); }
                
            this.dialogsList = [];
                    
            for (let i = 0; i < response.items.length; i++){
                this.dialogsList.push(await this.dialogFactory.getDialogFromData( response.items[i]));
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

}