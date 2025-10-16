import { Component, Input, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpj-processo-detalhes-dados-decisao',
  templateUrl: './dados-decisao.component.html',
  styleUrls: ['./dados-decisao.component.css']
})
export class DadosDecisaoComponent implements OnInit {

  @Input() disciplinarId: any = null

  pecasDecisao:any[] = []

  disciplinarTotal: any = 8
  reclamacaoTipo: any = 8
  fileUrl: any = null
  carregarDocumento: boolean = false

  public decisao?: any

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
    disciplinar_id: 0
  };

  public isLoading: boolean = false;
  public pagination = new Pagination();
  public totalBase: number = 0;

  constructor(
    private ficheiroService: FicheiroService,
    private decisaoDisciplinarService: DecisaoDisciplinarService
  ) { }

  ngOnInit(): void {
    this.buscarDecisao()
    this.buscarDecisaoDisciplinarPecas()
  }

  public get getId() {
    return this.disciplinarId as number;
  }

  buscarDecisao() {
    this.isLoading = true;
    this.decisaoDisciplinarService
      .listarUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.decisao = response;
      });
  }

  buscarDecisaoDisciplinarPecas(){

    const options = {
      ...this.filtro,
      disciplinar_id: this.getId
    }

    this.isLoading = true
    this.decisaoDisciplinarService
      .listarPecas(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.pecasDecisao = response.data
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  registar() {

    if (this.isLoading) {
      return
    }

    const input = {
      disciplinar_id: this.getId
    }

    this.isLoading = true;
    this.decisaoDisciplinarService
      .registar(input)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
      });
  }

  filtrar(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarDecisaoDisciplinarPecas();
  }

  recarregar() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarDecisaoDisciplinarPecas();
  }

  visualizar(documento: any) {

    const opcoes = {
      url: documento.anexo
    }

    this.fileUrl = null

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

  baixar(documento: any) {
    const url = documento.anexo; // Verifica o campo correto da URL
    if (!url) {
      return false; // Se não há URL, retorna falso
    }
    // Usa o serviço para baixar o arquivo
    this.ficheiroService.downloadUsingUrl(url, `Processo-disciplinar-decisao-${this.getId}`) // Define o nome do arquivo
    return true;
  }
}
