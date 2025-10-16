
import { Deserializable } from './deserializable.model';
export class DiversoModel implements Deserializable {
  id?: number; 
  oficio?: number; 
  user_id?: number;
  assunto?: string;
  observacao?: string;
  orgao_id?: string;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 