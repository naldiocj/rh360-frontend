import { Deserializable } from '@shared/models/deserializable.model';


export class Testemunha implements Deserializable {
  Id?: number;
  Codigo_Sistema?: number;
  data!: string;
  nome!: string;
  titulo!: string;
  nacionalidade!: string;
  tel!: string;
  descricao!: string;
  sicgo_denucia!: string;
  sicgo_importancia_id!: number;
  sicgo_nivel_seguranca_id!: number;
  deserialize(input: any): this {
    throw new Error('Method not implemented.');
  }
   // Assinatura de índice para permitir qualquer outra propriedade
}






export interface Testemunha {
  id: number;
  codigo_sistema: string;
  data: string;
  nome: string;
  titulo: string;
  nacionalidade: string;
  tel: string;
  descricao: string;
  sicgo_denucia: string;
  sicgo_importancia_id: number;
  sicgo_nivel_seguranca_id: number;
  created_at: string;
  updated_at: string;
  // ... adicione todos os outros campos conforme necessário
}

