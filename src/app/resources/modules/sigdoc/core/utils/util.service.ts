import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public tratamentoComposto = (key: any): any | null => {
    console.log(key)
    const estados: any = {

      
      recebido: {
        nome: 'Recebido',
      },
      emtratamento: {
        nome: 'Em Tratamento',
      },  
      pendente: {
        nome: 'Pendente',
      }, 
      despacho: {
        nome: 'Despacho',
      },
      expedido: {
        nome: 'Expedido',
      },
      saído: {
        nome: 'Saido',
      },
      pronunciamento: {
        nome: 'Pronunciamento',
      },
      Parecer: {
        nome: 'Parecer',
      },
    };
    return estados[key?.toString().toLowerCase()];
  };

  public tratamentoPedente(key: any) {
    return key?.toString().toLowerCase().includes('p', 'r', 'e')
  }
  public tratamentoDespacho(key: any) {
    return key?.toString().toLowerCase().includes('d')
  }
  public tratamentoExp(key: any) {
    return key?.toString().toLowerCase().includes('ex')
  }
}
