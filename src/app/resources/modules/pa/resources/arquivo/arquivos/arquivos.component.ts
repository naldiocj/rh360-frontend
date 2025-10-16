import { Component, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteArquivoService } from '@resources/modules/pa/core/service/agente-arquivo.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-arquivos',
  templateUrl: './arquivos.component.html',
  styleUrls: ['./arquivos.component.css'],
})
export class ArquivosComponent implements OnInit {
  public without: boolean = true;

  totalBase: number = 0;
  public pagination = new Pagination();
  arquivos: any = [];
  public deleteById:any | string
  public fileUrl:any

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy: ['pa.descricao','arquivo', 'pa.tipo']
  };
  constructor(
    private agenteArquivo: AgenteArquivoService,
    private agenteService: AgenteService,
    private modalService:ModalService,
    private utilService: UtilService,
    private ficheiroService:FicheiroService
  ) {}

  ngOnInit(): void {
    this.buscarArquivo();
  }

  buscarArquivo() {
    this.agenteArquivo
      .listar(this.getPessoaId, this.filtro)
      .subscribe((response: any) => {
        this.arquivos = response.data;


        // this.totalBase =  response.meta.current_page ?
        // response.meta.current_page=== 1 ? 1
        // : (response.meta.current_page - 1) * response.meta_per_page + 1
        // : this.totalBase;
        // this.pagination =  this.pagination.deserialize(response.meta)
      });
  }

  filtrarPagina(key: string, $e: any) {
    if (key === 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarArquivo();
  }
  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarArquivo();
  }
  public get getPessoaId() {
    return this.agenteService.id as number;
  }

  public getTipo(tipo:any):string  | undefined {
    return this.utilService.extensao(tipo)
  }

  public setDeleteID(id:any){
    this.deleteById = id;
  }

  public deleteArquivo(id:any){
    this.agenteArquivo.delete(this.getPessoaId, id).pipe().subscribe({next:(re:any)=>{
      this.modalService.fechar('close-modal')
      this.recarregarPagina()
    },error: (erro)=>{
      console.error(erro)
    }})
  }
  public verArquivo(url:any){
  
    const opcoes:any={
      pessoaId: this.getPessoaId,
      url: url
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        
      })
      ).subscribe((file) => {
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
