import { ErrorHandlerService } from '../../_services/error.handler.service';
import { Component } from "@angular/core";


@Component({
    selector: `error-handler`,
    template: `
    <div *ngIf="error" class="sys-error">
        #Server Error<ng-template *ngIf="showErrorMessage">: {{error}}</ng-template>
        <p>please try later</p>
    </div>
    `,
    styles: [`
        div.sys-error{
            position: fixed;
            top: 0px;
            left: 0px;
            background-color: #FFE3E3;
            font-weight: 500;
            border-bottom: 1px solid #EF4B4B;   
            border-right: 1px solid #EF4B4B; 
            border-bottom-right-radius: 20px;
            padding: 5px 20px 5px 20px;
        }
        .sys-error p{
            font-style: italic;
            margin: 0px;
            font-weight: 300;    
        }
    `]
})
export class ErrorHandlerComponent {

    public error: string;
    
    public showErrorMessage :boolean = false;

    public constructor(private errorHandlerService :ErrorHandlerService){
        
        this.errorHandlerService.onError.subscribe( (err) => {
            console.log(`error handler component got`, err);

            this.error = err;
        });

    }

    
}