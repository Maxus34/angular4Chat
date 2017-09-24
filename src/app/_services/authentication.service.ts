import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { User } from "../_models/_models";
import { ErrorHandlerService } from './error.handler.service';

import { Subject } from "rxjs/Subject";
import { Observable, ObservableInput } from 'rxjs/Observable';

@Injectable() 
export class AuthenticationService {

    protected requestOptions :RequestOptions;
    protected apiUrl :string = "http://192.168.33.10/chat/api";
    
    protected _currentUser :User;

    public events = {
        onLogin : new Subject<User>(),
        isAuth  : new Subject<boolean>()
    };


    constructor (private http :Http, private router :Router, private errorHandlerService :ErrorHandlerService) {

        this.requestOptions = new RequestOptions( {headers: new Headers({"Content-Type":"application/json"})} );
        
        // Check localStorage['currentUser'] and accessToken;
        this.checkIsLoginedOnStart();
    }
    

    get currentUser () :User {
        
        if (!this._currentUser){
            this._currentUser = JSON.parse(localStorage.getItem('currentUser')) as User;
        }
    
        return this._currentUser;
    }


    public login (username :string, password :string) {
        return this.http.post(
                `${this.apiUrl}/login`,
                JSON.stringify({"username": username, "password": password}),
                this.requestOptions)

            .map( (response :Response) => {
                let data = response.json();
                
                // Login successfull
                if (data.response){
                    let user = new User(data.response.item);
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    
                    this.events.onLogin.next(user);
                    this.events.isAuth.next(true);

                    return {
                        error: false,
                        user: user
                    };
                
                } else {
                   return {
                       error: data.error,
                   }
                }    
            })
            ._catch(this._serverError);     
    }


    public logout () {
        console.log(`logout`);

        this.router.navigate(['/login']);
        this.events.isAuth.next(false);
        this.events.onLogin.next();
        localStorage.removeItem('currentUser');
    }
    

    protected async checkIsLoginedOnStart(){
        let lsCurrentUser = this.currentUser;
        
        if (lsCurrentUser){
            
            let accessTokenCheckingResult :boolean;
            try{
                accessTokenCheckingResult = await this.checkAccessToken(this.currentUser.accessToken);
            } catch (e) { console.log(`Error while checkingAccessToken`, e); }
            
            if (accessTokenCheckingResult){
                console.log(`AuthService: AccessToken is valid`);
                this.events.onLogin.next(this.currentUser);
                this.events.isAuth.next(true);

            } else {
                console.log(`AuthService: Token isn't valid`);
                this.logout();
                this.events.isAuth.next(false);
            } 
        } else {
            
            console.log(`CurrentUser does not exists`);
            this.logout();
        }
    }

    protected checkAccessToken(token :string) :Promise<boolean>{
        
        let postObservable = this.http.post(
            `${this.apiUrl}/check-access?access-token=${token}`,
            "",
            this.requestOptions)
            .map( (response :Response) => {
                let data = response.json()
                
                if(response.status !== 200){
                    console.log(`Api Error `, response.statusText);

                    return false;
                }
    
                if (data.error){
                    throw new Error(data.error);
                } 
    
                return data.response.status === 'success' ? true : false;
            })
            .catch(this._serverError);

        return postObservable.toPromise();
    }

    private _serverError(err: any) {

        console.log('AuthService server error:', err); 

        if(err instanceof Response) {
            
          this.errorHandlerService.error(`${err.status} | ${err.statusText}`);
          return Observable.throw(err.json().error || 'Server error');
        }
        
        this.errorHandlerService.error(`${err}`);

        return Observable.throw(err.text() || 'Server error');
    }
}