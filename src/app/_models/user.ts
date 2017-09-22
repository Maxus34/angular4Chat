export class User {

    constructor (data) {
        this.id        = data.id;
        this.username  = data.username;
        this.email     = data.email;
        this.createdAt = data.createdAt;
        
        this.accessToken = data.accessToken || null;

        this.pictureSmall  = data.pictureSmall;
        this.pictureMiddle = data.pictureMiddle;
        this.pictureBig    = data.pictureBig;
    }

    public id :number;
    public username :string;
    public email :string;
    public createdAt :number;

    public password ?:string;
    public accessToken ?:string;

    public pictureSmall ?:string;
    public pictureMiddle ?:string;
    public pictureBig ?:string;
}