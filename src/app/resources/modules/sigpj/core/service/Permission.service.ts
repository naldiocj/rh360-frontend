import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class PermissionService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpj/permission';

    constructor(private httpApi: ApiService) { }

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

    listarRolePermission(id:number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/role-permission/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    listarUserPermission(id: number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/user-permission/${id}`,)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }


    registarRolePermission(item: any): Observable<any> {
      //  console.log(item);

        return this.httpApi
            .post(`${this.base}/role-permission`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    registarUserPermission(item: any): Observable<any> {
        //  console.log(item);
  
          return this.httpApi
              .post(`${this.base}/user-permission`, item)
              .pipe(
                  debounceTime(500),
                  map((response: Object): any => {
                      return Object(response).object;
                  })
              )
      }
    
    editar( item: any, id: number ): Observable<any> {
        return this.httpApi
            .put(`${this.base}/${id}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    verUm(name:any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${name}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    deleteRolePermission(options:any): Observable<any> {
        return this.httpApi
            .delete(`${this.base}/delete-role-permission/${options.permission_id}/${options.role_id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    deleteUserPermission(options:any): Observable<any> {
        return this.httpApi
            .delete(`${this.base}/delete-user-permission/${options.permission_id}/${options.user_id}`)
            .pipe(debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
 

}