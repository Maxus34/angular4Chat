import { Message, User } from './_models';

export class Dialog {    
    public id :number;
    public title :string = "New Dialog";
    public creatorId :number;

    public isCreator :boolean;
    public isActive :boolean;

    public dialogReferences :any[]  = [];
    public dialogUsers      :User[] = []; 

    public isDeleted ?:boolean = false;
    public messages  ?: Message[]   = [];
}
