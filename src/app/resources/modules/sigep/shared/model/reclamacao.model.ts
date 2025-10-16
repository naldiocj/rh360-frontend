
import { Deserializable } from './deserializable.model';
export class ReclamacaoModel implements Deserializable {
  id?: number; 
  oficio?: number;
  funcionario_id?: number;
  user_id?: number;
  assunto?: string;
  orgao_id?: number;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 