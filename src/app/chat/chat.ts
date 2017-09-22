import { DialogsListComponent } from './dialogs-list/dialogs-list.component';
import { DialogViewComponent }   from "./dialog-view/dialog-view.component";
import { DialogItemComponent }   from "./dialog-item/dialog-item.component";
import { MessageItemComponent }  from "./message-item/message-item.component";
import { MessagesListComponent }  from "./messages-list/messages-list.component";
import { DialogPropertiesComponent } from "./dialog-properties/dialog-properties.component";
import { TypingUsersComponent    } from "./typing-users/typing-users.component";
import { NewMessagesPreviewerComponent } from "./new-messages-previewer/new-messages-previewer.component";


let CHAT = [
    DialogsListComponent,
    DialogViewComponent,
    DialogItemComponent,
    MessageItemComponent,
    MessagesListComponent,
    DialogPropertiesComponent,
    TypingUsersComponent,
    NewMessagesPreviewerComponent,
];

export {
    CHAT,
    
    DialogsListComponent,
    DialogViewComponent,
    DialogItemComponent,
    MessageItemComponent,
    MessagesListComponent,
    DialogPropertiesComponent,
    TypingUsersComponent,
};