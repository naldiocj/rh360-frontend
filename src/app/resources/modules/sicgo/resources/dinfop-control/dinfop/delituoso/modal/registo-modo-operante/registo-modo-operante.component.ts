import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopAntecedenteDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/antecedente_delitouso.service';
import { DelitousoModoOperanteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delitouso_modo_operante/delitouso-modo-operante.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-dinfop-registo-modo-operante',
  templateUrl: './registo-modo-operante.component.html',
  styleUrls: ['./registo-modo-operante.component.css']
})
export class RegistoModoOperanteComponent implements OnInit {
  registrationForm: FormGroup;
  @Input() modoId: any;
  @Input() delituosoId: any;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();
  isLoading: boolean = false;
  antecedenteId!: number;
  errorMessage: any;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  @Input() modooperante: any = null;

  public tipoCategorias: Array<Select2OptionData> = [];
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoOcorrencias: Array<Select2OptionData> = [];
  public objectoCrimes: Array<Select2OptionData> = [];

  public provincia: Array<Select2OptionData> = [];
  public municipio: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];

  constructor(
    private fb: FormBuilder,
    private tipoCategoriaService: TipoCategoriaService,
    private tipoOcorrenciaService: TipoCrimesService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private objectoCrimeService: ObjectoCrimeService,
    private modoOperanteS: DelitousoModoOperanteService) {
    this.registrationForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
      
    });
  }

  ngOnInit(): void {
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarTipicidadeOcorrencias();
    this.buscarObjectoCrime();
  
    // Observa mudanças no ID
    this.modoOperanteS.currentId.subscribe((modo) => {
      this.modooperante = modo;
  
      if (this.modooperante?.id) {
        this.getDataForm();
      }
    });
  }
  
  // Método unificado para obter o ID do modo operante
  getModoOperanteId(): number {
    return this.modooperante?.id || 0; // Retorna o id ou 0 caso não exista
  }
  
  

ngOnChanges(changes: SimpleChanges) {
   
    if (this.buscarId()) {
      this.getDataForm();
    }

  }
  getDataForm(): void {
    if (!this.modooperante) {
      console.warn('modooperante não está definido.');
      return;
    }
  
    this.registrationForm.patchValue({
      id: this.modooperante.id ?? null,
      titulo: this.modooperante.titulo ?? '',
      descricao: this.modooperante.descricao ?? '',
      
    });
  }
  
  

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      Object.values(this.registrationForm.controls).forEach(control => {
        control.markAsTouched();
        console.log('Não Funcionando', this.registrationForm.controls);
      });
      return;
    }

  this.isLoading = true;

     // Adiciona delituoso_id ao formulário
  const formData = { ...this.registrationForm.value, delituoso_id: this.getDelituosoId() };

  // Determina se será uma edição ou registro
  const request = this.getModoOperanteId()
    ? this.modoOperanteS.editar(formData, this.getModoOperanteId()) // Usando getModoOperanteId
    : this.modoOperanteS.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
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


  buscarObjectoCrime() {
    const options = {};
    this.objectoCrimeService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.objectoCrimes = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
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

  buscarMunicipio() {
    const options = {};
    this.municipioService
      .listar(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.municipio = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }



  buscarProvincia() {
    const options = {};
    this.provinciaService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.provincia = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }
  public handlerProvincias($event: any) {
    if (!$event) return

    const opcoes = {
      provincia_id: $event
    }

    this.municipioService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.municipio = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })

  }

  public selecionarMunicipio($event: any) {
    if (!$event) return
    this.distritoService.listarTodos({ municipio_id: $event }).pipe().subscribe({
      next: (respponse: any) => {
        this.distritos = respponse.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }


 

  buscarId(): number | null {
    return this.modooperante?.id as number;
  }

  getDelituosoId(): number | null {
    return this.delituosoId as number;
  }


  reiniciarFormulario(): void {
    this.registrationForm.reset();
  }
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }



  // Função para validação da data atual (não permite datas futuras)
getDateValidation() {
  const today = new Date();

  // Formata a data de hoje no formato yyyy-mm-dd
  const todayString = today.toISOString().split('T')[0];

  return { max: todayString };
}

}



