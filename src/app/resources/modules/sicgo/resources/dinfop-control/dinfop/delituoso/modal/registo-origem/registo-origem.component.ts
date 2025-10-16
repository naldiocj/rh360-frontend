import { Component, Input, Output, OnChanges, EventEmitter, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'registo-origem',
  templateUrl: './registo-origem.component.html',
  styleUrls: ['./registo-origem.component.css']
})
export class RegistoOrigemComponent implements OnChanges {

  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  public submitted: boolean = false;
  public isLoading: boolean = false;
  public formErrors: any;
  public FormOrigem!: FormGroup;
  params: any;
  @Input() origem: any;

  @Input() orgaoIdDoUsuarioLogado: any = 0;

  public tipoOcorrencias: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];

  constructor(
    private dinfopDelituosoOrigemService: DinfopDelituosoOrigemService,
    private tipoOcorrenciaService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void { 
    // Observa mudanças no ID
    this.dinfopDelituosoOrigemService.currentId.subscribe((origem) => {
      this.origem = origem;

      if (this.origem?.id) {
        this.getDataForm();
      }
    });
  }

  ngOnChanges(): void { 
    if (this.buscarId()) {
      this.getDataForm();
    }
  }

  ngOnDestroy(): void { }

  createForm(): void {
    this.FormOrigem = this.fb.group({
      data_detencao: ['', [Validators.required]],
      entidade_ordem: ['', [Validators.required]], 
      descricao: ['', [Validators.required]],
    });
  }


  getDataForm(): void {
    if (!this.origem) return; // Verifique se delitouso está definido
    this.FormOrigem.patchValue({
      entidade_ordem: this.origem.entidade_ordem,
      data_detencao: this.origem.data_detencao, 
      descricao: this.origem.descricao
    });
  }


  onSubmit(): void {
     
    if (this.FormOrigem.invalid) {
      this.submitted = true;
      console.warn('Formulário inválido:', this.FormOrigem.errors);
      return;
    }

    this.isLoading = true;
    const formData = { ...this.FormOrigem.value, delituoso_id: this.getDelituosoId() };
 
    const request = this.buscarId()
      ? this.dinfopDelituosoOrigemService.editar(formData, this.buscarId())
      : this.dinfopDelituosoOrigemService.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 400);
          this.reiniciarFormulario();
          this.removerModal()
          this.eventRegistarOuEditar.emit();
        },
        error: (err) => {
          console.error('Erro:', err);
          alert('Erro ao salvar registro. Tente novamente.');
        }
      });
  }




  reiniciarFormulario(): void {
    this.FormOrigem.reset();
  }

  // Método unificado para obter o ID do modo operante
  buscarId(): number {
    return this.origem?.id || 0;
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }

 

  removerModal(): void {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }



 
  




}
