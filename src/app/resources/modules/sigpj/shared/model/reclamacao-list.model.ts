
import { Deserializable } from './deserializable.model';
export class ReclamacaoList implements Deserializable {
  id?: number; 
  oficio?: number; 
  nome_completo?: number; 
  assunto?: string;
  orgao?: string; 
  genero?: string; 
  nip?: string; 
  sigla?: string; 
  totalArguido?:number;
  processoID?:number;
  updated_at?: Date;
  created_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
}
}
 