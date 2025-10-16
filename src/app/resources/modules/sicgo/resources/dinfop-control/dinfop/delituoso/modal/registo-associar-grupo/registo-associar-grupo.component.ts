import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { AssociarGrupoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar_grupo_ocorrencia/associar-grupo-ocorrencia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-registo-associar-grupo',
  templateUrl: './registo-associar-grupo.component.html',
  styleUrls: ['./registo-associar-grupo.component.css']
})
export class RegistoAssociarGrupoComponent implements OnInit {
  
  @Input() gruposSelecionados: any = [];
  @Output() eventRegistarOuEditar  = new EventEmitter<any>();
 
  @Input() delituosoId: any = 0;

  form: FormGroup;
  grupos: any[] = []; // Lista original de delituosos
  searchTerm: string = ''; // Termo de busca
  selectedDelituosos: number[] = [];
  isLoading: boolean = false;

  constructor(
    private grupodelituosoService: DinfopGrupoDelitousoService,
    private delituosoService: DinfopDelitousoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      delituosoIds: [[], Validators.required], // Ajuste o tipo conforme necessário
      grupoIds: [[], Validators.required], 
    });
  }
   
  ngOnInit(): void {
    this.buscarGrupos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gruposSelecionados'] && this.gruposSelecionados) {
      this.buscarGrupos();
    }
  }

  ngOnDestroy(): void {
    // Se houver lógica de limpeza, você pode implementar aqui
  }
  
 
  private buscarGrupos(): void {
    this.isLoading = true; // Ativar loader

    this.grupodelituosoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false)) // Desativar loader
      .subscribe({
        next: (response: any) => {
          this.grupos = Array.isArray(response) ? response : [response];
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
          // Adicionar lógica para mostrar mensagem de erro ao usuário
        }
      });
  }

   // Variável de busca
   filtro: string = '';

   // Método para filtrar os grupos com base na busca
   filtrarGrupos(grupo: any): boolean {
     const filtroLower = this.filtro.toLowerCase();
     return grupo.nome.toLowerCase().includes(filtroLower) ||
            grupo.sigla.toLowerCase().includes(filtroLower) 
   }

  addGrupos(): void {
    this.delituosoService.addGrupo(this.delituosoId, this.gruposSelecionados)
      .subscribe({
        next: (response) => {
          
          setTimeout(() => {
            window.location.reload();
          }, 400);
          this.eventRegistarOuEditar.emit(true);
          // Adicionar lógica para mostrar mensagem de sucesso
        },
        error: (error) => {
          console.error('Erro ao adicionar grupos:', error);
          // Adicionar lógica para mostrar mensagem de erro
        }
      });
  }

  removeGrupos(): void {
    this.delituosoService.removeGrupo(this.delituosoId, this.gruposSelecionados)
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
