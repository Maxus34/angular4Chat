import { Attachments } from './attachments/attachments';
import { Injectable } from '@angular/core';

import { UserService } from '../_services/user.service';
import { User } from './user';

export class Message {
    
    public id :number;
    public content :string;
    public createdBy :number;
    public createdAt :number;
    public isNew: boolean;
    public attachments :Attachments;
    
    public user ?: User;
    public isSelected ?: boolean = false;
    public isLoading ?: boolean = true;
    public error ?: boolean = false;

    public constructor (data) {
        this.id = data.id;
        this.content = data.content;
        this.isNew = data.isNew;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
            
        this.attachments = new Attachments(data.attachment);

        this.isLoading = data.isLoading || false;
    }
    
    public setData(data){
        this.id = data.id;
        this.content = data.content;
        this.isNew = data.isNew;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
            
        this.attachments = new Attachments(data.attachment);

        this.isLoading = data.isLoading || false;
    }
}