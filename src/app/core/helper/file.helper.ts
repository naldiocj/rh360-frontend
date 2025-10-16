import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FileHelper {

    constructor() { }

    /**
     * @author 'pedrokondo20@gmail.com'
     */
    public convertBinaryToFile(binary: any, type: string = 'img'): any {

        if (!binary) {
            return null
        } else if (type == 'img') {
            return `data:image/png;base64,${binary}`;
        }

        // const base64 = btoa(String.fromCharCode(binary));
        return `data:image/png;base64,${binary}`;
    }

   

}
