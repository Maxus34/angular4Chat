import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    Input,
    ViewContainerRef,
} from '@angular/core';
import { TooltipContainerComponent } from "./tooltip-container.component";

@Directive({ selector: `[tooltip]` })
export class TooltipDirective{

    @Input('tooltip') public content:string;
   // @Input('tooltipPlacement') public placement:string = 'top';
    
    private tooptipContainer :ComponentRef<TooltipContainerComponent>;

    constructor (private elementRef :ElementRef,
                 private viewContainer :ViewContainerRef,
                 private componentFactoryResolver :ComponentFactoryResolver
    ){
        this.elementRef.nativeElement.style.position="relative";
        //this.elementRef.nativeElement.style.display="inline-block";
     }
    
    @HostListener('focusin', ['$event', '$target'])
    @HostListener('mouseenter', ['$event', '$target'])
    show(){
        console.log(this.viewContainer);
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TooltipContainerComponent);
        this.tooptipContainer = this.viewContainer.createComponent(componentFactory);
        console.log("TOOLTIP ENABLED");
    }
    
    @HostListener('focusout', ['$event', '$target'])
    @HostListener('mouseleave', ['$event', '$target'])
    hide(){
        if (this.tooptipContainer !== undefined)
            this.tooptipContainer.destroy();

        console.log("TOOLTIP DESTROYED");
    }
}