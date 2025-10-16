import { Component, OnInit } from '@angular/core';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public grupos: any;
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0
  NovoProcesso:any
  public isOffcanvasVisible: number | any;
  public isOffVisible: string | null = null;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: "",
    sigla: 'null',
    municipio: 'null',
    municipioId: 'null',
  }
  constructor( private grupo:DinfopGrupoDelitousoService ){}

  ngOnInit( ){
    this.buscarGrupos()
  }

 

  
  buscarGrupos(){
    
    this.isLoading = true;
    this.grupo.listarTodos(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => { 
      this.grupos = response;

      
      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });

  }

 
  eliminar(id: number) {
    this.isLoading = true;
    this.grupo.eliminar(id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.filtrarPagina('page', 1)
    });
  }


   filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }else if (key == 'sigla') {
      this.filtro.sigla = $e.target.value
    }else if (key == 'provincia') {
      this.filtro.sigla = $e.target.value
    }

    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarGrupos()
   }

   filtrarPaginaRedirecionamento(id: string, valor: string) {
    if (id && valor) {

      if (id == 'provincia') {
        this.filtro.municipioId = valor
      } else if (id == 'municipio_id') {
        this.filtro.municipioId = valor;
      }  

    }

    
    this.buscarGrupos()
  }
   recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = '' 
    this.buscarGrupos()
   }

  construcao() {
    alert('Em construção')
  }


  public toggle(id: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;
      if (this.isOffcanvasVisible == id) {
        this.isOffcanvasVisible = null;
        this.isOffcanvasVisible == id;

        if (asideLeft == '' || asideLeft == '0px') {
          asideLeft = '-300px';
          mainLeft = '0px';
        }
        // Alterna a visibilidade
      } else if (this.isOffcanvasVisible != id) {
        this.isOffcanvasVisible = id; // Abre o novo sidebar e fecha o anterior

        asideLeft = '0px';
        mainLeft = '435px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }


    //INTERVENIENT
    public KV(id: any): void {
      // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir~~
      console.log('antes : ', id);
  
      // if (this.isOffcanvasVisible === id) {
      this.isOffVisible = id;
  
      // Alterna a visibilidade
      // }
  
    }
}