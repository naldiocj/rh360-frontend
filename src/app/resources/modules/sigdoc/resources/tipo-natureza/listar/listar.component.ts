import { Component, OnInit } from '@angular/core';
import { TipoNaturezaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Natureza.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  arquivoIdParaExcluir: any;
  visualizarFoto: boolean = true;
  TramitarDocumento: any
  public documento: any
  public fileUrl: any
  public carregarDocumento: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public correspondenciaId: number | null = null
  public siglaSelecionada: string | undefined;
  public nomeOrgaoSelecionada: string | undefined;

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  }

  public orgaoId: any; 

  constructor(
    private tipoNaturezaService: TipoNaturezaService,
) {}

  ngOnInit(): void {
    this.buscarCorrespondencias()
  }

  setArquivoIdParaExcluir(id: number): void {
    this.arquivoIdParaExcluir = id;
  }

  private buscarCorrespondencias(): void {
    const options = {
      ...this.filtro,
    }
    this.tipoNaturezaService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        this.correspondencias = response.data
       
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    });
    console.log(this.correspondencias)
  }

  confirmarEliminar(): void {
    if (this.arquivoIdParaExcluir) {
      this.tipoNaturezaService.eliminar(this.arquivoIdParaExcluir).subscribe(
        () => {
          this.arquivoIdParaExcluir = null; 
          this.recarregarPagina(); 
  
          const modal = document.getElementById('confirmModal');
          if (modal) {
            modal.classList.remove('show'); 
            modal.style.display = 'none'; 
            this.recarregarPagina(); 
            document.body.classList.remove('modal-open'); 
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        },
        (error) => {
          console.error('Erro ao excluir registro:', error);
        }
      );
    }
  }

  
  public recarregarPagina(): void {
    this.documento = {};
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.pagination.current_page = 1
    this.buscarCorrespondencias()

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCorrespondencias()
  }

  public registar() {
    this.documento = null
  }

  public atualizartabela() {
    this.registar()
    this.buscarCorrespondencias()
  }

  editar(item: any) {
    console.log(item)
    this.documento = { ...item}
  }

  public construcao() {
    alert('Em contrucao')
  }
  
  setId(id: number | null) {
    this.correspondenciaId = id
  }
}