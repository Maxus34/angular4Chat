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
    private dialogsListHasBeenLoaded :boolean = false;

    private _dialogHelpers :DialogHelper[] = [];

    constructor (
        private authService :AuthenticationService,
        private apiService :ApiService,
        private userService :UserService,
        private wsChatService :WsChatService,
        private dialogFactory :DialogFactory,
        private messageFactory :MessageFactory, )
    { 
        this.subsctibeOnWsEvents();
        
        this.authService.events.onLogin
            .subscribe( (user) => {
                if (user) {
                    this.dialogsList = [];
                    this._dialogHelpers = [];
                    this.dialogsListHasBeenLoaded = false;
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
                this.handleDialogUpdated(event);
            });

        this.wsChatService.events.messageCreated
            .subscribe( (event :any) => {
                setTimeout( () => this.sortDialogsListByLastMessageTimestamp(), 50);
            });
    }
   
    // ------------- WS Events Handlers ----------------------
    protected async handleDialogCreated(event :WsDialogEventData){
        let dialog = await this.dialogFactory.getDialogFromData(event.item);
        this.dialogsList.push(dialog);
        this.getDialogHelper(dialog.id);
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


    public async getDialogsList () { 
      
        await this.loadDialogsList();
        
        this.dialogsList.forEach( dialog => {
            this.getDialogHelper(dialog.id);
        });
        
        this.sortDialogsListByLastMessageTimestamp();

        return this.dialogsList;
    }
    
    public async getDialogHelper(id :number) :Promise<DialogHelper>{
        
        // Waiting while dialogs list will be loaded
        await this.loadDialogsList();
        
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

    
    // --------------- API Calls -----------------------------
    public async deleteDialog(id :number) :Promise<any>{
        return this.apiService.apiPOST('dialogs.delete', {
            id: id
        })
        .map( (res) => {
            if (res.result == 'success'){
                let dialogId = this.dialogsList.findIndex( (dialog) => {
                    return dialog.id == id;
                });

                if(dialogId){
                    console.log(`Deleting ${dialogId}`);
                    this.dialogsList.splice(dialogId, 1);
                }
            } else{
                console.log(res);
            }
        })
        .toPromise();
    }
    
    public async loadDialogsList() :Promise<any>{
        if (!this.dialogsListHasBeenLoaded){

            try{
                var response = await this.apiService.apiPOST('dialogs.get', {withLastMessage : true}).toPromise();
             } catch (err) { console.log(err); }
                 
             this.dialogsList = [];
                     
             for (let i = 0; i < response.items.length; i++){
                 this.dialogsList.push(await this.dialogFactory.getDialogFromData( response.items[i]));
             }
             
             this.dialogsListHasBeenLoaded = true;
        } 
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
    // -------------------------------------------------------
    

    protected sortDialogsListByLastMessageTimestamp(){
        
        this.dialogsList.sort( (a, b) => {
            
            if (a.messages.length <= 0 && b.messages.length > 0)
                return 1;

            if (b.messages.length <= 0 && a.messages.length > 0)
                return -1;          

            if (a.messages.length > 0 && b.messages.length > 0){
                        
                if (a.messages[a.messages.length - 1].createdAt > b.messages[b.messages.length - 1].createdAt){
                    return -1;
                } else {
                    return 1;
                }
        
            } else {
                return 0;
            }
        });
    }
}