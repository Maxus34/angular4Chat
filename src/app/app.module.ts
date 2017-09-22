import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';

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


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    NavigationComponent,
    ErrorHandlerComponent,
    CHAT,
  ], 
  entryComponents:[
  ],
  providers: [ ErrorHandlerService,  SERVICES, AuthGuard, FACTORIES ],
  bootstrap: [AppComponent]
})
export class AppModule { }
