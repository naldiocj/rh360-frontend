import { Deserializable } from './deserializable.model';

export class Funcionario implements Deserializable {
    id?: number
    nome_completo?: string
    genero?: string
    nip?: string
    patente_nome?: string
    created_at?: Date
    updated_at?: Date

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
