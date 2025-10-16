import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-associar-expediente',
  templateUrl: './associar-expediente.component.html',
  styleUrls: ['./associar-expediente.component.css']
})
export class AssociarExpedienteComponent implements OnInit {
 receivedData: string | any;
  currentStep = 1;
  expediente: any;
  receiveData(data: string) {
    this.receivedData = data;
  }
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  @Input() delituososSelecionados: any = [];
  @Input() grupoId: any = 0;
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();

   
  
  totalBase: number = 0;
  public pagination = new Pagination();
  public filtro = {
    search: '',
    page: 1,
    perPage: 5, 
    nacionalidade: null,
    genero: null,
    estadocivil_id: null,
    provincia_id: null,
    municipio_id: null,
  }

  delituosos: any[] = []; // Lista de delituosos
  selectedDelituosos: number[] = []; // IDs dos delituosos selecionados
  delituoso: any;
 
  constructor(
     private expedienteService:ExpedienteService,
     private cdRef: ChangeDetectorRef
  ) {
     
  }


  ngOnInit(): void {
     this.buscarExpediente();
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['delituosoId'] && this.delituosoId) {
      this.buscarExpediente();
    }
  }

  public isLoading: boolean = false 

  // Função para buscar os delituosos
   buscarExpediente() {
     const options = { ...this.filtro };
     this.isLoading = true;
     this.expedienteService.listarTodos(options).pipe(
       finalize(() => {
         this.isLoading = false;
       })
     ).subscribe({
       next: (response: any) => {
         this.expediente = response.data; // Ajuste conforme a estrutura da resposta
          console.log('Expediente: ',this.expediente);
         this.cdRef.detectChanges();
 
 
         this.totalBase = response.meta.current_page
           ? response.meta.current_page === 1
             ? 1
             : (response.meta.current_page - 1) * response.meta.per_page + 1
           : this.totalBase;
 
         this.pagination = this.pagination.deserialize(response.meta);
 
       },
     });
   }

  // Função para atualizar o filtro de pesquisa e buscar delituosos
  filtrarPagina(key: any, $e: any) {
    // Atualiza o filtro conforme a chave fornecida
    if (key === 'page') {
      this.filtro.page = $e;  // Atualiza a página
    } else if (key === 'perPage') {
      this.filtro.perPage = $e.target.value;  // Atualiza o número de itens por página
    } else if (key === 'search') {
      this.filtro.search = $e;  // Atualiza o termo de busca
    } else if (key === 'genero') {
      this.filtro.genero = $e;  // Atualiza o filtro de gênero
    } else if (key === 'nacionalidade') {
      this.filtro.nacionalidade = $e;  // Atualiza o filtro de nacionalidade
    }  
  
    
  
    // Chama a função de busca com os filtros atualizados
    
  }
  

 

 
 

  toggleDelituoso(delituosoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedDelituosos.push(delituosoId);
    } else {
      this.selectedDelituosos = this.selectedDelituosos.filter(id => id !== delituosoId);
    }
  }

 

  submitAssociacao(): void {
    this.nextStep();
  }

  canAssociacaoSubmit(): boolean {
    return this.selectedDelituosos.filter((field) => field.valueOf.length > 0)
      .length !== 3
      ? true
      : false;
  }


  // Progresso em %
  getProgressPercent(): number {
    return (this.currentStep / 2) * 100;
  }

  // Manipulação de passos
  nextStep(): void {
    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

 

  selecionarDelituosoParaDelituoso(item: any): void {
    const conjuntoUnico = new Set(this.delituososSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.delituososSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined): boolean {
    return !!this.delituososSelecionados.find((o: any) => o.id === id);
  }

  limparVariaveis(): void {
    this.delituososSelecionados = [];
  }

  removerDelituosoSelecionado(item: any): void {
    const posicao = this.delituososSelecionados.findIndex((o: any) => o.id === item.id);
    if (posicao !== -1) {
      this.delituososSelecionados.splice(posicao, 1);
    }
  }

  removerTodos(): void {
    this.delituososSelecionados = [];
  }

     // Função para recarregar a página e buscar os dados novamente
     recarregarPagina(): void {
      this.filtro.page = 1;
      this.filtro.perPage = 5;
      this.filtro.search = '';
      
    }
    

 
}



