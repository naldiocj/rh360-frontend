
import { Deserializable } from './deserializable.model';
export class MeioModel implements Deserializable {
  id?: number;
  tipo_meio_id?: number;
  tamanho?: number;
  activo?:boolean
  tipo_meio_nome?:string
  quantidade?: number;
  descricao?: string;
  created_at?: Date;
  updated_at?: Date;

  deserialize(input: MeioModel): this {
    return Object.assign(this, input);
  }
}
