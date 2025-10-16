
import { Deserializable } from './deserializable.model';
export class TipoOutroDadoModel implements Deserializable {
  id?: number;
  nome?: string;
  user_id?: number;
  activo?: boolean;
  descricao?: string;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: TipoOutroDadoModel): this {
    return Object.assign(this, input);
  }
}
