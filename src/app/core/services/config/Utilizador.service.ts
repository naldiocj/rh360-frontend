import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "../interfaces/BaseService.service";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UtilizadorService extends BaseService {
  constructor(httpApi: ApiService) {
    super(httpApi, "/sigpq/config/acl/utilizador");
    // super(httpApi, '/piips/auth/config/acl/utilizador');
  }

  buscarUtilizadorPorEmail(email: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${email}/forcar-alterar-senha`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((data: any) => Object(data).object)
    );
  }
  redefinirSenha(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}/redefinir-senha`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((data: any) => Object(data).object)
    )
  }

  activaDesactiva(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}/activa-desactiva`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((data: any) => Object(data).object)
    )
  }
}
