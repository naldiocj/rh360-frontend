
import { Deserializable } from './deserializable.model';
export class PecasList implements Deserializable {
  id?: number;  
  nome?: string;
  blob?: string; 
  disciplinar?: number;   
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 