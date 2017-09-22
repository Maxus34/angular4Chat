
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Dialog, Message } from "../../_models/_models";
import { AlertService, ApiService, ChatService, UserService, WsChatService } from "../../_services/_services";
import { MessagesListComponent } from '../messages-list/messages-list.component';

import { DialogHelper } from "../../_helpers/dialog.helper";

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';


@Component({
    selector:    "dialog-view",
    templateUrl: "./dialog-view.component.html",
    styleUrls:   [`./dialog-view.component.css`]
})
export class DialogViewComponent implements OnInit{
    
    public dialog :Dialog;
    public selectedMessages :number[] = [];

    public isLoadingDialog  :boolean = true;

    private dialogHelper :DialogHelper;

    @ViewChild('messageTextarea')  private textArea :ElementRef;
    @ViewChild('messagesList')     private messagesList :MessagesListComponent;

    constructor (
        private chatService   :ChatService,
        private alertService  :AlertService,
        private apiService    :ApiService,
        private userService   :UserService,
        private wsChatService :WsChatService,

        private route  :ActivatedRoute,
        private router :Router,
    ) {}    


    ngOnInit(){
        this.route.params.subscribe( async params => {
            this.isLoadingDialog = true;

            try{
                this.dialogHelper = await this.chatService.getDialogHelper(params['id']);
                this.dialog = this.dialogHelper.dialog;
            } catch (e){
                this.router.navigate(['/']);
                this.alertService.error(e, true);
            }
                
            this.isLoadingDialog = false;
        });    
    }    
    

    ngAfterViewInit(){
        let elem = this.textArea.nativeElement;
        
        // Send event userTyping to wsService
        Observable.fromEvent(elem, "keyup")
            .filter( (event :any) => {
                return !(event.code == "Backspace" || event.code == "Delete" || event.code == "Escape")
            })
            .debounceTime(200)
            .subscribe( (event :any) => {
               this.wsChatService.emitEvent('typing', JSON.stringify({
                    dialogID : this.dialog.id,
                    userID : this.userService.currentUser.id
               }));
            });
    }
    

    public async  sendMessage(){
        let content = this.textArea.nativeElement.value;
        
        if (!content)
            return;
        try{
            await this.dialogHelper.sendMessage(content);
        } catch (err) {this.alertService.error(err); return;}
        

        setTimeout( () => this.scrollMessageContainerToBottom(), 2);
        this.textArea.nativeElement.value = '';
    }
    

    public async deleteSelectedMessages(){
       if (await this.dialogHelper.deleteMessages(this.selectedMessages)){
            this.selectedMessages = [];
        }
    }

    public resetSelectedMessages(){
        this.selectedMessages = [];
        this.dialog.messages.forEach( (message) => {
            message.isSelected = false;
        })
    }
    
    public onSelectMessage(id :number){
        if (this.selectedMessages.find( (number) => {
            return number == id;
        })) {
            this.selectedMessages = this.selectedMessages.filter( (number) => {
                return number != id;
            })
        } else {
            this.selectedMessages.push(id);
        }
    }

    public scrollMessageContainerToBottom(){
        this.messagesList.scrollMessageContainerToBottom();
    }
     
} 