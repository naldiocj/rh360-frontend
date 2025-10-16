import { Deserializable } from "./deserializable.model"

export class Reclamation  implements Deserializable{
    id?:number
    content?:string
    doc_content?:string
    pessoa_id?:string
    created_at?: Date
    updated_at?: Date
    elimanado?:boolean

    deserialize(input: any): this {
        return Object.assign(this,input)
    }


}
