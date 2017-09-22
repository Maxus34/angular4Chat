import { WsChatService } from '../../_services/ws.chat.service';
import { ApiService } from '../../_services/api.service';
import { ChatService, AlertService, UserService } from '../../_services/_services';
import { Component, OnInit } from '@angular/core';

import { Dialog, Message } from '../../_models/_models';


@Component({
    selector: "dialogs-list",
    templateUrl: "./dialogs-list.component.html",
    styleUrls: ["./dialogs-list.component.css"],
    providers: [],
})
export class DialogsListComponent implements OnInit{
    
    public isLoadingDialogsList = false;
    public dialogs :Dialog[];
    
    public constructor (
        private chatService :ChatService,
        private alertService :AlertService,
        private userService  :UserService,
        private wsChatService :WsChatService
    ) {}

    public async ngOnInit() {           
        this.loadDialogsList();
    }

    public onDeleteDialog (id :number){
    }
    
    private loadDialogsList () {
        this.isLoadingDialogsList = true;

       this.chatService.getDialogsList()
           .then( dialogs => {
                this.dialogs = dialogs;
                console.log(dialogs);
                this.isLoadingDialogsList = false;
            })    
            .catch( err => {
                this.isLoadingDialogsList = false;
            });
    }

    private chatEventsListener(event){
        switch (event.type){
            case "dialog-list-updated": {
                this.dialogs = event.dialogs || []; 
            }
        }
    }
} 