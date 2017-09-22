import { AfterViewChecked, Component, ElementRef } from '@angular/core';


@Component({
    selector: 'tooltip-container',
    template: `{{content}}`,
    styles: [`
    `]
})
export class TooltipContainerComponent implements AfterViewChecked{
    
    public content = "tooltip";

    constructor (public elementRef :ElementRef) {
        
    }

    ngAfterViewChecked(){

    }
}