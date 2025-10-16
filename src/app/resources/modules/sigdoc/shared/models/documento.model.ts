export interface Documento {
  cor: string;
  id: number;
  user_id: number;
  tipo_documento_id: number;
  destinatario_final: number; 
  classificacao_id: number;
  estado_documento_id: number;
  destinatario_documento: number; 
  num_documento: number; 
  num_ordem: number;
  num_oficio: string; 
  assunto_documento: string;
  procedencia_documento: string;
  nome_remetente: string;
  contacto_remetente: string; 
  referencia: string;
  descricao: string;
  documento_file: string; 
  gera_app: boolean;
  eliminado: boolean;
  created_at: Date; 
  updated_at: string; 
}