import { Component, Input, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-sigpj-processo-detalhes-dados-parecer',
  templateUrl: './dados-parecer.component.html',
  styleUrls: ['./dados-parecer.component.css']
})
export class DadosParecerComponent implements OnInit {

  @Input() disciplinarId: any = null

  pecasParecer: any = []
  dadosParecer: any = null
  fileUrl: any = null
  carregarDocumento: boolean = false

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
    disciplinar_id: 0
  };

  public isLoading: boolean = false;
  public pagination = new Pagination();
  totalBase: number = 0;

  constructor(
    private ficheiroService: FicheiroService,
    private parecerDisciplinarService: ParecerDisciplinarService
  ) { }

  ngOnInit(): void {
    this.buscarParecerDisciplinar()
    this.buscarParecerDisciplinarPecas()
  }

  public get getId() {
    return this.disciplinarId as number;
  }

  buscarParecerDisciplinar() {
    this.isLoading = true;
    this.parecerDisciplinarService
      .listarUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.dadosParecer = response
      })
  }

  buscarParecerDisciplinarPecas() {

    const options = {
      ...this.filtro,
      disciplinar_id: this.getId
    }

    this.isLoading = true
    this.parecerDisciplinarService
      .listarPecas(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.pecasParecer = response.data
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  filtrar(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarParecerDisciplinar();
  }

  recarregar() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarParecerDisciplinar();
    this.buscarParecerDisciplinarPecas();
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
    //this.ficheiroService.downloadUsingUrl(url, `Processo-disciplinar-parecer-${this.getId}`) // Define o nome do arquivo
    return true;
  }

}
