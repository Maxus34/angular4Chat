import { AudioFile } from './audio-file';
import { ImageFile } from './image-file';


interface AttachmentsData{
    image :ImageFile[];
    audio :AudioFile[];
}

export class Attachments {
    public images :ImageFile[];
    public audios :AudioFile[]; 
    

    public constructor (data :AttachmentsData){
        this.images = data.image || [];
        this.audios = data.audio || [];
    } 
}