import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AlertService, AuthenticationService } from "../_services/_services";

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
    
    public model :any = {}; 
    public loading :boolean = false;
    public returnUrl :string;

    constructor (
        private route        :ActivatedRoute,
        private router       :Router,
        private authService  :AuthenticationService,
        private alertService :AlertService  ) {}

    ngOnInit () {
        this.authService.logout();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
            
        this.authService.login(this.model.username, this.model.password)
            .subscribe(
                res => {
                    if (!res.error){
                        console.log(`Navigate to ${this.returnUrl}`);                        
                        this.router.navigate([this.returnUrl]);

                    } else {
                        this.alertService.error(res.error);
                    }
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    console.log(error);
                });
    }
}