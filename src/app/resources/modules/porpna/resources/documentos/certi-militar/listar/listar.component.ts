import { Component, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DocumentoService } from '@resources/modules/porpna/core/service/documento.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  constructor(private documentoService: DocumentoService, private ficheiroService:FicheiroService) { }

  public filtro: any = {
    page: 1,
    perPage: 5,
    search: '',
    nome: 'Certidão militar'
  }
  public documentos: any = []
  public urlFile:any
  public pagination: Pagination = new Pagination()
  public totalBase: number = 0;

  ngOnInit(): void {
    this.buscarDocumentos()
  }

  private buscarDocumentos() {
    this.documentoService.listarTodos(this.filtro).pipe().subscribe({
      next: (response: any) => {
        this.documentos = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }


    })
  }


  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.search = ''
    this.filtro.perPage = 10;
    this.filtro.modulo = 'PORPNA'
    this.buscarDocumentos();

  }

  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarDocumentos()

  }

  public verDocumento(urlDocumento:any, pessoaId:any):boolean | void{
    if (!urlDocumento) return false

    const opcoes = {
      pessoaId: pessoaId,
      url: urlDocumento
    }

    // this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe((file) => {
      this.urlFile = this.ficheiroService.createImageBlob(file);
    });
  }


}
