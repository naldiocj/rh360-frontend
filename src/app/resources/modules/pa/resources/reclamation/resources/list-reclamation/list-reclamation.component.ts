import { Component, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteReclamationService } from '@resources/modules/pa/core/service/agente-reclamation.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { Reclamation } from '@resources/modules/pa/shared/models/reclamation.model';
import { Pagination } from '@shared/models/pagination';
import { debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-list-reclamation',
  templateUrl: './list-reclamation.component.html',
  styleUrls: ['./list-reclamation.component.css'],
})
export class ListReclamationComponent implements OnInit {
  isLoading: boolean = false;
  reclamacoes: any = [];
  totalBase: number = 0;

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy: ["pa.texto","documento","nome_arquivo",]
  };

  public deleteById:null | string = ''
  public text:string | null = ''

  public pagination = new Pagination();
  public without: boolean = true;
  public fileUrl:any
  showSearch() {
    document.querySelector('.search-bar')?.classList.toggle('search-bar-show');
  }
  constructor(
    private reclmationService: AgenteReclamationService,
    private agenteService: AgenteService,
    private utilService:UtilService,
    private modalService:ModalService,
    private ficheiroService:FicheiroService
  ) {}

  ngOnInit(): void {
    this.buscarReclamacoes();
  }

  public buscarReclamacoes() {
    this.reclmationService
      .listar(this.getPessoaId, this.filtro)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        this.reclamacoes = response.data




        this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public capitalize(str: string) {
    return str!=null ? str[0]?.toUpperCase() + str?.substr(1): ' ';
  }

  filtrarPagina(key: string, $e: any) {
    console.log($e)
    if (key === 'page') {
      this.filtro.page = $e;
    } else if (key === 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key === 'search') {
      this.filtro.search = $e;
    }

    this.buscarReclamacoes();
  }

  public get getPessoaId() {
    return this.agenteService.id as number;
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarReclamacoes();
  }

  public get temReclamacoes(): boolean {
    return this.reclamacoes.length > 0 ? true : false;
  }

  public get temMaisReclamacoes(): boolean {
    return this.reclamacoes.length > 5 ? true : false;
  }

  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }

  public setRemoveID(id:any){
   this.deleteById = id;
  }

  public cancelarReclamacao(id:any){
    this.reclmationService.delete(this.getPessoaId, id).pipe().subscribe({next:(res:any)=>{
      this.buscarReclamacoes()
      this.modalService.fechar('close-modal')
    }})
  }

  public verArquivo(url:any, texto:any){

    this.text = texto
    const opcoes:any={
      pessoaId: this.getPessoaId,
      url: url
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

      })
      ).subscribe((file:any) => {
        console.log(url)
        this.fileUrl = this.ficheiroService.createImageBlob(file);

      });
    }
    public download(url:any, name:any){

      const opcoes:any={
        pessoaId: this.getPessoaId,
        url: url
      }
      this.ficheiroService.getFile(opcoes).pipe(
        finalize(() => {

        })
        ).subscribe((file) => {
         this.ficheiroService.download(file, name)
        });
      }


}
