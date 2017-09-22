import { DialogPropertiesComponent } from './chat/dialog-properties/dialog-properties.component';
import { DialogViewComponent } from './chat/dialog-view/dialog-view.component';
import { DialogsListComponent } from './chat/chat';
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./_guards/_guards";

export let appRoutes :Routes = [
    {path: '', redirectTo: 'chat', pathMatch: 'full'},
    {path: 'login', component: LoginComponent },
    {path: 'chat', component: DialogsListComponent, canActivate: [AuthGuard]},
    {path: 'chat/create', component: DialogPropertiesComponent, canActivate: [AuthGuard]},
    {path: 'chat/update/:id', component: DialogPropertiesComponent, canActivate: [AuthGuard]},
    {path: 'chat/:id', component: DialogViewComponent, canActivate: [AuthGuard]},
    
    {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);

