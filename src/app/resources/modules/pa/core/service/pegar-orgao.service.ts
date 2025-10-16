import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { AuthService } from '../../../../../core/authentication/auth.service';
import { AgenteService } from './agente.service';
import { MeuOrgaoService } from './meu-orgao.service';

@Injectable({
  providedIn: 'root',
})
export class PergarOrgaoService {
  private orgao!: any;
  constructor(
    private agenteService: AgenteService,
    private meuOrgao: MeuOrgaoService
  ) {}

  public pegar(): any {
    return this.meuOrgao
      .listarUm(this.agenteService.id)
      .subscribe((response:any)=>{

      });
  }
}
