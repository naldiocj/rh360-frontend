
import { Deserializable } from './deserializable.model';
export class ProvimentoModel implements Deserializable {
  patente_nome?: string;
  numero_despacho?: number;
  ordem_descricao?: string
  despacho_descricao?: string
  data_provimento?: Date;
  sigpq_acto_progressaos_nome?: number;
  activo?: number;
  descricao?: string;
  created_at?: Date;
  updated_at?: Date;
  id?: number;
  numero_ordem?: string
  anexo?: string
  situacao?: string
  pessoa_id?: string

  deserialize(input: ProvimentoModel): this {
    return Object.assign(this, input);
  }
}
