import { Component, OnInit } from '@angular/core';

import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';

import { Pagination } from '@shared/models/pagination';

import { finalize } from 'rxjs';
import { PessoaFisicaModel } from '@resources/modules/sigpq/shared/model/config/PessoaFisicaModel.model';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { SecureService } from '@core/authentication/secure.service';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-sigpq-listar-departamento',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public pessoaFisicas: any[] = [];
  public pessoaFisica: PessoaFisicaModel = new PessoaFisicaModel();

  public pagination = new Pagination();
  public carregando: boolean = false;
  public departamento: any = null

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    entidade: 'null',
    pessoajuridica_id: null,
    estado: 'null',
    tipoOrgao: null
  }

  estados: Array<Select2OptionData> = [{

    id: 'null',
    text: 'Todos'
  },
  {

    id: '1',
    text: 'Inactivo'
  },
  {
    id: '2',
    text: 'Activo'
  }

  ]
  entidades: Array<Select2OptionData> = [
    {
      id: 'null',
      text: "Todos"
    },
    {
      id: 'Comando Municipal',
      text: "Comando Municipal"
    },
    {
      id: 'Departamento',
      text: "Departamento"
    },
    {
      id: 'Unidade',
      text: "Unidade"
    },
  ]

  public direcaoOuOrgao: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  constructor(private departamentoService: DepartamentoService, private estruturaOrganicaServico: TipoEstruturaOrganica, private direcaoOuOrgaoService: DirecaoOuOrgaoService, private sec: SecureService,) { }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
    this.buscarDepartamentos()

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

  private buscarDepartamentos() {
    const options = { ...this.filtro };
    this.departamentoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {

      this.pessoaFisicas = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }


  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.perPage = 5
    this.filtro.entidade = 'null'
    this.filtro.pessoajuridica_id = null
    this.filtro.estado = 'null'
    this.filtro.tipoOrgao = null,

      this.buscarDepartamentos()
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'entidade') {
      this.filtro.entidade = $e;
    } else if (key == 'orgaoId') {
      this.filtro.pessoajuridica_id = $e;
    } else if (key == 'estado') {
      this.filtro.estado = $e;
    } else if (key == 'tipoOrgao') {
      this.filtro.tipoOrgao = $e
      this.selecionarOrgaoOuComandoProvincial($e)
    }

    this.buscarDepartamentos()
  }

  changePage(event: any, e: any) { }

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
        const direccoes = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.direcaoOuOrgao.push(...direccoes)
      })
  }

  setItem(item: any) {
    this.departamento = item;
  }
}