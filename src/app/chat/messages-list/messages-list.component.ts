import { Component, EventEmitter, ElementRef, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Dialog, Message } from "../../_models/_models";
import { AlertService, ApiService, ChatService, UserService } from "../../_services/_services";

import { WsChatService } from '../../_services/ws.chat.service';
import { DialogHelper } from "../../_helpers/dialog.helper";

import { MessageItemComponent } from '../message-item/message-item.component';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: `messages-list`,
    templateUrl: `./messages-list.component.html`,
    styleUrls: [`./messages-list.component.css`],
}) 
export class MessagesListComponent implements OnInit{
    
    @Input() dialog :Dialog;
    
    public isLoadingMessages                :boolean = false;
    public isLoadingMessagesHistory         :boolean = false;
    public cannotLoadingMoreMessagesHistory :boolean = false;
    public showBottomScrollingButton        :boolean = false;
    
    private dialogHelper :DialogHelper;

    @ViewChild('messageContainer') private messageContainer :ElementRef;
    @ViewChildren('messages')      private viewMessages :QueryList<MessageItemComponent>;
    
    @Output() onSelect = new EventEmitter<number>();

    constructor (
        private chatService   :ChatService,
        private alertService :AlertService,
        private apiService :ApiService,
        private userService :UserService,
        private wsChatService :WsChatService,

        private route :ActivatedRoute,
        private router :Router,
    ) {}   
    

    public async ngOnInit(){
        try{
            this.dialogHelper = await this.chatService.getDialogHelper(this.dialog.id);
        } catch (e) { this.alertService.error(e); return;}   
        
        this.isLoadingMessages = true;
        try{
            await this.dialogHelper.loadMessages();
        } catch (e) { this.alertService.error(e); this.isLoadingMessages = false; return;}   
        
        this.isLoadingMessages = false;
        setTimeout( () => { this.scrollMessageContainerToBottom(); }, 1);
    }


    public async ngAfterViewInit(){
        this.viewMessages.changes.subscribe( this.handleMessageContainerChanges() );
        this.viewMessages.changes.subscribe( this.handleNewMessagesOnMessageListChanges() );

        this.messageContainer.nativeElement.addEventListener('scroll', this.handleMessageContainerScrolling.bind(this));
        
        setTimeout( () => { this.showBottomScrollingButton = true; }, 2);
    }
    

    public onSelectMessage(id :number){
        this.onSelect.emit(id);
    }
    

    public async loadDialogHistory(){
        if (this.isLoadingMessagesHistory || this.cannotLoadingMoreMessagesHistory)
            return;

        if (this.dialog.messages.length > 0){
            let firstMessageId = this.dialog.messages[0].id;
            
            this.isLoadingMessagesHistory = true;
            
           try{
                var result = await this.dialogHelper.loadDialogHistory(firstMessageId);

                if (!result) this.cannotLoadingMoreMessagesHistory = true;

           } catch (err) { this.alertService.error(err); }
            
            this.isLoadingMessagesHistory = false;
        }
    }


    public handleMessageContainerScrolling(event){
        let element = this.messageContainer.nativeElement;

        if ( (element.scrollHeight - element.scrollTop) < (element.clientHeight / 4) ) {
            this.showBottomScrollingButton = false;
        }

        if (element.scrollTop < 70){
            this.loadDialogHistory();
        }
    }


    public scrollMessageContainerToBottom() :void{
        
        setTimeout( () => {
            let element = this.messageContainer.nativeElement;
            element.scrollTop =  element.scrollHeight;
            setTimeout( () => { this.showBottomScrollingButton = false; }, 0);
        }, 2);
    }


    protected handleMessageContainerChanges(){
        let firstMessageComponent,
            lastMessageComponent,
            length;

        let messageContainerElem = this.messageContainer.nativeElement;

        const bottomScrollingValueWhenNotScrolling = 500;
        
        return (event :QueryList<MessageItemComponent>) => {

            // Fills variables in scope
            if (!firstMessageComponent && !lastMessageComponent){
                firstMessageComponent = event.first;
                lastMessageComponent  = event.last;
                length                = event.length;
                return;
            }
            
            // Only when messages count becomes bigger and messages addes on end.
            if ( (lastMessageComponent.message.id !== event.last.message.id) &&  (length < event.length) ){
                
                // If message is outgoing need to scroll messageContainer to bootom;
                if (event.last.message.createdBy == this.userService.currentUser.id){
                    this.scrollMessageContainerToBottom();
                    return;
                }

                // For incoming messages checks scrolling distance from container bottom
                // and if it does not too big scrolls to bottom 
                // else => shows bottomScrollingButton
            
                if ( (messageContainerElem.scrollHeight - messageContainerElem.clientHeight - messageContainerElem.scrollTop) < bottomScrollingValueWhenNotScrolling){
                    this.scrollMessageContainerToBottom();
                }


                setTimeout( () => { this.showBottomScrollingButton = true; }, 1);
            }

            firstMessageComponent = event.first;
            lastMessageComponent = event.last;
            length = event.length;
        }
    }

    
    protected handleNewMessagesOnMessageListChanges(){
        
        const messageContainerElem = this.messageContainer.nativeElement;           
        
        //TODO: придумать как отмечать прочитанными только те сообщения, 
        // которые видны в данный момент. 
        // не получается получить messageItemComponent.nativeElement;

        return async (event :QueryList<MessageItemComponent>) => {
            let elements = event.toArray();
            
            let elementsCount = elements.length;
            for (let i = elementsCount -1 ; i >= 0; i--){
                let message :Message = elements[i].message;
                
                if (message.createdBy !== this.userService.currentUser.id ){
                                    
                    if (message.isNew && message.id && !message.isLoading) {
                        await this.dialogHelper.seeMessage(message);                  
                    }
                
                }
            }
        };
    }
    
}