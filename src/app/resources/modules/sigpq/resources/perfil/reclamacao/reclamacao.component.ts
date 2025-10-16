import { Component, Input, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteReclamationService } from '@resources/modules/pa/core/service/agente-reclamation.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-reclamacao',
  templateUrl: './reclamacao.component.html',
  styleUrls: ['./reclamacao.component.css']
})
export class ReclamacaoComponent implements OnInit {

  @Input() pessoaId: any
  totalBase: number = 0

  @Input() funcionario: any


  public pagination: Pagination = new Pagination()
  public reclamacoes: any = []
  public carregando: boolean = false;
  public reclamacao_id: number | undefined
  public fileUrl: any

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy: ["pa.texto", "documento", "nome_arquivo",]
  };
  constructor(private reclamacaosService: AgenteReclamationService, private utilService: UtilService, private ficheiroService: FicheiroService) { }



  ngOnInit(): void {
    // this.buscarReclamacoes()
  }

  private buscarReclamacoes() {
    this.carregando = true;
    this.reclamacaosService.listar(this.getPessoaId, this.filtro).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.reclamacoes = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })


  }
  public filtrarPagina(key: any, event: any) {
    if (key == 'page') {
      this.filtro.page == event
    } else if (key == "perPage") {
      this.filtro.perPage = event.target.value
    } else if (key == "search") {
      this.filtro.search = event
    }
    this.buscarReclamacoes()
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarReclamacoes()
  }

  public get getPessoaId(): number {
    return this.pessoaId as number
  }
  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }


  public get getFuncionario(): any {
    return this.funcionario;
  }
  public verArquivo(id: any, url: any) {
    this.reclamacao_id = id
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
  }



}
