
import { Inject, Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { User } from "../_models/_models";
import { ApiService } from "../_services/api.service";

@Injectable()
export class UserService implements OnInit{
    
    private _users = [];

    constructor (
        @Inject(ApiService) private apiService :ApiService,
        private http :Http,
    ) { } 
    
    ngOnInit(){}

    
    get currentUser () :User{
        return JSON.parse(window.localStorage.getItem('currentUser')) as User;
    }
    
    public async getAll(){
        let responseData = await this.apiService.apiPOST('users.get', {}).toPromise();
        
        let users = [];
        for (let i = 0; i < responseData.items.length; i++){
            users.push(new User(responseData.items[i]));
        }

        return users;
    }

    public async getById (id :number) :Promise<User>{
        let user = this._users.find( elem => elem.id == id );

        if (user == undefined){
            let responseData = await this.apiService.apiPOST('users.getById', {"id" : id}).toPromise()
            
            user = new User(responseData.item);

            this._users.push(user);
        }
            
        return user;
    }

    public async create (user :User) {
        
    }

    public async update (user :User){

    }

    public async delete (id :User){
    
    }
}