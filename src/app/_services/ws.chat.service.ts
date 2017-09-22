import { Message } from '../_models/message';
import { Injectable, OnInit } from '@angular/core';

import * as io from 'socket.io';
import * as io_client from 'socket.io-client';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";

import { Dialog, User } from "../_models/_models";
import { UserService } from './user.service';
import { ApiService } from './api.service';


@Injectable()
export class WsChatService {

    private socket: SocketIOClient.Socket;

    private socketPath: string = `localhost`;
    private socketPort: string = `:3000`;
    
    public events = {
        userTyping: new Subject(),
        userOnline: new Subject(),
        messageCreated: new Subject(),
        messageUpdated: new Subject(),
        dialogCreated: new Subject(), 
        dialogUpdated: new Subject(), 
    };

    public constructor(
        private userService: UserService,
    ) {
        this.connectWebSocket();
        this.subcsribeOnSocketEvents();
    }

    public emitEvent(event :string, message :string){
        console.log(`Emit ${event} ${message}`);
        this.socket.emit(event, message);
    }
    
    protected subcsribeOnSocketEvents(){

        this.socket.on('user.typing', (evt :any) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.userTyping.next(evt);
        });

        this.socket.on('message.created', (evt :any) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.messageCreated.next(evt);
        });

        this.socket.on('message.updated', (evt :any) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.messageUpdated.next(evt);
        });
        
        this.socket.on('dialog.created', (evt: any) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.dialogCreated.next(evt);
        });

        this.socket.on('dialog.created', (evt: any) => {
            try{ evt = JSON.parse(evt);}
            catch(e) { console.log(e); }

            this.events.dialogUpdated.next(evt);
        });
    }

    private connectWebSocket() {
        console.log(`Getting an connection on ${this.socketPath}${this.socketPort}...`);
        
        try{
            this.socket = io_client.connect(`localhost:3000`, {
                query: {
                    access_token: this.userService.currentUser.accessToken
                },
                transports: ['websocket']
            });
        } catch(e) {console.log(`Error in WsChatService: `, e);}


        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.transports = ['polling', 'websocket'];
        })
        
        this.socket.on('connect', () => { console.log('Socket connection success!\n\n'); })
    }
}