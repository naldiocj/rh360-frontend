import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, distinctUntilChanged,  map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class EstadoCivilService {

    public api: string = '/api/v1';
    public base: string = this.api + '/estado-civil';

    constructor(private httpApi: ApiService) { }

    listar(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map(
                    (data) => Object(data).object
                )
            );

        // this is just the HTT
    }

}