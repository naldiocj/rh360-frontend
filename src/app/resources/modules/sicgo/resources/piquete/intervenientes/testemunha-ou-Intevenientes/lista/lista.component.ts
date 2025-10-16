import { Component, Input, OnInit } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { TetemunhaService } from '@resources/modules/sicgo/core/service/piquete/testemunha.service';
import { VitimaService } from '@resources/modules/sicgo/core/service/piquete/vitima.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaTestemunhaComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public testemunhas: any;
  vitimas: any;
  isLoading: boolean = false;
  totalBase: any;
  constructor(private tetemunhaService: TetemunhaService,private vitimaService: VitimaService) {

    }


  ngOnInit() {
    this.Testemunhas();
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
          console.error('Erro ao buscar vítimas:', err);
        }
      });
  }
  filtro = {
    search: '',
    perPage: 5,
    page: 1, 
  };

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

    this.Testemunhas();
  }

  recarregarPagina() {
    this.filtro = {
      search: '',
      perPage: 5,
      page: 1,
      
    };

    this.Testemunhas();
  }


 Testemunhas() {
    this.tetemunhaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.testemunhas = response; 
        },
      });
  }




}




