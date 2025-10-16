
import { Deserializable } from './deserializable.model';
export class QueixaModel implements Deserializable {
  id?: number; 
  nome_completo?: string;  
  apelido?: string;
  data_nascimento?: string;   
  genero?: string;    
  estado_civil?: string; 
  naturalidade?: string;  
  bi_ou_cedula?: string; 
  validade_bi?: string; 
  residencia_bi?: string; 
  obs?: string; 

  nome_pai?: string;  
  nome_mae?: string;  
  ocupacao?: string; 
  residencia_atual?: string; 
  contactos?: string;   
  natureza_infrancao?: string;      
  foto?: string;  
  tipo?: string;  
  id_acusado?: string;  
  funcionario_nome?: string;  

  cadastrado_por?: string;  
  updated_at?: Date;
  createdAt?: Date; 
  //dados_queixoso
  acusado_nome?: string;  
  acusado_apelido?: string;   
  acusado_genero?: string;  
  acusado_nip?: string;  



  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 