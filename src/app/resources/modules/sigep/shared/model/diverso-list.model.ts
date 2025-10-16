
import { Deserializable } from './deserializable.model';
export class DiversoList implements Deserializable {
  id?: number; 
  oficio?: number;  
  observacao?: string;
  proveniencia?: string;   
  assunto?: string;   
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 