import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'dinfop-app-registo-associar-delituoso',
  templateUrl: './registo-associar-delituoso.component.html',
  styleUrls: ['./registo-associar-delituoso.component.css']
})
export class RegistoAssociarDelituosoComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  @Input() delituososSelecionados: any = [];
  @Input() grupoId: any = 0;
  @Output() eventRegistarOuEditar  = new EventEmitter<any>();
 
 
  form: FormGroup; 
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
   fileUrl: any; 
   idade: number | null = null;
   fotodfault='./assets/assets_sicgo/img/logopolice.png';
 
  delituosos: any[] = []; // Lista de delituosos
  selectedDelituosos: number[] = []; // IDs dos delituosos selecionados

  constructor(
    private dinfopGrupoDelitousoService: DinfopGrupoDelitousoService,
    private delituosoService: DinfopDelitousoService,
    private ficheiroService: FicheiroService,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      delituosoIds: [[], Validators.required], // Ajuste o tipo conforme necessário
      grupoIds: [[], Validators.required],      // Ajuste o tipo conforme necessário
    });
    
  }
  

  ngOnInit(): void {
    this.buscarDelituoso();
  }

  
  ngOnDestroy(): void {
    // Se houver lógica de limpeza, você pode implementar aqui
  }
  
  
  private buscarDelituoso(): void {
    this.isLoading = true; // Ativar loader

    this.delituosoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false)) // Desativar loader
      .subscribe({
        next: (response: any) => {
          this.delituosos = Array.isArray(response) ? response : [response];
          console.log('Delituosos:', this.delituosos);
          this.delituosos.forEach(delituoso => this.visualizarDelituoso(delituoso));
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
          // Adicionar lógica para mostrar mensagem de erro ao usuário
        }
      });
  }

  private visualizarDelituoso(delituoso: any): void {
    console.log(`Nome: ${delituoso.nome}, Alcunha: ${delituoso.alcunha}`);
    this.carregarImagens(delituoso);
  }

  private carregarImagens(delituoso: any): void {
    this.carregarImagem(delituoso, 'image_frontal', 'fileUrlFrontal');
    this.carregarImagem(delituoso, 'image_lateral_direita', 'fileUrlLateralDireita');
    this.carregarImagem(delituoso, 'image_lateral_esquerda', 'fileUrlLateralEsquerda');
  }

  private carregarImagem(delituoso: any, imageType: string, fileUrlKey: string): void {
    if (delituoso.fotografias[imageType]) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias[imageType])
        .pipe(finalize(() => { })) // Você pode adicionar lógica aqui se necessário
        .subscribe({
          next: (file: any) => {
            delituoso[fileUrlKey] = this.ficheiroService.createImageBlob(file);
          },
          error: (err: any) => {
            console.error(`Erro ao carregar a imagem ${imageType}:`, err);
          }
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
    this.dinfopGrupoDelitousoService.addGrupo(this.delituososSelecionados, this.grupoId)
      .subscribe({
        next: (response) => {
           this.eventRegistarOuEditar.emit(true);
          // Adicionar lógica para mostrar mensagem de sucesso
          setTimeout(() => {
            window.location.reload();
          }, 400);
        },
        error: (error) => {
          console.error('Erro ao adicionar grupos:', error);
          // Adicionar lógica para mostrar mensagem de erro
        }
      });
  }

  removeGrupos(): void {
    this.dinfopGrupoDelitousoService.removeGrupo(this.delituososSelecionados, this.grupoId)
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

  addGruposs() {
    const { delituosoIds, grupoIds } = this.form.value;

    this.dinfopGrupoDelitousoService.addGrupo(delituosoIds, grupoIds)
      .subscribe({
        next: (response: any) => {
          console.log('Sucesso:', response);
          // Aqui você pode adicionar lógica para exibir uma mensagem de sucesso ou redirecionar
        },
        error: (error: any) => {
          console.error('Erro:', error);
          // Aqui você pode adicionar lógica para exibir uma mensagem de erro
        }
      });
  }

  addGruposx() {
    // Pegando os IDs dos grupos do formulário, separando por vírgula e removendo espaços
    const grupoIds = this.form.value.grupoIds.split(',').map((id: string) => id.trim());
  
    // Verifica se há delituosos selecionados
    if (this.selectedDelituosos.length === 0) {
      console.error('Nenhum delituoso selecionado.');
      return; // Cancela a execução se nenhum delituoso for selecionado
    }
  
    // Verifica se há IDs de grupos válidos
    if (grupoIds.length === 0) {
      console.error('Nenhum grupo selecionado.');
      return; // Cancela a execução se nenhum grupo for informado
    }
  
    // Chama o serviço para associar delituosos aos grupos
    this.dinfopGrupoDelitousoService.addDelituososToGrupos(this.selectedDelituosos, grupoIds)
      .subscribe({
        next: (response: any) => {
          console.log('Sucesso:', response);
          // Aqui você pode adicionar lógica para exibir uma mensagem de sucesso ou redirecionar
        },
        error: (error: any) => {
          console.error('Erro:', error);
          // Aqui você pode adicionar lógica para exibir uma mensagem de erro
        }
      });
  }
  

  

  calculateAge(birthData: string | number | Date): void {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      this.idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        this.idade--;
      }
    } else {
       
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
