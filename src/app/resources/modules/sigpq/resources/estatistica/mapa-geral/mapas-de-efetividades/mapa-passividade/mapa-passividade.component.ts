import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';

import { PatenteService } from '@core/services/Patente.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { Select2OptionData } from 'ng-select2';
import { FormBuilder } from '@angular/forms';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';

@Component({
  selector: 'app-mapa-passividade',
  templateUrl: './mapa-passividade.component.html',
  styleUrls: ['./mapa-passividade.component.css']
})
export class MapaPassividadeComponent implements OnInit {

  public simpleForm!: any
  public optionsSelectLanguage: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: false,
  }
  constructor(
    private apiEstatistica:EstatisticasService,
    private patenteService: PatenteService,
    private tipoFuncaoService: TipoFuncaoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private fb: FormBuilder,
    private situacaoEstadoService: SituacaoEstadoService,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,) { }
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

    options: any = {
      placeholder: "Selecione uma opção",
      width: '110%'
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
    public estado: Array<Select2OptionData> = []
    public estadoReformas: Array<Select2OptionData> = []
    orgaoSelecionado:any

    public orgaoOuComandoProvincial: Array<Select2OptionData> = [
      { id: '', text: "Selecione uma opção" },
      { id: 'Comando Provincial', text: "Comando Provincial" },
      { id: 'Orgão', text: "Orgão Central" },
    ]

  mes="JULHO";
  anoNew=new Date()
  ano=this.anoNew.getFullYear();
  efetividade:boolean=false;
  situacaoPassiva:boolean=false;
  nivelAcademico:boolean=false;
  passividades:any
  lastpage:number=1
  public situacaoEstados: Array<Select2OptionData> = [];
  ngOnInit(): void {
    this.loadMes()
    this.loadDados()

    this.buscarPatente();
    this.buscarTipoFuncao();
    this.buscarTipoHabilitacaoLiteraria();
    this.criarForm();
    this.buscarSituacaoEstados();
  }

  private buscarSituacaoEstados() {
    const options = {}

    this.situacaoEstadoService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.situacaoEstados = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }

  tituloSituacaoLaboral:string='Aguardando....'
  public selecionarSituacaoLaboralLaboral($event: any) {
    this.tituloSituacaoLaboral = ''

    if (!$event) {
      this.simpleForm.get('sigpq_estado_reforma_id')?.disable()
      this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null)
      return
    }

    const [situacao] = this.estado.filter((item: any) => item.id == $event)

    if (!situacao) return

    const options = {
      sigpq_estado_id: $event
    }

    this.estadosParaFuncionarioService.listarTodos(options).pipe(
      finalize((): void => {

        if (this.estadoReformas.length) {
          this.tituloSituacaoLaboral = situacao.text
          //if (!this.getInfo)
            this.simpleForm.get('sigpq_estado_reforma_id')?.enable()

          //this.simpleForm.get('sigpq_estado_reforma_id')?.setValidators(this.dataValidalitors)
          // this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null)
        } else {
          this.simpleForm.get('sigpq_estado_reforma_id')?.disable()
          this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null)
        }

      })
    ).subscribe({
      next: (response: any) => {
        this.estadoReformas = response.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }

  tituloSituacao:string='Aguardando....'
  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = ''

    if (!$event) {
      this.simpleForm.get('sigpq_estado_id')?.disable()
      this.simpleForm.get('sigpq_estado_id').setValue(null)
      this.selecionarSituacaoLaboralLaboral(null)
      return

    }
    const [situacao] = this.situacaoEstados.filter((item: any) => item.id == $event)
    if (!situacao) return

    if (!['efectividade'].includes(situacao.text.toString().toLocaleLowerCase())) {


        this.simpleForm.get('sigpq_estado_id')?.enable()
        this.simpleForm.get('sigpq_estado_id').setValue(null)
        this.selecionarSituacaoLaboralLaboral(null)


    } else {


        this.simpleForm.get('tipo_orgao')?.setValue(null)?.enable()
        this.simpleForm.get('tipo_orgao')?.enable()
        this.selecionarOrgaoOuComandoProvincial(null)
        // this.simpleForm.get('orgao_id')?.setValue(null)?.enable()
        this.simpleForm.get('sigpq_estado_id')?.disable()
        this.simpleForm.get('sigpq_estado_id').setValue(null)
        this.selecionarSituacaoLaboralLaboral(null)


    }

    const options = {
      sigpq_situacao_estado_id: $event
    }

    this.estadosParaFuncionarioService.listarTodos(options).pipe(
      finalize((): void => {
        if (this.estado?.length) {
          this.tituloSituacao = situacao.text
        }
      })
    ).subscribe({
      next: (response: any) => {
        this.estado = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }

  private criarForm() {

    const regexTelefone = /^9\d{8}$/;
    const regexTelefoneAlternativo = /^\d{8,15}$/;
    const regexNome = '^[A-Za-zÀ-ÖØ-öø-ÿ- ]*$';

    this.simpleForm = this.fb.group({
      sigpq_estado_id: [null],
      sigpq_estado_reforma_id: [null],
      sigpq_situacao_id: [null, []]
    })
  }

  loadMes()
  {
    const meses = ["janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"
    , "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    this.mes = meses[this.anoNew.getMonth()].toUpperCase();
  }

  loadDados()
  {
    this.apiEstatistica.listar_todos_mapa_passividade(this.filtro).pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.passividades=response[0].dados.data
      this.estatistica.page=response[0].dados.meta.current_page
      this.estatistica.perPage=response[0].dados.meta.per_page
      this.estatistica.total=response[0].dados.meta.total
      this.lastpage=response[0].dados.meta.last_page
    })
  }

  nextloadDados()
  {
    this.apiEstatistica.listar_todos_mapa_passividade(this.filtro).pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.passividades.push(...response[0].dados.data)
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

      console.log("Pagina atual:",this.filtro.page, " Lastpage:",this.lastpage)
  }




  togglesituacaoPassiva(){
    this.situacaoPassiva=!this.situacaoPassiva
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
     console.log(idOrgao," :Orgao selecionado: ",this.orgaoSelecionado)
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
