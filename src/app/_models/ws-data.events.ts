export interface WsMessageEventData{
    dialogId :number;
    from     :number;
    item     ?:any;
    items    ?:any[];
}

export interface WsDialogEventData{
    from  :number;
    item  ?: Dialog;
    items ?: Dialog[];
}

export interface WsUserTypingEventData{
    
}

export interface Dialog{
    id        :number;
    title     :string;
    isActive  :boolean;
    isCreator :boolean;
    creatorId :boolean;

    dialogReferences :DialogReference[];
}

export interface DialogReference{
    id        :number;
    userId    :number;
    createdAt :number;
    createdBy :number;
    isActive  :boolean;
}