import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarGrupoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar_grupo_ocorrencia/associar-grupo-ocorrencia.service';
import { DinfopAntecedenteDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/antecedente_delitouso.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Pagination } from '@shared/models/pagination';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-associar-grupo-registo-ou-editar',
  templateUrl: './associar-grupo-registo-ou-editar.component.html',
  styleUrls: ['./associar-grupo-registo-ou-editar.component.css']
})
export class AssociarGrupoRegistoOuEditarComponent implements OnInit {

  @Input() gruposSelecionados: any = [];
  @Output() eventRegistarOuEditar = new EventEmitter<void>();
  @Input() ocorrenciaId: any = [];

  form: FormGroup;
  delituosos: any[] = []; // Lista original de delituosos
  searchTerm: string = ''; // Termo de busca
selectedDelituosos: number[] = [];
  isLoading: boolean = false;

    totalBase: number = 0;
    public pagination = new Pagination();
    
  constructor(
    private grupodelituosoService: DinfopGrupoDelitousoService,
    private AssociarGrupoOcorrencia: AssociarGrupoOcorrenciaService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      grupoIds: [[], Validators.required],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.buscarDelituoso();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gruposSelecionados'] && this.gruposSelecionados) {
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
  
  private buscarDelituoso(): void {
    this.isLoading = true; // Ativar loader

    this.grupodelituosoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false)) // Desativar loader
      .subscribe({
        next: (response: any) => {
          this.delituosos = Array.isArray(response) ? response : [response];

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
          // Adicionar lógica para mostrar mensagem de erro ao usuário
        }
      });
  }


  addGrupos(): void {
    this.AssociarGrupoOcorrencia.addGrupoDelituoso(this.gruposSelecionados, this.ocorrenciaId)
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
    this.AssociarGrupoOcorrencia.removeDelituoso(this.gruposSelecionados, this.ocorrenciaId)
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

  selecionarDelituosoParaOcorrencia(item: any): void {
    const conjuntoUnico = new Set(this.gruposSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.gruposSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined): boolean {
    return !!this.gruposSelecionados.find((o: any) => o.id === id);
  }

  limparVariaveis(): void {
    this.gruposSelecionados = [];
  }

  removerDelituosoSelecionado(item: any): void {
    const posicao = this.gruposSelecionados.findIndex((o: any) => o.id === item.id);
    if (posicao !== -1) {
      this.gruposSelecionados.splice(posicao, 1);
    }
  }

  removerTodos(): void {
    this.gruposSelecionados = [];
  }
}
