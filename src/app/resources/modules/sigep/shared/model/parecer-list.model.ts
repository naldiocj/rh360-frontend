
import { Deserializable } from './deserializable.model';
export class ParecerList implements Deserializable {
  id?: number;
  processo?: number;
  oficio?: number;  
  assunto?: string;  
  disciplinar_id?: string; 
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 