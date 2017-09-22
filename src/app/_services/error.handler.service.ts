import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class ErrorHandlerService{
    
    public onError = new Subject<string>();
    
    public error(error :string){
        
        console.log(`Error handler got error`, error);

        this.onError.next(error);
    }
}