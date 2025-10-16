import { Deserializable } from "../../../../../shared/models/deserializable.model";

export class Pessoal implements Deserializable{
    id?:number;
    nome_completo?:string;
    data_nascimento?:Date;
    nacionalidade?:string;
    estado_civil_nome?:string;
    genero?:string;
    nome_pai?:string;
    nome_mae?:string;
    nome_conjuge?:string;
    numero_bi?:string;
    data_expiracao_bi?:Date;
    n_carta_conducao?:string;
    n_passporte?:string;
    data_expiracao_passporte?:Date;
    habilitacoes_literaria?:string;
    contacto_familiar?:string;
    email_pessoal?:string;
    created_at?:Date;
    updated_at?:Date;


    deserialize(input: any): this {
        return Object.assign(this, input)
    }
}