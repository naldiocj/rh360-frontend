import { Deserializable } from './deserializable.model';

export interface User {
    id: number;
    username: string;
    email: string;
    pessoa_id?: number;
    activo: boolean;
    forcar_alterar_senha?: boolean;
    notificar_por_email?: boolean;
    eliminado?: boolean;
    descricao?: string;
    created_at?: string;
    updated_at?: string;
    nome_completo?: string;
    aceder_todos_agentes?: boolean;
    aceder_painel_piips?: boolean;
    [key: string]: any;
}

export interface Orgao {
    id: number;
    nome: string;
    sigla: string;
    descricao?: string;
    activo?: boolean;
    user_id?: number;
    eliminado?: boolean;
    created_at?: string;
    updated_at?: string;
    nome_completo?: string;
    [key: string]: any;
}

export interface Role {
    id: number;
    name: string;
    [key: string]: any;
}

export interface ModuleConfig {
    sigla?: string;
    [key: string]: any;
}

export interface TokenData {
    user: User;
    role: Role;
    permissions: string[];
    modules: ModuleConfig;
    pessoa: {
        id: number;
        [key: string]: any;
    };
    orgao: Orgao;
}

export class Token implements Deserializable {
    type: string;
    token: string;
    refreshToken?: string;
    data: TokenData;
    user: User;
    orgao: Orgao;

    constructor() {
        this.type = '';
        this.token = '';
        this.data = {} as TokenData;
        this.user = {} as User;
        this.orgao = {} as Orgao;
    }

    private extractData(source: any): Partial<TokenData> {
        const data: Partial<TokenData> = {};
        
        if (source?.data) {
            Object.assign(data, source.data);
        }
        
        // Extrai cada campo individualmente, permitindo fallbacks
        data.user = source?.data?.user || source?.user || {};
        data.orgao = source?.data?.orgao || source?.orgao || {};
        data.role = source?.data?.role || source?.role || {};
        data.permissions = source?.data?.permissions || source?.permissions || [];
        data.modules = source?.data?.modules || source?.modules || [];
        data.pessoa = source?.data?.pessoa || source?.pessoa || {};

        return data;
    }

    deserialize(input: any): this {
        if (!input) {
            throw new Error('Input cannot be null or undefined');
        }

        // Valida campos obrigatórios
        if (!input.token || typeof input.token !== 'string') {
            throw new Error('Token must be a valid string');
        }

        if (!input.type || typeof input.type !== 'string') {
            throw new Error('Type must be a valid string');
        }

        // Atribui campos básicos
        this.type = input.type;
        this.token = input.token;
        this.refreshToken = input.refreshToken;

        // Extrai e valida dados do token
        const extractedData = this.extractData(input);
        
        // Atribui dados extraídos
        this.data = extractedData as TokenData;
        this.user = this.data.user;
        this.orgao = this.data.orgao;

        // Validação final
        if (!this.user || !this.orgao) {
            console.warn('Token data is incomplete:', { user: !!this.user, orgao: !!this.orgao });
        }

        return this;
    } 
}