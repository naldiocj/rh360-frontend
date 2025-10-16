import { Deserializable } from './deserializable.model';

// P - Pendente, C - Cancelado, A - Aprovado, R - Recuzado
// enum Estado { P, C, A, R }

export class Evento implements Deserializable {
    id?: number;
    titulo?: string;
    data?: Date;
    sigpq_tipo_evento_id?: number;
    pessoafisica_id?: number;
    // estado?: Estado
    created_at?: Date;
    updated_at?: Date;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
