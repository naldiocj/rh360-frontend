import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class ArquivoOrgaoService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/arquivos-orgao');
    }

    /**
     * Obtém documentos anexados para uma tramitação específica.
     * @param tramitacaoId ID da tramitação para a qual os documentos serão buscados.
     * @returns Observable com os documentos anexados.
     */
    getDocumentosAnexados(tramitacaoId: number) {
        return this.httpApi.get(`/sigdoc/arquivos-orgao/documentos-tramitacao/${tramitacaoId}`);
    }
}   