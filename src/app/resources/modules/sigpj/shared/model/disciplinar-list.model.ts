
import { Deserializable } from './deserializable.model';
export class DisciplinarList implements Deserializable {
  id?: number;
  processo?: string;
  oficio?: string;
  infracao?: string;
  orgao?: string;
  orgao_id?: number;
  data_oficio?: Date;
  sigla?: number;
  totalInterveniente?: number;
  processoID?: number;
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
