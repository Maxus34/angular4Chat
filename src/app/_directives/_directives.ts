import { ErrorHandler } from '@angular/core';
import { AlertComponent } from "./alert/alert.component";
import { TooltipDirective } from "./tooltip/tooltip.directive";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";

let DIRECTIVES = [
    AlertComponent,
    ErrorHandlerComponent
];;


export {
    DIRECTIVES,
    
    AlertComponent,
    ErrorHandlerComponent
};