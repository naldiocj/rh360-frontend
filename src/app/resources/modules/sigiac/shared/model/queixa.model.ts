
import { Deserializable } from './deserializable.model';
export class QueixaModel implements Deserializable {
  id?: number; 
  nome_acusado?: string;  
  nome_queixoso?: string;
  numero_bi?: string;   
  apelido?: string;    
  nascimento?: string; 
  genero?: string;  
  residencia_atual?: string; 
  nome_pai?: string;  
  nome_mae?: string;  
  ocupacao?: string; 
  contactos?: string;  
  naturalidade?: string;  
  residencia_bi?: string;      
  estado?: string;  
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 