import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";

import { Dialog, Message, User } from "../_models/_models";
import { ApiService } from '../_services/api.service';
import { UserService } from "../_services/user.service";


@Injectable()
export class MessageFactory {

    constructor(
        private userService :UserService,
        private apiService  :ApiService,
    ) { }

    public async getMessageFromData(data) :Promise<Message> {
        let message = new Message(data);
        message.user =  await this.userService.getById(message.createdBy);

       return message;
    }
}