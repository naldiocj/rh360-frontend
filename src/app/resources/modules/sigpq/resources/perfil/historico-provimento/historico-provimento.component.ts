import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Pagination } from '@shared/models/pagination';
import { ProvimentoModel } from '@resources/modules/sigpq/shared/model/provimento.model';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';

@Component({
  selector: 'app-sigpq-historico-provimento',
  templateUrl: './historico-provimento.component.html',
  styleUrls: ['./historico-provimento.component.css'],
})
export class HistoricoProvimentoComponent implements OnInit {
  totalBase: number = 0;
  @Input() pessoaId: any = 5;
  public pagination = new Pagination();
  provimentos: Array<ProvimentoModel> = [];
  public fileUrl: any;
  public documento: any;
  public numero_: any | null = null;
  public carregarDocumento: boolean = false;

  public emTempo: any;

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  constructor(
    private provimentoService: ProvimentoService,
    private propostaProvimentoService: PropostaProvimentoService,
    private formataData: FormatarDataHelper,
    private ficheiroService: FicheiroService
  ) {}

  ngOnInit(): void {
    this.buscarProvimento();
  }

  buscarProvimento() {
    const options = {
      ...this.filtro,
      pessoa_id: this.getPessoaId,
    };
    this.provimentoService.listarTodos(options).subscribe((response) => {
      this.provimentos = response.data;

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });

    this.provimentoService
      .listarPorPessoa(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.emTempo = response;
        },
      });
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarProvimento();
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarProvimento();
  }

  public get getPessoaId() {
    return this.pessoaId as number;
  }

  public getDataExtensao(data: any) {
    return this.formataData?.dataExtensao(data, true);
  }

  public eData(data: any): boolean {
    return data == null ? false : data != '0000-00-00' ? true : false;
  }

  public construcao() {}

  visualizar(documento: any) {
    // console.log(documento)

    // this.numero_ = documento;

    const opcoes = {
      pessoaId: documento.pessoa_id,
      url: '',
    };

    this.fileUrl = null;

    opcoes.url = documento.anexo || null;

    this.documento = documento;

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.carregarDocumento = false;
        })
      )
      .subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });

    return true;
  }

  public setVisualizarOrdem(item: any) {

    console.log(item)
    if (!item?.ordem_descricao || !item?.pessoa_id) return;

    const options = { pessoaId: item?.pessoa_id, numero: item.ordem_descricao };
    this.provimentoService
      .listar_promocao_emTempo(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
          console.log(this.numero_);
        })
      )
      .subscribe((response: any) => {
        this.numero_ = response[0];
      });
  }
}
