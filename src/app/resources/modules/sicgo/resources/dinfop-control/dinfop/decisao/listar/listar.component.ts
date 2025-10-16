import { Component, OnInit } from '@angular/core';
import { DelitousoTribulanResultadoProcessoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_tribulan_resultado_processo.service';
import { finalize } from 'rxjs';

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  first_page?: number; // Se necessário, adicione a propriedade
  deserialize?: (data: any) => void; // Função de deserialização, se necessário
}

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public decisaos:any[] = [];
  public isLoading: boolean = false
  public isOffcanvasVisible: number | any;
  public isOffVisible: string | null = null;


  totalBase: number = 0
  NovoProcesso:any

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  pagination!: Pagination;
  constructor( private delitoTribunal:DelitousoTribulanResultadoProcessoService ){}

  ngOnInit( ){

    this.buscarD()
  }

  setDiverso(item: any) {
    this.NovoProcesso  = item
  }




  buscarD() {
    this.isLoading = true;
    this.delitoTribunal.listarTodos(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      console.log("Resposta da API:", response);

      // Verificar se a resposta é um array
      if (Array.isArray(response)) {
        this.decisaos = response;

        // Definindo a quantidade de itens por página
        const perPage = 10; // ou use um valor dinâmico conforme necessário
        const totalItems = this.decisaos.length;

        this.pagination = {
          current_page: 1, // Ajuste conforme necessário
          per_page: perPage,
          total: totalItems,
          last_page: Math.ceil(totalItems / perPage), // Calcular a última página
        };
      } else {
        console.error('Estrutura de resposta inválida', response);
      }
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
    this.buscarD()
   }

   recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarD()
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
        mainLeft = '450px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }

}
