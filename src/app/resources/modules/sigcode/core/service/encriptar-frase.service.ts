import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root',
})
export class EncriptarFraseService {
  private frase!: string;

  constructor(private http: HttpClient) {}

  public bits(data: any) {
    let imageBase64Data: string = data;
    if (data.startsWith('data:') && data != null) {
      const dataUrlStartIndex = data.indexOf('base64,') + 7;
      imageBase64Data = data.substring(dataUrlStartIndex);
    }
    const base64EncodedImage = btoa(imageBase64Data);
    return base64EncodedImage;
  }
  public CodificarTexto(data: any) {
    const texto: string = btoa(data);
    return texto;
  }

  public async baixar_passe(data: any, filename: string){
  
  }
}
