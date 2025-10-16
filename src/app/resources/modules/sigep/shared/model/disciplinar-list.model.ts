
import { Deserializable } from './deserializable.model';
export class DisciplinarList implements Deserializable {
  id?: number;
  processo?: number;
  oficio?: number; 
  nome_completo?: number; 
  infracao?: string;
  orgao?: string; 
  genero?: string; 
  nip?: string; 
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 