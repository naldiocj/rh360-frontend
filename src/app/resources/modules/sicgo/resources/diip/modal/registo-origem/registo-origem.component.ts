import { Component, Input, Output, OnChanges, EventEmitter, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'diip-registo-origem',
  templateUrl: './registo-origem.component.html',
  styleUrls: ['./registo-origem.component.css']
})
export class DiipRegistoOrigemComponent implements OnChanges {

  @Input() ocorrencia: any=0;
  @Input() delituosoId: any=0;
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
  public Form!: FormGroup;
  params: any;
  delitouso: any;
  
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
    this.buscarTipicidadeOcorrencias();

  }

  ngOnChanges(): void {
    this.buscarTipicidadeOcorrencias();
    if (this.buscarId()) {
      this.getDataForm();
    }
  }

  ngOnDestroy(): void {}

  createForm(): void {
    this.Form = this.fb.group({
      data_detencao: ['', [Validators.required]], // Adiciona o campo observacao
      entidade_ordem: ['', [Validators.required]], // Adiciona o campo observacao
      familia_crime_id: ['', [Validators.required]], // Adiciona o campo observacao
      tipo_crime_id: ['', [Validators.required]], // Adiciona o campo observacao
      tipicidade_crime_id: ['', [Validators.required]], // Adiciona o campo observacao
      destino_detido_id: ['', [Validators.required]], // Adiciona o campo observacao

    });
  }

  getDataForm(): void {
    if (!this.delitouso) return; // Verifique se delitouso está definido

    this.Form.patchValue({
      entidade_ordem: this.delitouso.entidade_ordem,
      data_detencao: this.delitouso.data_detencao, // Preenche o campo observacao se disponível
      familia_crime_id: this.delitouso.familia_crime_id,  // Preenche o campo observacao se disponível
      tipo_crime_id: this.delitouso.tipo_crime_id,  // Preenche o campo observacao se disponível
      tipicidade_crime_id: this.delitouso.tipicidade_crime_id,  // Preenche o campo observacao se disponível
      destino_detido_id: this.delitouso.destino_detido_id  // Preenche o campo observacao se disponível
   });
  }

  onSubmit(): void {
    if (this.Form.invalid) {
      Object.values(this.Form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    // Adicionar delituoso_id ao formulário
    const formData = { ...this.Form.value, delituoso_id: this.getDelituosoId() };

    const request = this.buscarId()
      ? this.dinfopDelituosoOrigemService.editar(formData, this.buscarId())
      : this.dinfopDelituosoOrigemService.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.removerModal();
        this.reiniciarFormulario();
        this.eventRegistarOuEditar.emit();
      });
  }

  reiniciarFormulario(): void {
    this.Form.reset();
  }

  buscarId(): number | undefined {
    return this.delitouso?.id;
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }



  removerModal(): void {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }



  buscarTipicidadeOcorrencias() {

    this.tipicidadeOcorrenciaService
      .listarTodos({ page: 1, perPage: 4 })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.tipicidadeOcorrencias = response.data
            .map((item: any) => ({
              id: item.id,
              text: item.nome,
            }));
        },
      });
  }

  public selecionarCategoriaOcorrencia($event: any) {
    if (!$event)
      return
    this.tipoCategoriasClone = this.tipoCategorias.filter((item: any) => item.id == $event)
    this.tipoCategoriaService.listarTodos({ sicgo_tipo_ocorrencia_id: $event }).pipe().subscribe({
      next: (response: any) => {
        this.tipoCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }
  public selecionarTipoOcorrencia($event: any) {
    if (!$event)
      return

    this.tipoOcorrenciasClone = this.tipoOcorrencias.filter((item: any) => item.id == $event)
    this.tipoOcorrenciaService.listarTodos({ sicgo_tipo_ocorrencia_id: $event }).pipe().subscribe({
      next: (response: any) => {
        this.tipoOcorrencias = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }




  get sicgo_tipicidade_ocorrencia_idValidate() {
    return (
      this.Form.get('sicgo_tipicidade_ocorrencia_id')?.invalid && this.Form.get('sicgo_tipicidade_ocorrencia_id')?.touched
    );
  }
  get sicgo_tipo_ocorrencia_idValidate() {
    return (
      this.Form.get('sicgo_tipo_ocorrencia_id')?.invalid && this.Form.get('sicgo_tipo_ocorrencia_id')?.touched
    );
  }

  get sicgo_tipo_categoria_idValidate() {
    return (
      this.Form.get('sicgo_tipo_categoria_id')?.invalid && this.Form.get('sicgo_tipo_categoria_id')?.touched
    );
  }

  
 
}
