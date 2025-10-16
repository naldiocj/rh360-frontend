import { Component, Input, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { TratamentoPdfSolicitacaoService } from '@resources/modules/pa/core/service/tratamento-pdf-solicitacao.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-tratamento-pdf',
  templateUrl: './tratamento-pdf.component.html',
  styleUrls: ['./tratamento-pdf.component.css'],
})
export class TratamentoPdfComponent implements OnInit {
  @Input() pessoaId: any;
  @Input() funcionario: any;

  public totalBase: number = 0;
  public evento: any
  public fileUrl: any
  public conteudo: any;
  public podePrint: boolean = false;

  public pagination: Pagination = new Pagination();
  public tratamentos: any = [];
  public carregando: boolean = false;
  public solicitacao_id: number | undefined;
  public tratamento: any
  public optionsModel = {
    id: null,
    evento: null,
  };
  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  };
  constructor(
    private utilService: UtilService,
    private tratamentoPdfService: TratamentoPdfSolicitacaoService,
    private ficheiroService: FicheiroService,
    private secureService: SecureService
  ) {
    this.filtro.orgao = this.secureService.getTokenValueDecode().orgao.id
  }

  ngOnInit(): void {
    // this.buscarTratamentos();
  }

  private buscarTratamentos() {
    this.carregando = true;

    const options = { ...this.filtro, pessoaId: this.getPessoaId }
    this.tratamentoPdfService
      .listarTodos(options)
      .pipe(
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.tratamentos = response.data;




          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }
  public filtrarPagina(key: any, event: any) {
    if (key == 'page') {
      this.filtro.page == event;
    } else if (key == 'perPage') {
      this.filtro.perPage = event.target.value;
    } else if (key == 'search') {
      this.filtro.search = event;
    }
    this.buscarTratamentos();
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarTratamentos();
  }

  public get getPessoaId(): number {
    return this.pessoaId as number;
  }
  public getEstado(status: any): any {
    return this.utilService.estado(status);
  }

  public setId(id: number | undefined) {
    this.solicitacao_id = id;
  }

  public wipeId() {
    this.solicitacao_id = undefined;
  }

  public get getFuncionario(): any {
    return this.funcionario;
  }

  public previewFile(url: any, evento: any) {

    const opcoes: any = {
      pessoaId: this.getPessoaId,
      url: url
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

      })
    ).subscribe((file: any) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);

    });
    this.evento = evento
  }



  public gerarPDF(documento: any) {
    this.conteudo = documento;
    this.podePrint = true;

  }

  public setIdToDelete(id: any, evento: any) {
    this.optionsModel = {
      id: id,
      evento: evento
    }
  }

  public reset() {
    this.optionsModel.id = null
    this.optionsModel.evento = null;
  }

  public setTratamento(item: any) {
    console.log(this.getFuncionario)
    this.tratamento = item
  }

  public setNullTratamento() {
    this.tratamento = null
  }


}
