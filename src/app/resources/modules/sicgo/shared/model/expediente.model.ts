export interface PaginatedResult {
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    previous_page_url: string | null;
  };
  data: Expediente[];
  statusCounts: {
    dentro_prazo: number;
    fora_prazo: number;
    arquivado: number;
  };
}

export interface Expediente {
  id: number;
  codigo_sistema: string;
  tipoExpediente: string;
  numeroExpediente: string;
  nomeCaso: string;
  especialista: string;
  local: string;
  ano: string;
  assunto: string;
  referencia: string;
  observacao: string;
  expedienteP: boolean;
  activo: boolean;
  eliminado: boolean;
  user_id: number;
  endEditDate: string;
  status: string;
  status_prazo: 'dentro_prazo' | 'fora_prazo' | 'arquivado';
  created_at: string;
  updated_at: string;
  delituosos: Delituoso[];
}

export interface Delituoso {
  suspeito_id: number;
  codigo_sistema: string;
  nome: string;
  apelido: string;
  alcunha: string;
  genero: string;
  idade: number;
}