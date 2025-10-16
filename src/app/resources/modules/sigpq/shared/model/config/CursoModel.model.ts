import { Deserializable } from "../deserializable.model";

export class CursoModel implements Deserializable {
    id?: number;
    nome?: string;
    sigla?: string;
    descricao?: Text;
    activo?: boolean
    user_id?: number
    created_at?: Date;
    updated_at?: Date;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
