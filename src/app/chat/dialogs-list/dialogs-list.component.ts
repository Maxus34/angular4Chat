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
    
    @ViewChildren('dialogs') private viewDialogs:QueryList<DialogItemComponent>;

    public constructor (
        private chatService :ChatService,
        private alertService :AlertService,
        private userService  :UserService,
        private wsChatService :WsChatService
    ) {}

    public async ngOnInit() {           
        this.loadDialogsList();
    }

    public async ngAfterViewInit(){
        this.wsChatService.events.messageCreated.subscribe( (event :any) => {
            console.log(event);
            this.sortDialogsListByLastMessageTimestamp();
        });
    }

    public onDeleteDialog (id :number){
    }
    
    protected loadDialogsList () {
        this.isLoadingDialogsList = true;

       this.chatService.getDialogsList()
           .then( async dialogs => {
                this.dialogs = dialogs;
                await this.loadLastMessageForEveryDialog();
                this.sortDialogsListByLastMessageTimestamp();
                this.isLoadingDialogsList = false;
            })    
            .catch( err => {
                this.isLoadingDialogsList = false;
            });
    }

    protected async loadLastMessageForEveryDialog(){

        let dialogsCount = this.dialogs.length;
        let promisesArray = [];

        for (let i = 0; i < dialogsCount; i++){     
            let dialogHelper = await this.chatService.getDialogHelper(this.dialogs[i].id);     

            promisesArray.push(
                dialogHelper.loadMessages(1)
                .then( () => {
                    console.log(this.dialogs[i]);
                })
            );
        }
        
        await Promise.all(promisesArray);
    }

    protected sortDialogsListByLastMessageTimestamp(){

        this.dialogs.sort( (a, b) => {
            
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