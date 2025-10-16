import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EncodeAndDecodeHelper {

    /**
     * @author 'pedrokondo20@gmail.com'
     */
    public encode(item: any): any {
        return window.btoa(unescape(encodeURIComponent(item)))
    }
    
    /**
     * @author 'pedrokondo20@gmail.com'
     */
    public decode(item: any): any {
        return decodeURIComponent(escape(window.atob(item)));
    }

}

