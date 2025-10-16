import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FazerFeriasService {

  constructor() { }

  dias_tipo(tipo:string):any{
    switch(tipo){
      case 'quinzenal':
          return 15;
      case 'mensal':
          return Math.random();
      default:
          return 0;
    }
  }


}
