import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { SecureService } from '@core/authentication/secure.service';

@Injectable()
export class ApiZKService {

    constructor(private http: HttpClient, private secureService: SecureService) { }

    public get(path: string, httpParams: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(
            environment.app_zk_url
            + path,
            {
                headers: this.secureService.getZKHeaders,
                params: httpParams
            }
        ).pipe(catchError(this.formatErrors));
    }

    public post(path: string, body: Object = {}): Observable<any> {
        return this.http.post(
            environment.app_zk_url + path, body,
            {
                headers: this.secureService.getZKHeaders
            }
        ).pipe(catchError(this.formatErrors));
    }



    public formatErrors(error: any): Observable<any> {
        return throwError(JSON.stringify(error));
    }

}
