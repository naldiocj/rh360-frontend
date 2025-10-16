import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SecureService } from '@core/authentication/secure.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private secureService: SecureService) {}

  public get(
    path: string,
    httpParams: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(environment.app_url + path, {
        headers: this.secureService.getHeaders,
        params: httpParams,
      })
      .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: Object = {}): Observable<any> {
    console.log('ApiService.post called with path:', path);
    console.log('ApiService.post body:', body);
    console.log('ApiService.post headers:', this.secureService.getHeaders);

    return this.http
      .post(environment.app_url + path, body, {
        headers: this.secureService.getHeaders,
      })
      .pipe(
        map((response) => {
          console.log('ApiService.post response:', response);
          return response;
        }),
        catchError(this.formatErrors)
      );
  }

  public post2(path: string, body: Object = {}): Observable<any> {
    console.log('ApiService.post called with path:', path);
    console.log('ApiService.post body:', body);
    console.log('ApiService.post headers:', this.secureService.getHeaders);

    return this.http
      .post(environment.app_url + path, body, {
        // headers: this.secureService.getHeaders,
      })
      .pipe(
        map((response) => {
          console.log('ApiService.post response:', response);
          return response;
        }),
        catchError(this.formatErrors)
      );
  }

  public put2(path: string, body: Object = {}): Observable<any> {
    console.log('ApiService.post called with path:', path);
    console.log('ApiService.post body:', body);
    console.log('ApiService.post headers:', this.secureService.getHeaders);

    return this.http
      .put(environment.app_url + path, body, {
        // headers: this.secureService.getHeaders,
      })
      .pipe(
        map((response) => {
          console.log('ApiService.post response:', response);
          return response;
        }),
        catchError(this.formatErrors)
      );
  }

  public put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(environment.app_url + path, body, {
        headers: this.secureService.getHeaders,
      })
      .pipe(catchError(this.formatErrors));
  }

  public patch(path: string, body: Object = {}): Observable<any> {
    return this.http
      .patch(environment.app_url + path, body, {
        headers: this.secureService.getHeaders,
      })
      .pipe(catchError(this.formatErrors));
  }

  public delete(path: string): Observable<any> {
    return this.http
      .delete(environment.app_url + path, {
        headers: this.secureService.getHeaders,
      })
      .pipe(catchError(this.formatErrors));
  }

  public formatErrors(error: any): Observable<any> {
    console.log(error?.message);
    return throwError(JSON.stringify(error));
  }

  public _postWhitOption(
    path: string,
    body: Object = {},
    option = {}
  ): Observable<any> {
    return this.http
      .post(environment.app_url + path, body, option)
      .pipe(catchError(this.formatErrors));
  }

  public _getFileFromServer(path: any): Observable<any> {
    return this.http
      .post<Blob>(path, null, {
        responseType: 'blob' as 'json',
        headers: this.secureService.getHeaders,
      })
      .pipe(
        map((res) => {
          return new Blob([res], { type: 'application/pdf' });
        })
      );
  }

  public _getWhithFile(
    path: string,
    httpParams: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(environment.app_url + path, {
        responseType: 'blob',
        headers: this.secureService.getHeaders,
        params: httpParams,
      })
      .pipe(catchError(this.formatErrors));
  }
}
