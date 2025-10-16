import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { AssinaturaDigitalService } from '@resources/modules/sigpq/core/service/Assinatura-Digital.service';
import { Pagination } from '@shared/models/pagination';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {


  public pagination = new Pagination();
  public carregando: boolean = false;
  public assinaturaDigitals: any
  public assinatura: any = null
  public id: any = null

  public isLoading: boolean = false

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


  public direcaoOuOrgao: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  constructor(private assinaturaDigitalsService: AssinaturaDigitalService, private estruturaOrganicaServico: TipoEstruturaOrganica, private direcaoOuOrgaoService: DirecaoOuOrgaoService, private sec: SecureService) { }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
    this.buscarAssinaturaDigitals()


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

  private buscarAssinaturaDigitals() {
    const options = { ...this.filtro };
    this.assinaturaDigitalsService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.assinaturaDigitals = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }


  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.perPage = 5
    this.filtro.entidade = 'null'
    this.filtro.pessoajuridica_id = null
    this.filtro.tipoOrgao = null


    this.buscarAssinaturaDigitals()

    this.setNullValores()
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
    }

    this.buscarAssinaturaDigitals()
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

  public setAssinatura(item: any) {
    this.assinatura = item;
  }
  public setId(id: any) {
    this.id = id
  }

  private setNullValores() {
    this.id = null;
    this.assinatura = null
  }


}
