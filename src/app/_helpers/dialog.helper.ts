import { WsChatService } from '../_services/ws.chat.service';
import { Dialog, Message } from '../_models/_models';

import { ApiService } from '../_services/api.service';
import { UserService } from '../_services/user.service';

import { DialogFactory, MessageFactory } from "../_factories/_factories";

export class DialogHelper {
    
    // Injection from ChatService
    private apiService     :ApiService;
    private userService    :UserService;
    private dialogFactory  :DialogFactory;
    private messageFactory :MessageFactory;
    private wsChatService  :WsChatService;

    public currentDialog :Dialog;
    
    public messagesToRender :Message[];

    constructor (
         currentDialog :Dialog,
         apiService :ApiService,
         userService :UserService,
         dialogFactory :DialogFactory,
         messageFactory :MessageFactory,
         wsChatService :WsChatService,
    ){
        this.currentDialog   = currentDialog;
        this.apiService      = apiService;
        this.userService     = userService;
        this.wsChatService   = wsChatService;

        this.dialogFactory   = dialogFactory;
        this.messageFactory  = messageFactory;


        this.subscribeOnWsEvents();
    }

    get dialog () {
        return this.currentDialog;
    }
    
    protected subscribeOnWsEvents(){
        
        this.wsChatService.events.messageCreated
            .subscribe( async (event :any) => {
                let dialogId = event.dialogId;
    
                if(dialogId == this.dialog.id){
                    this.handleNewMessage(event.item);
                }
            });   
        
        this.wsChatService.events.messageUpdated
            .subscribe( async (event :any) => {
                let dialogId = event.dialogId;

                if (dialogId == this.dialog.id){
                    this.handleMessageUpdated(event.item);
                }                
            });
    }


    // ------------- WS Events Handlers ----------------------
    protected async handleNewMessage(messageData :any){
        if (!messageData){
            console.log(`WHAT`, messageData);
            return;
        }

        let message = await this.messageFactory.getMessageFromData(messageData);

        this.currentDialog.messages.push(message);
    }
    
    protected async handleMessageUpdated(messageData :any){
        
        let message = this.dialog.messages.find( (message) => {
            return message.id == messageData.id;
        });

        message.isNew = messageData.isNew;
    }
    // -------------------------------------------------------   
   


    // ------------- WS EventEmitters ------------------------
    public async seeMessage(message :Message){
        if (!message.isNew || message.isLoading)
            return;
        
           setTimeout( () => message.isLoading = true, 0);

        this.apiService.apiPOST('messages.see', {dialogId: this.dialog.id, messageId: message.id}).toPromise()
            .then( (response) => {
                if (response.item){
                    message.isNew = false;
                }
                setTimeout( () => message.isLoading = false, 0);
            })
            .catch( (error) => {
                console.log(error); 
                setTimeout( () => message.isLoading = false, 0);
            });
    }
    // -------------------------------------------------------
    


    // --------- Methods for dialog handling -----------------
    
    public async loadMessages(count :number = 10){
        let response;

        try{
            response = await this.apiService.apiPOST('messages.get', {dialogId: this.currentDialog.id, offset: -count}).toPromise();
        } catch (e) {console.log(e);}

        this.currentDialog.messages = [];

        for (let i = 0; i < response.items.length; i++){
            let message = await this.messageFactory.getMessageFromData(response.items[i]);
            this.currentDialog.messages.push(message);
        }

        return true;
    }

    public async deleteMessages(ids :number[]){
        return this.apiService.apiPOST("messages.delete", {
            "dialogId" : this.dialog.id,
            "ids" : ids,
        })
        .map( (res) => {
            for(let i = 0; i < this.currentDialog.messages.length; i++){
                for (let j = 0; j < res.result.length; j++){
                    if (this.currentDialog.messages[i].id == res.result[j]){
                        this.currentDialog.messages.splice(i, 1);
                    }
                }
            }  

            return true;
        }).toPromise();
    }

    public async sendMessage(content, attachment = []){
        let message = new Message({
            content: content,
            isLoading: true,
            createdBy: this.userService.currentUser.id,
        });
        this.currentDialog.messages.push(message);
        
        
        let response;
        try{
            response = await this.apiService.apiPOST("messages.send", {dialogId: this.dialog.id, content: content}).toPromise()
        } catch(err) { 
            message.error = true;
            message.isLoading = false;
            console.log(err); 
        }
        
        message.setData(response.item);
        message.user = await this.userService.getById(message.createdBy);
        
        return message;
    }

    public async loadDialogHistory(lastMessageId :number){
        return this.apiService.apiPOST("messages.getBeforeId", {
            dialogId: this.dialog.id,
            id: lastMessageId,
            count: 10,
        })
        .map( async response => {
            if(response.items.length > 0){

                // Creating Messages
                let countMessagesInResponse = response.items.length;
                for (let i = countMessagesInResponse - 1; i >= 0 ; i--){
    
                    let message = new Message(response.items[i]);
                        
                    message.user = await this.userService.getById(message.createdBy);

                    this.currentDialog.messages.splice(0, 0, message);
                }
            
                return true;
            } else {
                return false;
            }
        })
        .toPromise()
    }

    public async updateDialog(title, users = []){
        if (!this.currentDialog.isActive)
            return;

        let response = await this.apiService.apiPOST('dialogs.update', { id: this.dialog.id, users, title}).toPromise();

        if (response.result) {
            await this.dialogFactory.updateDialogFromData(this.currentDialog, response.item);
            return true;
        } 
    }
    // --------------------------------------------------------
}