import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OccurrenceService {
  private occurrences = [
    {
      "Id": 1001,
      "Ano": 2023,
      "IdAno": "1001-2023",
      "Codigo_Sistema": "POL123",
      "Data": "2023-07-21",
      "Titulo": "Furto Residencial",
      "Tipicidade": "Furto",
      "Enquadramento_Legal": "Art. 155 do Código Penal",
      "Nivel_Seguranca": "Alto",
      "Zona": "Residencial",
      "Endereco": "Rua das Flores, 123",
      "EstadoProcesso": "pendente" 
    },
    {
      "Id": 1002,
      "Ano": 2023,
      "IdAno": "1002-2023",
      "Codigo_Sistema": "POL456",
      "Data": "2023-07-22",
      "Titulo": "Assalto a Mão Armada",
      "Tipicidade": "Roubo",
      "Enquadramento_Legal": "Art. 157 do Código Penal",
      "Nivel_Seguranca": "Alto",
      "Zona": "Comercial",
      "Endereco": "Avenida dos Comerciantes, 789",
      "EstadoProcesso": "Em andamento" 
    },
    {
      "Id": 1003,
      "Ano": 2023,
      "IdAno": "1003-2023",
      "Codigo_Sistema": "POL789",
      "Data": "2023-07-23",
      "Titulo": "Agressão Física",
      "Tipicidade": "Lesão Corporal",
      "Enquadramento_Legal": "Art. 129 do Código Penal",
      "Nivel_Seguranca": "Médio",
      "Zona": "Centro",
      "Endereco": "Praça da Liberdade, 456",
      "EstadoProcesso": "Em andamento" 
    },
    {
      "Id": 1004,
      "Ano": 2023,
      "IdAno": "1004-2023",
      "Codigo_Sistema": "POL101",
      "Data": "2023-07-24",
      "Titulo": "Tráfico de Drogas",
      "Tipicidade": "Tráfico de Entorpecentes",
      "Enquadramento_Legal": "Art. 33 da Lei de Drogas",
      "Nivel_Seguranca": "Alto",
      "Zona": "Periferia",
      "Endereco": "Rua das Palmeiras, 789",
      "EstadoProcesso": "concluido" 
    },
    {
      "Id": 1005,
      "Ano": 2023,
      "IdAno": "1005-2023",
      "Codigo_Sistema": "POL202",
      "Data": "2023-07-25",
      "Titulo": "Homicídio",
      "Tipicidade": "Crime Contra a Vida",
      "Enquadramento_Legal": "Art. 121 do Código Penal",
      "Nivel_Seguranca": "Crítico",
      "Zona": "Residencial",
      "Endereco": "Rua dos Moradores, 321",
      "EstadoProcesso": "pendente" 
    },
    {
      "Id": 1006,
      "Ano": 2023,
      "IdAno": "1006-2023",
      "Codigo_Sistema": "POL303",
      "Data": "2023-07-26",
      "Titulo": "Ameaça",
      "Tipicidade": "Ameaça",
      "Enquadramento_Legal": "Art. 147 do Código Penal",
      "Nivel_Seguranca": "Baixo",
      "Zona": "Comercial",
      "Endereco": "Avenida dos Comerciantes, 789",
      "EstadoProcesso": "concluido" 
    }
  ];


  constructor() { }

  getOccurrences(): Observable<any> {
    return of(this.occurrences);
  }
}
