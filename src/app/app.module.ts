import { Router }           from '@angular/router';
import { FormsModule }      from '@angular/forms';
import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';

import { Http, HttpModule } from '@angular/http';

import { AppComponent }   from './app.component';
import { routing }        from './app.routing';
import { NavigationComponent } from './navigation/navigation.component';

// Components
import { LoginComponent } from './login/login.component';
import { AlertComponent, ErrorHandlerComponent } from './_directives/_directives';
import { CHAT }           from './chat/chat';

// Services
import { SERVICES } from './_services/_services';
import { ErrorHandlerService } from "./_services/error.handler.service";

// Factories
import { FACTORIES } from "./_factories/_factories";

// Guargs
import { AuthGuard } from './_guards/auth.guard';

// RxJs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';

//Tooltip
import { TooltipModule } from "ngx-tooltip";

//Overlay
import { OverlayHostComponent } from "./_directives/overlay/overlay-host.component";
import { OverlayService } from "./_directives/overlay/overlay.service";
import { OverlayComponent } from "./_directives/overlay/overlay.component";

// Chat image Popup
import { ImgPopupComponent } from "./chat/img-popup/img-popup.component";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    TooltipModule,
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    NavigationComponent,
    ErrorHandlerComponent,
    CHAT,
    OverlayHostComponent,
    OverlayComponent,
    ImgPopupComponent
  ], 
  entryComponents:[
    OverlayComponent, ImgPopupComponent  
  ],
  providers: [ ErrorHandlerService,  SERVICES, AuthGuard, FACTORIES, OverlayService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
