import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DelitousoModoOperanteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delitouso_modo_operante/delitouso-modo-operante.service';
import { DinfopAssociacaoModoOperanteGrupoGrupoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/dinfop_modo_operante/dinfop_associacao_modo_operante_grupo/dinfop-associacao-modo-operante-grupo-grupo.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-grupo-modo-operante-associacao',
  templateUrl: './modo-operante-associacao.component.html',
  styleUrls: ['./modo-operante-associacao.component.css']
})
export class ModoOperanteGrupoAssociacaoComponent implements OnInit {
  registrationForm: FormGroup;
  @Input() associacaoId: any=0;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();
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
    private modoOperanteS: DinfopAssociacaoModoOperanteGrupoGrupoService) {
    this.registrationForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
      data_hora_inicio: ['', Validators.required],
      data_hora_fim: ['', Validators.required],
      familia_crime_id: ['', Validators.required],
      tipo_crime_id: ['', Validators.required],
      tipicidade_crime_id: ['', Validators.required],
      sicgo_provincia_id: ['', Validators.required],
      sicgo_municipio_id: ['', Validators.required],
      meios_id: ['', Validators.required]
    });
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



    console.log('Funcionando', this.registrationForm.value);
    this.isLoading = true;

    // Adicionar delituoso_id ao formulário
    const formData = { ...this.registrationForm.value, associacao_id: this.getDelituosoId() };

    const request = this.buscarId()
      ? this.modoOperanteS.editar(formData, this.buscarId())
      : this.modoOperanteS.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
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


  reiniciarFormulario(): void {
    this.registrationForm.reset();
  }

  buscarId(): number | undefined {
    return this.antecedenteId;
  }

  getDelituosoId(): number {
    return this.associacaoId as number;
  }


  removerModal(): void {
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




