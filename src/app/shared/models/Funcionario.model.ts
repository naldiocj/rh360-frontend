import { Deserializable } from './deserializable.model';

export class Funcionario implements Deserializable {
    id?: number;
    nome_completo?: string;
    patente_nome?: string;
    user_id?: number;
    quadro!:string
    activo?: boolean;
    apelido?: string;
    genero?: string;
    nome_pai?: string;
    nome_mae?: string;
    data_nascimento?: Date;
    nacionalidade_id?: number;
    estado_civil_id?: number;
    nip?: number;
    cargo?: string
    numero_processo?: number;
    numero_agente?: number;
    data_adesao?: Date;
    estado?: string
    orgao?: any
    descricao?: string;
    foto_efectivo?: Text;
    sigpq_tipo_orgao:any
    created_at?: Date;
    updated_at?: Date;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
