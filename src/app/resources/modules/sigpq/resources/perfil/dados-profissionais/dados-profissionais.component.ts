import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UtilsHelper } from '@core/helper/utilsHelper';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { finalize, Subject, takeUntil } from 'rxjs';

import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';


@Component({
  selector: 'app-sigpq-dados-profissionais',
  templateUrl: './dados-profissionais.component.html',
  styleUrls: ['./dados-profissionais.component.css']
})
export class DadosProfissionaisComponent implements OnInit, OnDestroy {

  @Input() pessoaId: any = 5
  public dadosProfissionais: any
  private destroy$ = new Subject<void>()

  
  
  constructor(
    private tipoFuncaoService: TipoFuncaoService,
    private funcionarioServico: FuncionarioService,
    public readonly utilsHelper: UtilsHelper
  ) { }

  ngOnInit(): void {
    this.buscar()
  }

  buscar() {
    this.funcionarioServico
      .buscarUm(this.getId).pipe(
        finalize((): void => {
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.dadosProfissionais = response

      })
  }

  // public buscarFuncao(arg: any): void {
  //   let funcoes: any = [];
  //   const opcoes = { tipo_cargo_id: arg };  

  //   this.tipoFuncaoService
  //     .listarUm(opcoes)
  //     .pipe(finalize((): void => {}))
  //     .subscribe((response: any): void => {
  //       funcoes = response.map((item: any) => ({
  //         id: item.id,
  //         text: item.nome,
  //       }));
  //     });

  //     return 
  // }

  get buscarOrgaoDoAgente() {
    return this.dadosProfissionais?.sigpq_funcionario_orgao
  }

  get buscarDepartamentoAgente() {
    return this.dadosProfissionais?.sigpq_funcionario_departamento
  }
  get buscarPostoAgente() {
    return this.dadosProfissionais?.sigpq_funcionario_posto
  }

  get buscarSeccaoAgente() {
    return this.dadosProfissionais?.sigpq_funcionario_seccao
  }


  public get getId() {
    return this.pessoaId as number
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
