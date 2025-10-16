import { Component, OnInit } from '@angular/core';
import { AgenteService } from '../../../core/service/agente.service';
import { FuncionarioService } from '../../../../../../core/services/Funcionario.service';
import { UtilsHelper } from '../../../../sigdoc/core/Utils.helper';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-licencas',
  templateUrl: './licencas.component.html',
  styleUrls: ['./licencas.component.css']
})
export class LicencasComponent implements OnInit {

  agenteSelecionado:any
  informacao = 'planificar';
  local = 'licenca';
  constructor( private agenteService: AgenteService,
    private funcionarioService: FuncionarioService,
    public utilsHelper: UtilsHelper) { }

  ngOnInit() {
    this.buscarFuncionario()
  }

  private get getPessoaId() {
    return this.agenteService?.id
  }

  public buscarFuncionario() {
    this.funcionarioService.buscarUm(this.getPessoaId).pipe(
      finalize((): void => {
      }),
    ).subscribe({
      next: (response: any) => {
        this.agenteSelecionado = response
      }
    })
  }
}
