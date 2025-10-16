import { Component, OnInit } from '@angular/core';
import { VitimaService } from '@resources/modules/sicgo/core/service/piquete/vitima.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  selectAll: boolean = false; // Variável para controlar o estado do checkbox "selecionar todos"
  selectedCount: number | any;
  isOffcanvasVisible: number | any;
  isLoading: boolean = false
  pagination = new Pagination();
  totalBase: number = 0
  NovoProcesso: any
  public vitimas: any[] =[];
  options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };

  filtro = {
    search: '',
    perPage: 5,
    page: 1,
    nome: null,
   
    alcunha: null,
  
  };


  constructor(
    private vitimaService: VitimaService
  ) { }


  ngOnInit() {
    this.buscarVitimas()
  }
  trackById(index: number, item: any) {
    return item.id; // ou qualquer outro identificador único
  }


  buscarVitimas() { 
    this.isLoading = true;
  
    const options = {
      page: this.filtro.page,
      perPage: this.filtro.perPage
    };
  
    this.vitimaService
    this.isLoading = true;
    this.vitimaService.listarTodos({ page: 1, perPage: 10 }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
  
          if (response && response.data) {
            this.vitimas = response.data; // Atribuindo o array de vítimas
            this.totalBase = response.meta.total; // Total de registros
          } else {
            this.vitimas = [];
            console.warn('Formato inesperado na resposta:', response);
          }
          console.log('Vítimas carregadas:', this.vitimas);
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Erro ao buscar vítimas:', err);
        }
      });
  }
   
  filtrarPagina($e: any, key: string, reiniciar: boolean = true) {
    switch (key) {
      case 'page':
        this.filtro.page = $e;
        break;
      case 'perPage':
        this.filtro.perPage = $e.target.value;
        break;
      default:

    }

    if (reiniciar) {
      this.filtro.page = 1;
    }

    this.buscarVitimas();
  }

  recarregarPagina() {
    this.filtro = {
      search: '',
      perPage: 5,
      page: 1,
      nome: null,
      
      alcunha: null,
      
    };

    this.buscarVitimas();
  }





  // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir
  toggle(id: any): void {
    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');
    console.log(main, asidebar);

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;
      if (this.isOffcanvasVisible == id) {
        this.isOffcanvasVisible = null;
        this.isOffcanvasVisible == id;
        console.log(this.isOffcanvasVisible);
        if (asideLeft == '' || asideLeft == '0px') {
          asideLeft = '-300px';
          mainLeft = '0px';
        }
        // Alterna a visibilidade
      } else if (this.isOffcanvasVisible != id) {
        this.isOffcanvasVisible = id; // Abre o novo sidebar e fecha o anterior
        console.log(this.isOffcanvasVisible);

        asideLeft = '0px';
        mainLeft = '300px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }

  //INTERVENIENT
  public INTERVENIENT(id: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir~~
    console.log('antes : ', id);

    this.isOffcanvasVisible = id;


  }


  // Função para atualizar a contagem quando um checkbox é alterado
  updateSelectedCount() {
    this.selectedCount = this.vitimas.filter(
      (file: { selected: any; }) => file.selected
    ).length;
  }

  construcao() {
    alert('Em construção')
  }

}



