import { Deserializable } from './deserializable.model';

export class TipoEvento implements Deserializable {
    id?: number;
    nome?: string;
    sigla?: string;
    descricao?: Text
    created_at?: Date;
    updated_at?: Date;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
