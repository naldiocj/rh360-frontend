import { Component, OnChanges, OnInit } from '@angular/core';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { PessoaFisicaModel } from '@resources/modules/sigpq/shared/model/config/PessoaFisicaModel.model';
import { Pagination } from '@shared/models/pagination';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public pessoaFisicas: any[] = [];
  public pessoaFisica: PessoaFisicaModel = new PessoaFisicaModel();
  public seccao: any = null
  public seccoes: any[] = [];
  public pagination = new Pagination();
  public carregando: boolean = false;
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = []
  public departamentos: Array<Select2OptionData> = []

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    entidade: 'null',
    orgaoId: null,
    tipoOrgao: null,
    departamentoId: 'null',
    seccaoId: 'null'
  }
  // public entidades: Array<Select2OptionData> = [
  //   {
  //     id: 'null',
  //     text: "Todos"
  //   },
  //   {
  //     id: 'Posto Policial',
  //     text: "Posto Policial"
  //   },
  //   {
  //     id: 'Secção',
  //     text: "Secção"
  //   },
  // ]

  constructor(
    private departamentoService: DepartamentoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private unidadeService: UnidadeService,
    private seccaoService: SeccaoService
  ) { }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
    this.buscarPostoPolicial()
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    if (!$event) return

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = []
        this.direcaoOuOrgao.push({
          id: 'null',
          text: 'Todos'
        })

        const direcoes = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.direcaoOuOrgao.push(...direcoes)
      })
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = []
        this.tipoEstruturaOrganicas.push({
          id: 'null',
          text: 'Todos'
        })
        const tipos = response.map((item: any) => ({ id: item.sigla, text: item.name }))
        this.tipoEstruturaOrganicas.push(...tipos)
      })
  }
  buscarPostoPolicial() {
    const options = { ...this.filtro };
    this.unidadeService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.pessoaFisicas = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  buscarDepartamentos(filtro: any = null) {
    if (!filtro) return
    const options = {
      pessoajuridica_id: filtro

    };
    this.departamentoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.departamentos = []
      this.departamentos.push({
        id: 'null',
        text: 'Todos'
      })
      const depats = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      this.departamentos.push(...depats)
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.entidade = 'null'
    this.filtro.orgaoId = null
    this.filtro.tipoOrgao = null
    this.filtro.departamentoId = 'null'
    this.filtro.perPage = 5
    this.buscarPostoPolicial()
  }

  buscarSeccoes($e: any) {
    if (!$e) return


    const options = { departamentoId: $e };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {

      this.seccoes = []
      this.seccoes.push({
        id: 'null',
        text: 'Todos'
      })
      const depats = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      this.seccoes.push(...depats)

    });
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
      this.buscarDepartamentos($e)
    }
    else if (key == 'departamentoId') {
      this.filtro.departamentoId = $e;
      this.buscarSeccoes($e)

    }
    else if (key == 'tipoOrgao') {

      this.filtro.tipoOrgao = $e
      this.selecionarOrgaoOuComandoProvincial($e)
    }
    else if (key == 'seccaoId') {
      this.filtro.seccaoId = $e;
    }
    else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarPostoPolicial()
  }

  changePage(event: any, e: any) { }


  setItem(item: any) {
    this.seccao = item

  }

}
