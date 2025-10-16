import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';

import { PatenteService } from '@core/services/Patente.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { Select2OptionData } from 'ng-select2';
@Component({
  selector: 'app-mapa-da-efetividade',
  templateUrl: './mapa-da-efetividade.component.html',
  styleUrls: ['./mapa-da-efetividade.component.css']
})
export class MapaDaEfetividadeComponent implements OnInit {

  constructor(
    private apiEstatistica:EstatisticasService,
    private patenteService: PatenteService,
    private tipoFuncaoService: TipoFuncaoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,
    ) { }
  filtro = {
    page: 1,
    perPage: 10,
    mes: null,
    patente:null,
    orgao:null,
    habilitacaoliteraria:null,
    funcao:null
  }

  estatistica={
    page:1,
    perPage:10,
    total:500
  }
  mes:string='';
  anoNew=new Date()
  ano=this.anoNew.getFullYear();
  options: any = {
    placeholder: "Selecione uma opção",
    width: '95%'
  }
  optionsOrgao: any = {
    placeholder: "Selecione Tipo de Orgão",
    width: '95%'
  }

  patenteEspecial: Array<Select2OptionData> = []
  patenteCivil: Array<Select2OptionData> = []
  tipoCargos: Array<Select2OptionData> = []
  tipoFuncaos: Array<Select2OptionData> = []
  direcaoOuOrgao: Array<Select2OptionData> = []
  tipoHabilitacaoLiterarias: Array<Select2OptionData> = []
  orgaoSelecionado:any

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: "Selecione uma opção" },
    { id: 'Comando Provincial', text: "Comando Provincial" },
    { id: 'Orgão', text: "Orgão Central" },
  ]


  efetividade:boolean=false;
  efetividades:any
  lastpage:number=1
  ngOnInit(): void {
    this.loadMes()
    this.loadDados()

    this.buscarPatente();
    this.buscarTipoFuncao();
    this.buscarTipoHabilitacaoLiteraria();

  }

  loadMes()
  {
    const meses = ["janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"
    , "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    this.mes = meses[this.anoNew.getMonth()].toUpperCase();
  }

  loadDados()
  {
    this.apiEstatistica.listar_todos_mapa_efetividade_mensal(this.filtro).pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.efetividades=response[0].dados.data
      this.estatistica.page=response[0].dados.meta.current_page
      this.estatistica.perPage=response[0].dados.meta.per_page
      this.estatistica.total=response[0].dados.meta.total
      this.lastpage=response[0].dados.meta.last_page
      //console.log("Efetividade:",this.efetividades)
    })
  }

  nextloadDados()
  {
    this.apiEstatistica.listar_todos_mapa_efetividade_mensal(this.filtro).pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.efetividades.push(...response[0].dados.data)
      this.estatistica.page=response[0].dados.meta.current_page
      this.estatistica.perPage=response[0].dados.meta.per_page
      this.estatistica.total=response[0].dados.meta.total
      this.lastpage=response[0].dados.meta.last_page
    })
  }

  nextData()
  {

    if(this.filtro.page==this.lastpage){}
    else{
      this.filtro.page=this.filtro.page+1;
      this.nextloadDados()
      }
  }


  toggleefetividade(){
    this.efetividade=!this.efetividade
  }

  searchByOrgao(value:any)
  {
    if(value)
    {
      if(value=='-1')this.filtro.orgao=null;
      else {this.buscarOrgaoSelecionado(value); this.filtro.orgao=value;}
      this.searchDados()
    }

  }



  searchBypatente(value:any)
  {
    if(value)
    {
      if(value=='-1')this.filtro.patente=null;
      else this.filtro.patente=value;
      this.searchDados()
    }
  }

  searchByFuncao(value:any)
  {
    if(value)
    {
      if(value=='-1')this.filtro.funcao=null;
      else this.filtro.funcao=value;
      this.searchDados()
    }
  }

  searchByHabilitacao(value:any)
  {
    if(value)
    {
      if(value=='-1')this.filtro.habilitacaoliteraria=null;
      else this.filtro.habilitacaoliteraria=value;
      this.searchDados()
    }

  }

  searchDados()
  {
    this.filtro.page=1;
    this.loadDados();
    this.efetividade=true;
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

  buscarOrgaoSelecionado(idOrgao:string)
  {
     this.orgaoSelecionado=this.direcaoOuOrgao.filter(element=>{return element.id==idOrgao})
     //console.log(idOrgao," :Orgao selecionado: ",this.orgaoSelecionado)
  }

  buscarTipoFuncao(): void {
    const opcoes = {}
    this.tipoFuncaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        let result:any[]=[{ id: '-1', text:  'TODAS FUNÇÕES' }]
        result.push(...response.map((item: any) => ({ id: item.id, text: item.nome })))
        this.tipoFuncaos = result
      })

  }

  buscarPatente(): void {
    const opcoes = {}
    this.patenteService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        let result:any[]=[{ id: '-1', text:  'TODAS PATENTES' }]
        result.push(...
          response
        .filter((item: any) => ![18, 19].includes(item.id))
        .map((item: any) => ({ id: item.id, text: item.nome })))
        this.patenteEspecial = result
        /*this.patenteCivil = response
          .filter((item: any) => [17].includes(item.id))
          .map((item: any) => ({ id: item.id, text: item.nome }))*/
      })

  }

  buscarTipoHabilitacaoLiteraria(): void {
    const opcoes = {}
    this.tipoHabilitacaoLiterariaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        let result:any[]=[{ id: '-1', text:  'TODAS HABILITAÇÕES' }]
        result.push(...response.map((item: any) => ({ id: item.id, text: item.nome })))
        this.tipoHabilitacaoLiterarias = result
      })

  }
}

