import { Component, Input, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteArquivoService } from '@resources/modules/pa/core/service/agente-arquivo.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-arquivos',
  templateUrl: './arquivos.component.html',
  styleUrls: ['./arquivos.component.css']
})
export class ArquivosComponent implements OnInit {

  @Input() pessoaId: any
  totalBase: number = 0

  @Input() funcionario:any


  public pagination: Pagination = new Pagination()
  public arquivos: any = []
  public carregando: boolean = false;
  public solicitacao_id:number | undefined
  public fileUrl:any

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy: ['pa.descricao','arquivo', 'pa.tipo']
  };
  constructor(private arquivoService: AgenteArquivoService, private utilService: UtilService,private ficheiroService:FicheiroService) { }



  ngOnInit(): void {
    this.buscarArquivos()
  }

  private buscarArquivos() {
    this.carregando = true;
    this.arquivoService.listar(this.getPessoaId, this.filtro).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.arquivos = response.data



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
    this.buscarArquivos()
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarArquivos()
  }

  public get getPessoaId(): number {
    return this.pessoaId as number
  }
  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }

  public setId(id:number | undefined){
    this.solicitacao_id = id

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


  public wipeId(){
    this.solicitacao_id = undefined
  }
  public getTipo(tipo:any):string  | undefined {
    return this.utilService.extensao(tipo)
  }


  public get getFuncionario():any{
    return this.funcionario;
  }


}
