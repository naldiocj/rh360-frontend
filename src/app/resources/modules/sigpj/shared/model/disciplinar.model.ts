
import { Deserializable } from './deserializable.model';
export class DisciplinarModel implements Deserializable {
  id?: number;
  numero_processo?: number;
  numero_oficio?: number;
  funcionario_id?: number;
  user_id?: number;
  infracao?: string;
  orgao_id?: number;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
