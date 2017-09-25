import { Injectable, OnInit } from '@angular/core';

import * as io from 'socket.io';
import * as io_client from 'socket.io-client';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";

import { Dialog, User, Message } from "../_models/_models";
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';

import { WsMessageEventData, WsDialogEventData } from "../_models/ws-data.events";

@Injectable()
export class WsChatService {

    private socket: SocketIOClient.Socket;

    private socketPath: string = `localhost`;
    private socketPort: string = `:3000`;
    
    public events = {
        userTyping: new Subject(),
        userOnline: new Subject(),
        messageCreated: new Subject<WsMessageEventData>(),
        messageUpdated: new Subject<WsMessageEventData>(),
        dialogCreated: new Subject<WsDialogEventData>(), 
        dialogUpdated: new Subject<WsDialogEventData>(), 
    };

    public constructor(
        private userService: UserService,
        private authentivationService :AuthenticationService,
    ) {
        this.authentivationService.events.onLogin
            .subscribe( (user :User) => {
                console.log(`OnLogin emited!`);

                if (user){
                    this.connectWebSocket(user.accessToken);
                    this.subcsribeOnSocketEvents();
                } else {
                    this.disconnectWebSocket();
                }
            });
    }

    public emitEvent(event :string, message :string){
        this.socket.emit(event, message);
    }
    
    protected subcsribeOnSocketEvents(){

        this.socket.on('user.typing', (evt :string) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.userTyping.next(evt);
        });

        this.socket.on('message.created', (evt :string) => {
            try{ var event = JSON.parse(evt); }
            catch(e) { console.log(e); }

            this.events.messageCreated.next(event);
        });

        this.socket.on('message.updated', (evt :string) => {
            try{ var event = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.messageUpdated.next(event);
        });
        
        this.socket.on('dialog.created', (evt :string) => {
            try{ var event = JSON.parse(evt); }
            catch(e) { console.log(e); }
        
            this.events.dialogCreated.next(event);
        });

        this.socket.on('dialog.updated', (evt :string) => {
            try{ var event = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.dialogUpdated.next(event);
        });
    }

    private connectWebSocket(access_token) {
        console.log(`Getting an connection on ${this.socketPath}${this.socketPort}...`);
        
        try{
            this.socket = io_client.connect(`localhost:3000`, {
                query: {
                    access_token: access_token
                },
                transports: ['websocket']
            });
        } catch(e) {console.log(`Error in WsChatService: `, e);}


        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.transports = ['polling', 'websocket'];
        })
        
        this.socket.on('connect', () => { console.log('Socket connection success!\n\n'); })
    }

    private disconnectWebSocket(){
        this.socket.disconnect();
    }


    private handleSocketErrors(){
        this.socket.on('connect_error', (error) => {
            // ...
        });

        this.socket.on('connect_timeout', (timeout) => {
            // ...
        });
    }
}