import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, RequestMethod, Response } from "@angular/http";

import { Observable } from "rxjs";

import { UserService } from './_services';
import {AuthenticationService } from "./authentication.service";
import { User } from '../_models/user';

@Injectable()
export class ApiService {
    private apiUrl  = 'http://192.168.33.10/chat/api';
    private requestOptionsArgs :RequestOptionsArgs;
    private accessToken :string;

    constructor(
        private http : Http,
        private authService : AuthenticationService,
    ){
        this.requestOptionsArgs = {headers: new Headers({"Content-Type":"application/json"})};
        
        if (this.authService.currentUser){
            this.accessToken = this.authService.currentUser.accessToken || null;
        }

        this.authService.events.onLogin
            .subscribe( (user : User) => {
                if (user){
                    this.accessToken = user.accessToken;
                } 
            });
    }


    public apiPOST(method :string, request) :Observable<any>{

        if (!this.accessToken)
            throw new Error("API using without accessToken");

        return this.http.post(
            `${this.apiUrl}/${method}?access-token=${this.accessToken}`, 
            JSON.stringify(request),
            this.requestOptionsArgs
        )
        .map ((response :Response) => {
            let data = response.json()
            
            if(response.status !== 200){
                console.log(`Api Error `, response.statusText);
            }

            if (data.error){
                throw new Error(data.error);
            } 

            return data.response; 
        })
        .catch(this._serverError);
    }

    private _serverError(err :any){

        console.log('ApiService server error:', err); 
        
                if(err instanceof Response) {
                  return Observable.throw(err.json().error || 'backend server error');
                }
        
                return Observable.throw(err.text() || 'backend server error');

    }
}