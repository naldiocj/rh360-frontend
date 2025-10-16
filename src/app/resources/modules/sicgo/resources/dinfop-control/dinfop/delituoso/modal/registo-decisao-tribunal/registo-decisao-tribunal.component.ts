import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
import { DelitousoTribulanResultadoProcessoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_tribulan_resultado_processo.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'dinfop-registo-decisao-tribunal',
  templateUrl: './registo-decisao-tribunal.component.html',
  styleUrls: ['./registo-decisao-tribunal.component.css']
})
export class RegistoDecisaoTribunalComponent implements OnInit { 
  @Input() DelituosoOrigem: any = {};
 
  @Input() delituosoId: any = 0; 
  @Input() ocorrenciaId: any = 0;
@Output() eventRegistarOuEditar = new EventEmitter<any>();

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public submitted: boolean = false;
  public isLoading: boolean = false;
  public formErrors: any;
  public Form: FormGroup;
  params: any;
  delitouso: any;

  public tipoOcorrencias: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];

  constructor(
    private tipoOcorrenciaService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private delitousoTribulanResultadoProcessoService: DelitousoTribulanResultadoProcessoService,
    private dinfopDelituosoOrigemService:DinfopDelituosoOrigemService,
    private fb: FormBuilder
  ) {
    this.Form = this.fb.group({
      resultado_processo: ['', [Validators.required]],
      numero_processo: ['', [Validators.required]], // Adiciona o campo observacao
      data_julgamento: ['', [Validators.required]], // Adiciona o campo observacao
      julgado_pelo_crime: ['', [Validators.required]], // Adiciona o campo observacao
      extrato: [null],
    });
  }

  ngOnInit(): void {
    this.buscarTipicidadeOcorrencias();
    if (this.params?.getId || this.params?.getInfo) {
      this.getDataForm();
    }

    this.dinfopDelituosoOrigemService.delituoso$.subscribe(data => {
      if (data) {
        this.DelituosoOrigem = data;
        
      }
    });
  }

  ngOnChanges(): void {
  
    this.buscarTipicidadeOcorrencias();
    if (this.buscarId()) {
      this.getDataForm();
    }
  }

  ngOnDestroy(): void { }

  createForm(): void {
    this.Form = this.fb.group({
      resultado_processo: ['', [Validators.required]],
      numero_processo: ['', [Validators.required]], // Adiciona o campo observacao
      data_julgamento: ['', [Validators.required]], // Adiciona o campo observacao
      julgado_pelo_crime: ['', [Validators.required]], // Adiciona o campo observacao
      extrato: [null],
    });
  }

  getDataForm(): void {
    if (!this.delitouso) return; // Verifique se delitouso está definido

    this.Form.patchValue({
      resultado_processo: this.delitouso.resultado_processo, // Preenche o campo observacao se disponível
      data_julgamento: this.delitouso.data_julgamento, // Preenche o campo observacao se disponível
      julgado_pelo_crime: this.delitouso.julgado_pelo_crime,  // Preenche o campo observacao se disponível
      extrato: this.delitouso.extrato  // Preenche o campo observacao se disponível
    });
  }
 
  onSubmit(): void {
    if (this.Form.invalid) {
      // Marca todos os controles do formulário como tocados para exibir validações
      Object.values(this.Form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
  
    this.isLoading = true;
  
    // Obter os dados do formulário
    const formData = { ...this.Form.value };
  
    // Adicionar os dados do DelituosoOrigem ao formulário
    if (this.DelituosoOrigem) {
      formData.delituoso_id = this.DelituosoOrigem.delituoso_id;
      formData.origem_id = this.DelituosoOrigem.origem_id; // Se necessário
    }
  
    // Verificar se estamos editando ou registrando
    const request = this.buscarId()
      ? this.delitousoTribulanResultadoProcessoService.editar1(formData, this.buscarId())
      : this.delitousoTribulanResultadoProcessoService.registar(formData);
  
    // Enviar a requisição
    request.pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          setTimeout(() => {
            window.location.reload();
          }, 400);
          this.removerModal(); // Fecha o modal
          this.reiniciarFormulario(); // Reseta o formulário
          this.eventRegistarOuEditar.emit(true); // Emite evento para atualização
        },
        (error) => {
          console.error('Erro ao registrar ou editar:', error);
        }
      );
  }
  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.Form.get(campo)?.setValue(file);
    this.Form.get(campo)?.updateValueAndValidity();
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

  getOcorrenciaId(): number {
    return this.ocorrenciaId as number;
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

