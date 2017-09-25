import { DialogItemComponent } from '../dialog-item/dialog-item.component';
import { WsChatService } from '../../_services/ws.chat.service';
import { ApiService } from '../../_services/api.service';
import { ChatService, AlertService, UserService } from '../../_services/_services';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

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
        this.chatService.deleteDialog(id);
    }
    
    protected loadDialogsList () {
        this.isLoadingDialogsList = true;

       this.chatService.getDialogsList()
           .then( async dialogs => {
                this.dialogs = dialogs;
                this.isLoadingDialogsList = false;
            })    
            .catch( err => {
                this.isLoadingDialogsList = false;
            });
    }
} 