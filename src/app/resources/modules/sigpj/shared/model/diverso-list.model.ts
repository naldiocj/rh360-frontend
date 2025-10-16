
import { Deserializable } from './deserializable.model';
export class DiversoList implements Deserializable {
  id?: number; 
  oficio?: number;  
  observacao?: string;
  sigla?: string;   
  proveniencia?: string;   
  data?: string; 
  assunto?: string;   
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 