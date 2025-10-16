import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable, of, Subject, takeUntil } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class RelatorioService {

    public api: string = '/api/v1/sigpq/relatorio';
    // public base: string = this.api + '/perfil';
    private cancelSubject = new Subject<void>();

    constructor(
        private httpApi: ApiService,
        private sanitizer: DomSanitizer) { }

    createImageBlob(file: any, extension: any = null): any {

        const typeMap: any = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
        };

        const ext = extension ? typeMap[extension] : file?.type
        const blob = new Blob([file], { type: ext });
        const url = window.URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    gerar(opcoes: any): Observable<any> {
        // params = params.append('pessoaId', opcoes.pessoaId);
        // return this.httpApi._getWhithFile(`${this.api}`, opcoes);
        return this.httpApi
            ._getWhithFile(`${this.api}`, opcoes)
            .pipe(debounceTime(500),
                takeUntil(this.cancelSubject)
            )
    }

    cancelarGeracaoRelatorio() {
        this.cancelSubject.next();
    }

    buscarOpcoesDoSelector() {
        return this.httpApi
            .get(`${this.api}/buscarOpcoesDoSelector`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

}