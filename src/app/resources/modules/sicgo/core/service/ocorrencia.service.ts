import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private occurrenceSource = new BehaviorSubject<any>(null);
  currentOccurrence = this.occurrenceSource.asObservable();

  private sharingEnabledSource = new BehaviorSubject<boolean>(false);
  sharingEnabled = this.sharingEnabledSource.asObservable();

  private sharingDisabledSource = new BehaviorSubject<boolean>(true);
  sharingDisabled = this.sharingDisabledSource.asObservable();

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/ocorrencias';
  constructor(private httpApi: ApiService, private sanitizer: DomSanitizer) { }


  setOccurrence(occurrence: any): void {
    this.occurrenceSource.next(occurrence);
  }

  enableSharing(enable: boolean): void {
    this.sharingEnabledSource.next(enable);
  }

  disableSharing(enable: boolean): void {
    this.sharingDisabledSource.next(enable);
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

  listarTodos(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarExpedientes(): Observable<any[]> {
    return this.httpApi.get(this.base)
  }

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => { 
        return Object(response).object;
      })
    );
  }

  register(formData: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  editar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminar(id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}/eliminar`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminarMultiplo(ids: number[]): Observable<any> {
    return this.httpApi
      .post(`${this.base}/eliminar-multiplo`, { ids }) // Use POST em vez de DELETE
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  buscarFicha(id: any | number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${id}/ficha`,)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  listarPorid(options: any) {
    return this.httpApi
      .get(`${this.base}`, options)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: any): any => {
          return response.object;
        })
      );
  }

  salvarCoordenadas(options: any) {
    return this.httpApi
      .get(`${this.base}`, options)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: any): any => {
          return response.object;
        })
      );
  }




  getCrimeHotspots(): Observable<any[]> {
  return this.httpApi.get(`${this.base}/crimes`);
}
}
