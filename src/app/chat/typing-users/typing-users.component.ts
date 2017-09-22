import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { Dialog, Message, User } from "../../_models/_models";
import { AlertService, ApiService, ChatService, UserService, WsChatService } from "../../_services/_services";

import { DialogHelper } from "../../_helpers/dialog.helper";

@Component({ 
    selector: `typing-users`,
    template: `
        <span *ngFor="let i = index; let user of typingUsers">
           {{user.username}} <span *ngIf="i < typingUsers.length - 1">, </span>
        </span>
        <span *ngIf="typingUsers.length > 0">are typing...</span>
    `,
    styles: [`
    `]
})
export class TypingUsersComponent implements OnInit{
    
    public typingUsers :User[] = [];
    
    protected deleteTypingUserTimeout = 2121;

    @Input() public dialogId :number;

    public constructor(
        private wsChatService :WsChatService,
        private userService   :UserService
    ){}

    public ngOnInit(){
        this.wsChatService.events.userTyping
            .filter( (evt :any) => {
                return evt.dialogId == this.dialogId
            })
            .subscribe( async (evt :any) => {
                let user = await this.userService.getById(evt.userId);
                this.addTypingUser(user);

                setTimeout( () => this.deleteTypingUser(user), this.deleteTypingUserTimeout);
            })
    }
    
    protected addTypingUser(user :User){
        
        let userExists = this.typingUsers.find( (item) => {
            return item.id == user.id;
        });

        if (!userExists){
            this.typingUsers.push(user);
        }

    }

    protected deleteTypingUser(user :User){
        this.typingUsers.forEach( (item, i, arr) => {
            
            if (item.id == user.id){
                arr.splice(i, 1);
            }

        });
    }
}