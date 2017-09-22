import { UserService } from '../../_services/user.service';
import { Message } from '../../_models/_models';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: "message-item",
    templateUrl: "./message-item.component.html",
    styles:[`
        .message {
            position: relative;
        }
        .message .message-error{
            cursor: pointer;
            position: absolute;
            top: 9px;
            right: 9px;
            font-size: 18px;
            color: #f33;
        }
        .message .message-loading{
            position: absolute;
            top: 9px;
            right: 9px;
            font-size: 18px;
            color: #2980b9;
        }
    `]
})
export class MessageItemComponent implements OnInit{
    @Input() message :Message;
    
    @Output() onSelect = new EventEmitter<number>();
    
    @HostListener("click") onClick(){
        if (this.message.id){
            this.message.isSelected = !this.message.isSelected;
            this.onSelect.emit(this.message.id);
        }   
    }

    public currentUserId;
    
    constructor(
        private userService :UserService,
    ) {}

    ngOnInit(){
        this.currentUserId = this.userService.currentUser.id;
    }

    public isMessageOutgoing(){
        return true;
    }
}