export interface Testemunha {
    id: number;
    data: string;
    nacionalidade: string | null;
    bi_n: string | null;
    nome: string;
    genero: string;
    tel: string;
    descricao: string | null;
    sicgo_denucia: string;
    sicgo_nivel_seguranca_id: number | null;
    sicgo_importancia_id: number | null;
    eliminado: number;
    activo: number;
    user_id: number;
    sicgo_ocorrencia_id: number;
    created_at: string;
    updated_at: string;
  }
  
export interface Expediente {
    descricao: string;
    status: string;
    codigo_sistema: string;
    data_ocorrido: string;
    tipicidade: string;
    tipo_ocorrencia: string;
    categoria: string;
    provincia: string;
    municipio: string;
    local: string;
    importancia: string;
    testemunhas: Testemunha[];
    evidencias: any[];  // Defina um tipo mais específico se souber
    created_at: string;
    updated_at: string;
    id: number;
  }