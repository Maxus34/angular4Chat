import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Dialog } from '../../_models/_models';

@Component({  
    selector: "dialog-item",
    templateUrl: "./dialog-item.component.html",
    styleUrls: ["./dialog-item.component.css"]
})
export class DialogItemComponent implements OnInit {
    @Input() dialog :Dialog;
    
    @Output() onDeleted = new EventEmitter<number>();

    constructor (
        private router :Router,
    ) {}

    goToTheDialogView() {
        this.router.navigate(['chat', this.dialog.id]);
    }
    
    deleteDialog(){
        this.dialog.isDeleted = true;
        this.onDeleted.emit(this.dialog.id);
    }

    ngOnInit () {
    }
}