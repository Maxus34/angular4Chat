import { Component, OnDestroy } from '@angular/core';

import { IOverlay } from '../../_directives/overlay/i.overlay';
import { iImgPopupData } from './i.img-popup-data';

import { Subject } from 'rxjs/Rx';
@Component({
    selector: `overlay-test`,
    templateUrl: `./img-popup.component.html`,
    styleUrls: [`./img-popup.component.css`]
})
export class ImgPopupComponent implements IOverlay, OnDestroy{

    public onClose   = new Subject<any>();
    public data :iImgPopupData;
    
    public ngOnDestroy(){
        console.log(`OverlayTest destroy!`);
    }
}