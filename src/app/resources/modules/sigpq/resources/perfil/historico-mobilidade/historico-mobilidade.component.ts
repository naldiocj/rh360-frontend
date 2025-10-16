import { Component, Input, OnInit } from '@angular/core';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-historico-mobilidade',
  templateUrl: './historico-mobilidade.component.html',
  styleUrls: ['./historico-mobilidade.component.css']
})
export class HistoricoMobilidadeComponent implements OnInit {

  totalBase: number = 0
  public pagination = new Pagination()
  @Input() pessoaId: any = 5
  public mobilidades: any
  public fileUrl: any
  public documento: any
  public carregarDocumento: boolean = false;

  public emTempo: any


  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private mobilidadeService: MobilidadeService,
    private formataData: FormatarDataHelper,
    private ficheiroService: FicheiroService
  ) { }

  ngOnInit(): void {
    this.buscarMobilidade()
  }


  buscarMobilidade() {

    const options = {
      ...this.filtro,
      pessoafisica_id: this.getPessoaId
    }
    this.mobilidadeService

      .listarPorPessoa(options)
      .subscribe((response) => {

        this.mobilidades = response.data;

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
    this.buscarMobilidade()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarMobilidade()
  }

  public get getPessoaId() {
    return this.pessoaId as number
  }

  public getDataExtensao(data: any) {
    return this.formataData?.dataExtensao(data, true)
  }

  public eData(data: any): boolean {
    return data == null ? false : data != '0000-00-00' ? true : false
  }

  public construcao() {

  }

  visualizar(documento: any) {


    const opcoes = {
      pessoaId: documento.pessoa_id,
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

  public formatarGuia(guia: any) {
    return guia?.toString().trim()
  }


}
