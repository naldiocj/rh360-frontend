import { Deserializable } from './deserializable';
export class FormadorModel implements Deserializable {
  formador_id!: number;
  curso_nome?:  string;
  formador_genero?:  string;
  formador_nip?: string;
  formador_nome?: string;


  deserialize(input: FormadorModel): this {
    return Object.assign(this, input);
  }
}
