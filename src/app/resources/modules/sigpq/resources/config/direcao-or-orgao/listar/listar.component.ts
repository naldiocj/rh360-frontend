import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';

import { Pagination } from '@shared/models/pagination';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-sigpq-listar-direcao-ou-orgao',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public pessoaFisicas: any[] = [];
  // public pessoaFisica: PessoaFisicaModel = new PessoaFisicaModel();
  public direcao: any = null

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
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
    tipoOrgao: 'null'
  }

  constructor(private direcaoOuOrgaoService: DirecaoOuOrgaoService, private estruturaOrganicaServico: TipoEstruturaOrganica) { }

  ngOnInit(): void {
    this.buscarDirecaoOrgao()
    this.buscarTipoEstruturaOrganica()
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

  buscarDirecaoOrgao(op: any = null) {
    const options = { ...this.filtro, ...op };
    this.direcaoOuOrgaoService.listarTodos(options).pipe(
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
    this.filtro.tipoOrgao = 'null'
    this.buscarDirecaoOrgao()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarDirecaoOrgao()
  }

  changePage(event: any, e: any) { }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return
    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.buscarDirecaoOrgao(opcoes)
  }

  setItem(item: any) {
    this.direcao = item

  }
}
