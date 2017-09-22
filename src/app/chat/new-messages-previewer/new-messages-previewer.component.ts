import { WsChatService } from '../../_services/ws.chat.service';
import { Component } from '@angular/core';

import { Message } from "../../_models/_models";

@Component({
    selector: `side-message-preview`,
    template: `
        <div *ngIf="messages.length > 0">
            <div *ngFor="let message of messages">
                {{message.content}}
            </div>
        </div>
    `,
    styles:[`
    @host{
        position: fixed;
        bottom: 0px;
        left: 0px;
    }
    `]
})
export class NewMessagesPreviewerComponent{

    public messages :Message[] = [];

    public constructor(private wsChatService :WsChatService){
        this.wsChatService.events.newMessage
            .subscribe( (event) => {
                
            })
    }

}