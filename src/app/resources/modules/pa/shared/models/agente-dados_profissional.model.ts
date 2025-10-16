import { Deserializable } from "../../../../../shared/models/deserializable.model";

export class AgenteDadosProfissional implements Deserializable{

    id?:number;
    id_agente?:number;
    pseudonomia?:string;
    regime?:string;
    posto?:string;
    nip?:string;
    n_agente?:string;
    n_processo?:string;
    anexo_processo?:string;
    tipo_vinculo?:string;
    carreira?:string;
    cargo?:string;
    data_ingresso?:Date

    deserialize(input: any): this {
        return Object.assign(this, input)
    }
}