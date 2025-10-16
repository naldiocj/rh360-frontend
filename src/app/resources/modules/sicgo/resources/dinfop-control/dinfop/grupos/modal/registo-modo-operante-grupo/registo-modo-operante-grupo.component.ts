import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service'; 
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopGrupoModoOperanteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/dinfop_modo_operante/dinfop_grupo_modo_operante/dinfop-grupo-modo-operante.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-dinfop-registo-modo-operante-grupo',
  templateUrl: './registo-modo-operante-grupo.component.html',
  styleUrls: ['./registo-modo-operante-grupo.component.css']
})
export class RegistoModoOperanteGrupoComponent implements OnInit {
  registrationForm: FormGroup;
  @Input() grupoId: any=0;
  @Input() grupo_Id: number | undefined;
  @Output() eventRegistarOuEditar  = new EventEmitter<any>();
 
  isLoading: boolean = false;
  antecedenteId!: number;
  errorMessage: any;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  modooperante: any;

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
    private modoOperanteS: DinfopGrupoModoOperanteService) {
    this.registrationForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.maxLength(255)]], 
      familia_crime_id: ['', Validators.required],
      tipo_crime_id: ['', Validators.required],
      tipicidade_crime_id: ['', Validators.required],
      sicgo_provincia_id: ['', Validators.required],
      sicgo_municipio_id: ['', Validators.required],
      meios_id: ['', Validators.required],
      data_hora_inicio: ['', [Validators.required, this.dateValidator]],
      data_hora_fim: ['', [Validators.required, this.dateValidator]]
    }, { validators: this.dateRangeValidator });
  }
 
  ngOnInit(): void {
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarTipicidadeOcorrencias()
    this.buscarObjectoCrime()
    // A lógica de inicialização pode ser mantida aqui, se necessário
  }



  getDataForm(): void {
    if (!this.modooperante) return; // Verifique se delitouso está definido

    this.registrationForm.patchValue({
      titulo:  this.modooperante.titulo,
      descricao: this.modooperante.descricao,

      data_hora_inicio: this.modooperante.data_hora_inicio, // Preenche o campo observacao se disponível
      data_hora_fim: this.modooperante.data_hora_fim, // Preenche o campo observacao se disponível

      familia_crime_id: this.modooperante.familia_crime_id,  // Preenche o campo observacao se disponível
      tipo_crime_id: this.modooperante.tipo_crime_id,  // Preenche o campo observacao se disponível
      tipicidade_crime_id: this.modooperante.tipicidade_crime_id,  // Preenche o campo observacao se disponível

      sicgo_provincia_id: this.modooperante.sicgo_provincia_id,  // Preenche o campo observacao se disponível
      sicgo_municipio_id: this.modooperante.sicgo_municipio_id,  // Preenche o campo observacao se disponível
    
      meios_id: this.modooperante.meios_id,  // Preenche o campo observacao se disponível
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

    // Adicionar delituoso_id ao formulário
    const formData = { ...this.registrationForm.value, grupo_id: this.getgrupoId() };

    const request = this.buscarId()
      ? this.modoOperanteS.editar(formData, this.buscarId())
      : this.modoOperanteS.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 400);
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditar.emit(true);
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


  
  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
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


  reiniciarFormulario(): void {
    this.registrationForm.reset();
  }

  buscarId(): number | undefined {
    return this.grupo_Id;
  }

  getgrupoId(): number {
    return this.grupoId as number;
  }


  removerModal(): void {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

// Validador para garantir que as datas estão em ordem correta
private dateRangeValidator(group: AbstractControl): { [key: string]: any } | null {
  const startDate = group.get('data_hora_inicio')?.value;
  const endDate = group.get('data_hora_fim')?.value;

  return new Date(startDate) > new Date(endDate) ? { dateRangeInvalid: true } : null;
}

// Validador para uma única data
private dateValidator(control: AbstractControl): { [key: string]: any } | null {
  const date = new Date(control.value);
  return isNaN(date.getTime()) ? { invalidDate: true } : null;
}

  // Função para validação da data atual (não permite datas futuras)
getDateValidation() {
  const today = new Date();

  // Formata a data de hoje no formato yyyy-mm-dd
  const todayString = today.toISOString().split('T')[0];

  return { max: todayString };
}

}



