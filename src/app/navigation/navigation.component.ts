import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from "@angular/router";

import { UserService } from '../_services/user.service';
const navigationItems = [
    {
        path: ['/'],
        label: 'home',
    },
];


@Component({
    selector: "nav-component",
    templateUrl: "navigation.component.html",
    styles: [
        `a:hover{cursor:pointer;}`
    ]
})
export class NavigationComponent implements OnInit{   
    
    public navigationItems = navigationItems;

    public constructor(
        private route :ActivatedRoute,
        private router :Router,
        public userService :UserService 
    ) {}
    
    public isAuthenticated(){
        return this.userService.currentUser? true : false;
    }

    public ngOnInit(){
    }
}