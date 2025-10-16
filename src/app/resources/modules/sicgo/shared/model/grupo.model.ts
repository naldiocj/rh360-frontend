import { Deserializable } from './deserializable.model';
export class GrupoModel implements Deserializable {
  
  historico?: string;
  id!: number;
  nome?: number;
  sigla?: string;
  sicgo_provincia_id ?: number;
  sicgo_municipio_id?: string;
  datacriada?: Date;
  endereco?: string;
  observacao?: string; 
  activo?: boolean;
  eliminado?: boolean;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date; 
  deserialize(input: GrupoModel): this {
    return Object.assign(this, input);
  }
}