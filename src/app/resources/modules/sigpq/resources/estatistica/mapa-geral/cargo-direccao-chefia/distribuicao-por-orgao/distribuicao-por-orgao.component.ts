import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';

import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-distribuicao-por-orgao',
  templateUrl: './distribuicao-por-orgao.component.html',
  styleUrls: ['./distribuicao-por-orgao.component.css']
})
export class DistribuicaoPorOrgaoComponent implements OnInit {

  constructor(
    private apiEstatistica:EstatisticasService,
    private tipoFuncaoService: TipoFuncaoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    ) { }
  defaluValue:boolean=false;
  distribuicaoOrgao:boolean=this.defaluValue;
  distribuicaoOrgaos:any;

  options: any = {
    placeholder: "Selecione uma opção",
    width: '95%'
  }
  optionsOrgao: any = {
    placeholder: "Selecione Tipo de Orgão",
    width: '95%'
  }

  filtro = {
    page: 1,
    perPage: 10,
    orgao:null,
  }

  tipoCargos: Array<Select2OptionData> = []
  direcaoOuOrgao: Array<Select2OptionData> = []
  orgaoSelecionado:any

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: "Selecione uma opção" },
    { id: 'Comando Provincial', text: "Comando Provincial" },
    { id: 'Orgão', text: "Orgão Central" },
  ]


  ngOnInit(): void {
    this.loadDados()
  }

  loadDados()
  {
    this.apiEstatistica.listar_todos_por_orgao(this.filtro).pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados por órgão:",response)
      this.distribuicaoOrgaos=response[0].orgaos
    })
  }


  toggledistribuicaoOrgao(){
    this.distribuicaoOrgao=!this.distribuicaoOrgao
  }

  searchByOrgao(value:any)
  {
    if(value)
    {
      if(value=='-1')this.filtro.orgao=null;
      else { this.filtro.orgao=value;}
      this.searchDados()
    }

  }

  searchDados()
  {
    this.filtro.page=1;
    this.loadDados();
    console.log("Filtros:",this.filtro)
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    const opcoes = {
      tipo_orgao: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        let result:any[]=[{ id: '-1', text:  'TODOS ORGÃOS' }]
        result.push(...response.map((item: any) => ({ id: item.id, text:  item.sigla+' - '+item.nome_completo })))
        this.direcaoOuOrgao =result
      })


  }


}
