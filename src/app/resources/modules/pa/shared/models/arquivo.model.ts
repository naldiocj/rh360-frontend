import { Deserializable } from "./deserializable.model";

export class Arquivo  implements Deserializable{
    id?:number
    pessoa_id?:number
    descricao?:string
    arquivo?:string
    created_at?: Date
    updated_at?: Date 

    deserialize(input: any): this {
        return Object.assign(this,input)
    }
}
