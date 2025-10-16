import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarDelituosoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar_delituoso_ocorrencia/associar-delituoso-ocorrencia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopDelitousoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_ocorrencia.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-linkar-suspeito-modal',
  templateUrl: './linkar-suspeito-modal.component.html',
  styleUrls: ['./linkar-suspeito-modal.component.css']
})
export class LinkarSuspeitoModalComponent implements OnInit, OnDestroy {

  @Input() delituososSelecionados: any = [];
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();
  @Input() ocorrenciaId: any = [];
  totalBase: number = 0;
  public pagination = new Pagination();
  form: FormGroup;
  delituosos: any[] = []; // Lista original de delituosos
  searchTerm: string = ''; // Termo de busca
selectedDelituosos: number[] = [];
  isLoading: boolean = false;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  idade: number | null = null;
  fotodfault = '../../../../../../../../assets/assets_sicgo/img/logopolice.png';

  constructor(
    private delituosoService: DinfopDelitousoService,
    private ficheiroService: FicheiroService,
    private AssociarDelituosoOcorrencia: AssociarDelituosoOcorrenciaService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      delituosoIds: [[], Validators.required],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.buscarDelituoso();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['delituosoId'] && this.delituosoId) {
      this.buscarDelituoso();
    }
  }

  ngOnDestroy(): void {
    // Se houver lógica de limpeza, você pode implementar aqui
  }
  get searchTermControl(): FormControl {
    return this.form.get('searchTerm') as FormControl; // Asserção de tipo
  }

  get filteredDelituosos() {
    const searchTerm = this.searchTermControl.value.toLowerCase();
    return this.delituosos.filter(delituoso => {
      return (
        delituoso.nome.toLowerCase().includes(searchTerm) ||
        delituoso.codigo_sistema.toLowerCase().includes(searchTerm)
      );
    });
  }

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,
  };
  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } 
    
    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarDelituoso();
  }
  public buscarDelituoso(): void {
    const options = { ...this.filtro };
    this.isLoading = true;
    this.delituosoService.listarTodos(options)
      .pipe() // Desativar loader
      .subscribe({
        next: (response: any) => {
          this.delituosos = response.data;
          this.delituosos.forEach(delituoso => this.visualizarDelituoso(delituoso));
                
           
          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  visualizarDelituoso(delituoso: any): void {
    // Verifique se o objeto e as imagens existem
    if (!delituoso || !delituoso.fotografias) {
      console.error('Delituoso ou fotografias são null ou undefined');
      return;
    }

    // Exibe a foto frontal, se existir
    if (delituoso.fotografias.image_frontal) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_frontal)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn('Imagem frontal não disponível');
    }

    // Exibe a foto lateral direita, se existir
    if (delituoso.fotografias.image_lateral_direita) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
        });
    }

    // Exibe a foto lateral esquerda, se existir
    if (delituoso.fotografias.image_lateral_esquerda) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
        });
    }
  }

 

  toggleDelituoso(delituosoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedDelituosos.push(delituosoId);
    } else {
      this.selectedDelituosos = this.selectedDelituosos.filter(id => id !== delituosoId);
    }
  }

  addGrupos(): void {
    this.AssociarDelituosoOcorrencia.addDelituoso(this.delituososSelecionados, this.ocorrenciaId)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            window.location.reload();
          }, 700);
          this.eventRegistarOuEditar.emit();
          // Adicionar lógica para mostrar mensagem de sucesso
        },
        error: (error) => {
          console.error('Erro ao adicionar grupos:', error);
          // Adicionar lógica para mostrar mensagem de erro
        }
      });
  }

  removeGrupos(): void {
    this.AssociarDelituosoOcorrencia.removeDelituoso(this.delituosoId, this.ocorrenciaId)
      .subscribe({
        next: (response) => {
          console.log('Grupos removidos:', response);
          // Adicionar lógica para mostrar mensagem de sucesso
        },
        error: (error) => {
          console.error('Erro ao remover grupos:', error);
        }
      });
  }
 
  // Função para calcular a idade baseado na data de nascimento
  calculateAge(birthDate: string | number | Date): void {
    if (birthDate) {
      let birth: Date;
  
      // Verificar se birthDate é uma string no formato dd/MM/yyyy
      if (typeof birthDate === 'string' && birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/').map(Number); // Divide e converte os valores em números
        birth = new Date(year, month - 1, day); // Cria a data no formato aceito pelo JavaScript
      } else {
        // Caso seja um formato ISO ou Date, apenas converte diretamente
        birth = new Date(birthDate);
      }
  
      if (isNaN(birth.getTime())) {
        console.error('Data de nascimento inválida:', birthDate);
        this.idade = null;
        return;
      }
  
      // Calcular a idade
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDifference = today.getMonth() - birth.getMonth();
  
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
  
      this.idade = age;
    } else {
      console.error('Data de nascimento não fornecida.');
      this.idade = null;
    }
  }

  selecionarDelituosoParaOcorrencia(item: any): void {
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
}
