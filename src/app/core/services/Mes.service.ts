import { Observable, debounceTime, map } from 'rxjs';

import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from './interfaces/BaseService.service';


@Injectable({
  providedIn: 'root',
})
export class MesService extends BaseService {

  // public api: string = '/api/v1';
  // public base: string = this.api + '/mes';

  constructor(httpApi: ApiService) {
    super(httpApi, '/mes')
  }



}
