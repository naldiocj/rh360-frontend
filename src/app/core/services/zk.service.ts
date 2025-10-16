import { Injectable } from '@angular/core';
import { ApiZKService } from '@core/providers/http/apiZK.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZKService {
  public base: string;
  constructor(public httpApi: ApiZKService) {
    this.base = `${environment.app_zk_url}`;
  }

  public open(): Observable<any> {
    return this.httpApi.post('/open');
  }
  public enroll(fingerId: Number): Observable<any> {
    return this.httpApi.post('/enroll?fingerId=' + fingerId);
  }
  public register(data: FormData): Observable<any> {
    return this.httpApi.post(this.base, data).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: any): any => {
        return response.object;
      })
    );
  }
public capture(): Observable<any> {
  return this.httpApi.post(`${this.base}/capture`).pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map((response: any): any => {
      return response.object;
    })
  );
}

  public close(): Observable<any> {
    return this.httpApi.post('/close');
  }
  public identify(): Observable<any> {
    return this.httpApi.post(`${this.base}/identify`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: any): any => {
        return response.object;
      })
    );
  }
  public checking(): Observable<any> {
    return this.httpApi.post(`${this.base}/verify-fingerprint`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: any): any => {
        return response.object;
      })
    );
  }
}
