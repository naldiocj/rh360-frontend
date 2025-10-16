// evidencia.model.ts
export interface DTOEvidencia {
  data: string;
  sicgo_tipo_evidencia_id: number;
  sicgo_importancia_id: number; 
  sicgo_ocorrencia_id: number;
  endereco: string;
  descricao: string; 
  anexos?: Anexo[];
}

export interface Anexo {
  nome: string;
  tipo: string;
  caminho: string;
  tamanho: number;
  descricao?: string;
}