import { Deserializable } from '@shared/models/deserializable.model';
import { randomUUID } from 'node:crypto';
import { Testemunha } from './testemunhas.model';


export class Ocorrencia implements Deserializable {
  data_ocorrido: any;
  sicgo_tipicidade_ocorrencia_id: any;
  sicgo_tipo_ocorrencia_id: any;
  sicgo_objecto_crimes_id: any;
  sicgo_tipo_categoria_id: any;
  sicgo_tipo_local_id: any;
  local: any;
  provincia_id: any;
  municipio_id: any;
  participantes: any;
  veiculos: any;
  Id?: number;
  Ano?: Date;
  IdAno?: number;
  Codigo_Sistema?: number;
  tipoOcorrencia?: string;
  dataOcorrencia?: string;
  titulo!: string;
  Tipicidade?: string;
  enquadramentoLegal?: string;
  gravidade?: string;
  objetoCrime?: string;
  zonaLocalidade?: string;
  dataHoraQueixa?: string;
  nomeQuerelante?: string;
  numeroBilhete?: string;
  controloPretendido?: string;
  endereco?: string;
  responsavel?: string;
  nivelSeguranca?: string;
  descricao?: string;
  // fotos: string[]; // array de URLs das fotos
  arquivo?: string; // URL ou caminho do arquivo
  processos?: string[]; // array de IDs de processos relacionados
  formulariosRelacionados?: string[]; // array de IDs de formulários relacionados
  EstadoProcesso?: string;
  sicgo_importancia_id: any;

  deserialize(input: Ocorrencia): this {
    return Object.assign(this, input);
  } // Assinatura de índice para permitir qualquer outra propriedade
}






export interface Ocorrencias {
  id: number;
  codigo_sistema: string;
  titulo: string;
  bi_n: string | null;
  endereco: string;
  descricao: string;
  nome_ocorrente: string;
  activo: number;
  data_ocorrido: string;
  created_at: string;
  updated_at: string;
  // ... adicione todos os outros campos conforme necessário
}

export interface Arquivo {
  id: number;
  anexo: string;
  tipo_arquivo: string;
  // ... adicione todos os outros campos conforme necessário
}

export interface ObjectoCrime {
  id: number;
  isActive: boolean;
  sicgo_objecto_crime_id: number;
  objecto_crime: string;
	disabled?: boolean;
  // ... adicione todos os outros campos conforme necessário
}

export interface RespostaServidor {
  message: string;
  object: Ocorrencia;
  arquivos: Arquivo[];
  testemunhas: Testemunha[];
  objecto_crimes: ObjectoCrime[];
}
