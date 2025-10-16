
import { Deserializable } from './deserializable.model';
export class DecisaoList implements Deserializable {
  id?: number;
  processo?: number;
  oficio?: number;  
  data?: number;  
  transcricao?: string;  
  despacho?: string;  
  decisao?: string;  
  disciplinar_id?: string; 
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 