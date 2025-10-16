import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class PlanoDeNecessidadesService {
  private api: string = '/api/v1/sigvest';
  private base: string = this.api + '/plano_necessidades';
  private cancelSubject = new Subject<void>();


  constructor(
    private httpApi: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  public listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      distinctUntilChanged(),
      debounceTime(500),
      tap(console.log),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public registar(tipo_de_meios_dados: any): Observable<any> {
    console.log(tipo_de_meios_dados)
    return this.httpApi.post(`${this.base}`, tipo_de_meios_dados).pipe(
      distinctUntilChanged(),
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public editar(id: number, item: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public eliminar(id: number): Observable<void> {
    return this.httpApi.delete(`${this.base}/${id}`).pipe(
      debounceTime(500)
    )
  }

  validarPlano(id: any, item: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/validar-plano/${id}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  aceitarPlano(id: any, item: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/aceitar_plano/${id}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  /** Gerando o relatorio individual do plano selecionado */
  gerarPlano(options: any): Observable<any> {
    return this.httpApi._getWhithFile(`${this.base}/documento_plano_necessidade/pdf`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(console.log),
      takeUntil(this.cancelSubject)

    );
  }

  gerarPlanoColectivo(options: any): Observable<any> {
    return this.httpApi._getWhithFile(`${this.base}/relatorio_geral_plano_minint/pdf`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(console.log),
      takeUntil(this.cancelSubject)

    );
  }


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

  cancelarGeracaoRelatorio() {
    this.cancelSubject.next();
  }
}