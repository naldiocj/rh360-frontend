import { Component, Input, OnInit } from '@angular/core';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ModalService } from '@core/services/config/Modal.service';
import { CargosService } from '@resources/modules/sigpq/core/service/Cargos.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-historico-cargo',
  templateUrl: './historico-cargo.component.html',
  styleUrls: ['./historico-cargo.component.css']
})
export class HistoricoCargoComponent implements OnInit {

  public totalBase: number = 0
  @Input() public pessoaId: any = 5
  public pagination = new Pagination()
  public cargos: Array<any> = []
  public funcao: any
  public id: any
  public fileUrl: any
  public documento: any
  public carregarDocumento: boolean = false;


  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private cargoService: CargosService,
    private formatarData: FormatarDataHelper,
    private modalService: ModalService,
    private ficheiroService: FicheiroService,
    public formatarDataHelper: FormatarDataHelper,
  ) { }

  ngOnInit(): void {
    this.buscarCargos()
  }

  buscarCargos() {
    const opcao = {
      ...this.filtro,
      pessoafisicaId: this.getPessoaId
    }
    this.cargoService
      .listarTodos(opcao)
      .subscribe((response) => {


        this.cargos = response.data;

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCargos()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarCargos()
    this.setNullFuncao()
    this.id = null
  }

  public get getPessoaId() {
    return this.pessoaId as number
  }

  public setFuncao(item: any) {
    this.funcao = item;

    console.log(item)
  }

  private setNullFuncao() {
    this.funcao = null;


  }

  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


  public eData(data: any): boolean {
    return data != '0000-00-00' ? true : false
  }


  public setId(id: any) {
    this.id = id;
  }

  visualizar(documento: any) {


    const opcoes = {
      pessoaId: this.getPessoaId,
      url: ''
    }

    this.fileUrl = null


    opcoes.url = documento.anexo || null

    this.documento = documento


    if (!opcoes.url) return false

    this.carregarDocumento = true
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }

  public construcao(): void {
    alert('Em contrução')
  }
  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }
}
