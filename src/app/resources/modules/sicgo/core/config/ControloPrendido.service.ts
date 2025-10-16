import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";



@Injectable
  ({
    providedIn: 'root'
  })
export class ControloPrendidoService extends BaseService {

  constructor(public http: ApiService) {
    super(http, '/sicgo/config/controlo-prendidos');
  }
}
