import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceDescriptorService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/busca_delitouso';

  constructor(private httpApi: ApiService) {}


  recognize(descritores: number[]): Observable<any> {
    return this.httpApi.post(`${this.base}/recognize`, { descritores });
  }

  searchFace(faceData: Float32Array): Observable<any> {
    return this.httpApi.post(this.base, { faceData });
  }
}


