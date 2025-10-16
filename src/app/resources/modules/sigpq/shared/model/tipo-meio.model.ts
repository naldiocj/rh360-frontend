
import { Deserializable } from './deserializable.model';
export class TipoMeioModel implements Deserializable {
  id?: number;
  nome?: string;
  user_id?: number;
  activo?: boolean;
  descricao?: string;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: TipoMeioModel): this {
    return Object.assign(this, input);
  }
}
