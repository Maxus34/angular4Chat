import { Component, OnInit } from "@angular/core";
import { AlertService } from "../../_services/_services";

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styles: [`
        div{
            position: relative;
        }
        i{
            position: absolute;
            top: 2px;
            right: 3px;
        }
        i:hover{
            cursor: pointer;
        }
    `]
})
export class AlertComponent {
    public message :any;

    constructor (
        private alertService :AlertService
    ){}
    
    ngOnInit(){
        this.alertService.getMessage().subscribe(message => this.message = message);
    }

    public cancel(){
        this.message = undefined;
    }
}