import { Component, OnInit } from '@angular/core';

import { Pagination } from '@shared/models/pagination';

import { finalize } from 'rxjs';
import { PessoaFisicaModel } from '@resources/modules/sigpq/shared/model/config/PessoaFisicaModel.model';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { Select2OptionData } from 'ng-select2';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';



@Component({
  selector: 'app-sigpq-listar-seccao',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public pessoaFisicas: any[] = [];
  public pessoaFisica: PessoaFisicaModel = new PessoaFisicaModel();
  public seccao: any = null
  public totalBase: number = 0
  public seccoes: any[] = [];

  public pagination = new Pagination();
  public carregando: boolean = false;

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
    departamentoId: 'null'
  }
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = []
  public departamentos: Array<Select2OptionData> = []
  public entidades: Array<Select2OptionData> = [
    {
      id: 'null',
      text: "Todos"
    },
    {
      id: 'Esquadra',
      text: "Esquadra"
    },
    {
      id: 'Subunidade',
      text: "Subunidade"
    },
    {
      id: 'Secção',
      text: "Secção"
    },
  ]

  constructor(
    private departamentoService: DepartamentoService,
    private seccaoService: SeccaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
  ) { }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
    this.buscarSeccoes()
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
  buscarSeccoes() {
    const options = { ...this.filtro };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.pessoaFisicas = response.data;

      console.log("Secções encontradas:",response)
      this.pagination = this.pagination.deserialize(response.meta);
      console.log("PAGNINAÇAÕ:",this.pagination)
    });
  }

  buscarDepartamentos(filtro: any = null) {
    if (!filtro) return
    console.log(filtro)
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
    this.buscarSeccoes()
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
    }
    else if (key == 'entidade') {
      this.filtro.entidade = $e;

    } else if (key == 'tipoOrgao') {
      this.filtro.tipoOrgao = $e
      this.selecionarOrgaoOuComandoProvincial($e)
    }

    else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarSeccoes()
  }

  changePage(event: any, e: any) {

   }


  setItem(item: any) {
    this.seccao = item

  }
}
