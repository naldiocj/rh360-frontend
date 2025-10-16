import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  public isPDF(type:string):boolean{
    return ['application/pdf'].includes(type);
  }

  public isMaxSize(size:number):boolean{
    return (size < 10 * 1024 * 1024 );
  }

  public isImage(type:string):boolean{
    return ['image/png','image/jpg','image/jpeg','image/tmp','image/gif'].includes(type) ;
  }

  public getTipoBlob(file: File | Blob | any): string | null {
    return `${file.type} codecs=opus`;
  }




}
