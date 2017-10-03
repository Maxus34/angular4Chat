import { OverlayHostComponent } from './_directives/overlay/overlay-host.component';
import { OverlayService } from './_directives/overlay/overlay.service';
import { Component, OnInit } from '@angular/core';

import { ImgPopupComponent } from "./chat/img-popup/img-popup.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  
  public constructor(
    private overlayService :OverlayService
  ){}
  

  public ngOnInit(){
    this.handlePageResizing();
  }

  private handlePageResizing(){
    let app :any = document.querySelector('.app');

    function onResize () {
      let height = window.innerHeight;
      app.style.height = height + "px";
    }
    
    onResize();  
    window.onresize = onResize;
  }
}
