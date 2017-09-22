import { AuthenticationService } from "./authentication.service";
import { ErrorHandlerService }  from './error.handler.service';
import { WsChatService }        from "./ws.chat.service";
import { AlertService }         from "./alert.service";
import { ChatService }          from "./chat.service";
import { UserService }          from "./user.service";
import { ApiService }           from "./api.service";


let SERVICES = [
    AuthenticationService,
    UserService,
    ApiService,
    ChatService,
    WsChatService,
    AlertService,
];

export {
    ChatService,
    AlertService,
    UserService,
    AuthenticationService,
    ApiService,
    WsChatService,
    ErrorHandlerService,
    
    SERVICES,
};