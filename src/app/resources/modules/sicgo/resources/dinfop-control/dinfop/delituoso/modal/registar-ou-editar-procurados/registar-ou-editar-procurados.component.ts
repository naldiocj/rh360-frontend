import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { Subject, finalize } from 'rxjs';
import { ListarComponent } from '../../listar/listar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcuradosService } from '@resources/modules/sicgo/core/service/piquete/dinfop/procurados/procurados.service';
 

@Component({
  selector: 'app-sicgo-difonp-registar-ou-editar-procurados',
  templateUrl: './registar-ou-editar-procurados.component.html',
  styleUrls: ['./registar-ou-editar-procurados.component.css']
})
export class RegistarOuEditarProcuradosComponent implements OnInit {
  private destroy$ = new Subject<void>();
  registrationForm: FormGroup; 
  isLoading: boolean = false
  submitted: boolean = false

  @Output() eventRegistarOuEditar = new EventEmitter<void>();
  public procurado: any; 
  @Input() delituosoIds: any[] = [];
  @ViewChild(ListarComponent) listarComponent!: ListarComponent;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null; 
  fotodfault='../../../../../../../../assets/assets_sicgo/img/logopolice.png';

  constructor(
    private ficheiroService: FicheiroService, 
    private activatedRoute: ActivatedRoute,
    private procuradosService: ProcuradosService,
    private fb: FormBuilder) {
      this.registrationForm = this.fb.group({
        delituosoIds: this.fb.array([]),
        descricao: ['', [Validators.required, Validators.maxLength(255)]],
        
      });
  }

  ngOnInit(): void { 
    if (!Array.isArray(this.delituosoIds)) { 
      this.delituosoIds = []; // Garantir fallback
    }
  }
  

  removerAgenteSelecionado(item: any) {
    if (!this.delituosoIds || !Array.isArray(this.delituosoIds)) {
      return;
    }
    const posicao = this.delituosoIds.findIndex((o: any) => o.id === item.id);
    if (posicao >= 0) {
      this.delituosoIds.splice(posicao, 1);
    } else {
      console.warn('Item não encontrado em delituosoIds:', item);
    }
  }
  

  removerTodos() {
    this.delituosoIds.splice(0, this.delituosoIds.length)
  }

  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  idade: number | null = null;

  calculateAge(birthData: string | number | Date) {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      let idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
      }

      this.idade = idade;
    } else {
      alert('Por favor, insira uma data de nascimento válida.');
    }
  }

    // Exibe as fotos e detalhes de todos os delituosos 
visualizarDelituoso() {
  if (!this.delituosoIds || !Array.isArray(this.delituosoIds)) {
    console.error('Lista de delituosos é null, undefined ou não é uma array');
    return; // Sai da função se a lista de IDs estiver inválida
  }

  this.delituosoIds.forEach((delituoso: any) => {
    if (!delituoso.fotografias) {
      console.warn(`Delituoso com ID ${delituoso.id} não possui fotografias`);
      return;
    }

    // Exibe a foto frontal
    if (delituoso.fotografias.image_frontal) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_frontal)
        .pipe(finalize(() => {}))
        .subscribe((file) => {
          delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn(`Imagem frontal não disponível para delituoso com ID ${delituoso.id}`);
    }

    // Exibe a foto lateral direita
    if (delituoso.fotografias.image_lateral_direita) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
        .pipe(finalize(() => {}))
        .subscribe((file) => {
          delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn(`Imagem lateral direita não disponível para delituoso com ID ${delituoso.id}`);
    }

    // Exibe a foto lateral esquerda
    if (delituoso.fotografias.image_lateral_esquerda) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
        .pipe(finalize(() => {}))
        .subscribe((file) => {
          delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn(`Imagem lateral esquerda não disponível para delituoso com ID ${delituoso.id}`);
    }
  });
}











    getDataForm(): void {
      if (!this.procurado) return; // Verifique se delitouso está definido
  
      this.registrationForm.patchValue({
        delituoso_id:  this.procurado.delituoso_id,
        descricao: this.procurado.descricao,
  
        
      });
    }

 

    onSubmit(): void {
      if (this.registrationForm.invalid || this.submitted) {
        Object.values(this.registrationForm.controls).forEach(control => {
          control.markAsTouched();
        });
        console.log('Formulário inválido:', this.registrationForm.controls);
        return;
      }
    
      this.submitted = true;
      this.isLoading = true;
    
      // Adiciona os IDs selecionados ao formulário
      const delituosoIds = this.buscarId(); // Busca apenas os IDs selecionados
      
      const formData = {
        ...this.registrationForm.value,
        delituoso_id: delituosoIds,
      };
    
      const request$ = delituosoIds.length
        ? this.procuradosService.editar(formData, delituosoIds)
        : this.procuradosService.registar(formData);
    
      request$
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.submitted = false;
          })
        )
        .subscribe({
          next: () => {
            setTimeout(() => {
              window.location.reload();
            }, 400);
            this.removerModal();
            this.reiniciarFormulario();
            this.eventRegistarOuEditar.emit();
          },
          error: (error) => {
            console.error('Erro ao registrar ou editar:', error);
          }
        });
    }
    
    

    private get getFormDados() {
      const dados = new FormData()
  
  
      dados.append('delituosos', JSON.stringify(this.registrationForm.value?.deliruosos))
  
  
  
      return dados
    }
  
  reiniciarFormulario(): void {
    this.registrationForm.value.delituoso_id = []
    this.delituosoIds = []
    this.registrationForm.reset();
  }

  buscarId(): number[] {
    if (!this.delituosoIds || !Array.isArray(this.delituosoIds)) {
      console.warn('delituosoIds está vazio ou inválido.');
      return [];
    }
  
    return this.delituosoIds
      .filter((delituoso: any) => delituoso && delituoso.id) // Garante que 'id' existe
      .map((delituoso: any) => delituoso.id);
  }
  
   

  removerModal(): void {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
