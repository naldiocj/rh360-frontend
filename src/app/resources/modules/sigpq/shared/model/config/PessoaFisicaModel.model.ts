import { Deserializable } from "../deserializable.model";

 
export class PessoaFisicaModel implements Deserializable {
    id?: number;
    nomeCompleto?: string;
    nif?: number;
    sigla?: string;
    site?: string;
    logotipo?: string;
    pessoajuridica_id?: number
    descricao?: Text
    activo?: Text
    created_at?: Date;
    updated_at?: Date;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
