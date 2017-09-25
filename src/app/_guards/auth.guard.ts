import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService :AuthenticationService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        if (this.authService.currentUser){
            return true;
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        
        // Реазиция canActivate с помощью Observable. Что - то пошло не так.
        /*return this.authService.events.isAuth
            .map( (isAuth :boolean) => {
                
                if (isAuth){
                    console.log("AuthGuard - can");
                    return true;

                } else {
                    console.log("AuthGuard - cannot");

                    setTimeout( () => {
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                    }, 1);
                    
                    return false;
                }
            });*/
    }
}