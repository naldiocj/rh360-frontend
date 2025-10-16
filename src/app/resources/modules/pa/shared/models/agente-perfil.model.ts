
import { Deserializable } from "./deserializable.model";

export class Perfil implements Deserializable{
    id?:number
    nome_completo?:string;
    patente_nome?:string;
    nip?:string;
    numero_agente?:string;
    genero?:string
    descricao?:string;

    deserialize(input: any): this {
        return Object.assign(this,input)
    }
}