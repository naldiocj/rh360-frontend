import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject, Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfisOperativoService {
  private officialOpSource = new BehaviorSubject<any>(null); 
  currentOfficialOpSource = this.officialOpSource.asObservable();

  private sharingEnabledSource = new BehaviorSubject<boolean>(false);
  sharingEnabled = this.sharingEnabledSource.asObservable();

  private sharingDisabledSource = new BehaviorSubject<boolean>(true);
  sharingDisabled = this.sharingDisabledSource.asObservable();

  


    public api: string = '/api/v1/sicgo';
    public base: string = this.api + '/dinfop_perfis_operativo';

    constructor(private httpApi: ApiService) { }


    
    setOffialOp(occurrence: any): void {
        this.officialOpSource.next(occurrence);
      }
    
      enableSharing(enable: boolean): void {
        this.sharingEnabledSource.next(enable);
      }
    
      disableSharing(enable: boolean): void {
        this.sharingDisabledSource.next(enable);
      }

      
    listar(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }


    registar(item: any): Observable<any> {
        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    editar(id: any, item: any): Observable<any> {
        return this.httpApi.patch(`${this.base}/${id}`, item).pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object
            })
        )
    }

}