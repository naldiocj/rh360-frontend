import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TratamentoPdfSolicitacaoService extends BaseService {


  constructor(httpApi: ApiService) {
    super(httpApi, '/pa/tratamento-solicitacao')
  }


}
