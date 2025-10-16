
import { Deserializable } from './deserializable.model';
export class ParecerList implements Deserializable {
  id?: number;
  processo?: number;
  oficio?: number;  
  assunto?: string;  
  data?: number; 
  disciplinar_id?: string; 
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 