import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { GrupoModel } from '@resources/modules/sicgo/shared/model/grupo.model';
import { FormatarDataHelper } from '@core/helper/formatarData.helper'
import { pastOrPresentDateValidator } from '@resources/modules/sicgo/shared/datavalidadorkv';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
 
@Component({
  selector: 'sigop-registar-ou-editar-grupos',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  @Input() public grupo: any = null;
  @Output() eventRegistarOuEditGrupo = new EventEmitter<any>();

  public grupos: any[] = [];
  isLoading: boolean = false;
  sForm!: FormGroup;
  public Crimesobjecto: any;
  public familiaDcrimes: Array<Select2OptionData> = [];
  public provincias: Array<Select2OptionData> = [];
  public municipios: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public postos: Array<Select2OptionData> = [];
  public objectoCrimes: any = []
  public zonaLocalidades: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoOcorrencias: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  errorMessage: any;
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
 

  constructor(
    private fb: FormBuilder, 
    private distritoService: DistritoService,
    private unidadeService: UnidadeService,
    private departamentoService: DepartamentoService,
    private dinfopService: DinfopGrupoDelitousoService,
    private tipoOcorrenciaService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private objectoCrimeService: ObjectoCrimeService, 
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
  ){this.createForm();}

    ngOnInit(): void {
      this.buscarProvincia()
      this.buscarTipicidadeOcorrencias();
      this.buscarProvincia();
      this.buscarObjectoCrime();
     
    }

    ngOnChanges() {
      this.createForm();
      this.buscarProvincia()
      this.buscarTipicidadeOcorrencias();
      if (this.buscarId()) {
        this.getDataForm();
      }
    }

  buscarTipicidadeOcorrencias() {
    this.tipicidadeOcorrenciaService
      .listarTodos({ page: 1, perPage: 3 })
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any) => {
          this.familiaDcrimes = response.data.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

        },
      });
  }


  buscarProvincia() {
    this.provinciaService
    .listarTodos({ page: 1, perPage: 18})
    .pipe(finalize(() => {}))
    .subscribe({
      next: (response: any) => {
        this.provincias = response.data.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

      },
    })
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
        this.municipios = response.map((item: any) => ({ id: item.id, text: item.nome }))
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



 

  createForm() {
    this.sForm = this.fb.group({
      nome: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      numero_integrante: ['', [Validators.required]],
      local_concentracao: ['', [Validators.required]],
      local_atuacao: ['', [Validators.required]],
      meios_crimes_id: ['', [Validators.required]],
      provincia_id: ['', [Validators.required]],
      municipio_id: ['', [Validators.required]],
      familia_crime_id: ['', [Validators.required]],
      tipo_crime_id: ['', [Validators.required]],
      tipicidade_crime_id: ['', [Validators.required]],
      data_criado: ['', [Validators.required, pastOrPresentDateValidator()]],
    });
    
  }

  getDataForm() {
    this.sForm.patchValue({
      id: this.grupo.id,
      nome: this.grupo.nome,
      sigla: this.grupo.sigla,
      numero_integrante: this.grupo.numero_integrante, // adicionar este campo
      provincia_id: this.grupo.provincia_id,
      municipio_id: this.grupo.municipio_id,
      tipicidade_crime_id: this.grupo.tipicidade_ocorrencia_id,
      data_criado: this.grupo.data_criado,  
    });
  }
  

  onSubmit() {
    if (this.sForm.invalid) {
      Object.keys(this.sForm.controls).forEach(key => {
        const control = this.sForm.get(key);
        control?.markAsTouched();
      });
      console.log('Formulário inválido', this.sForm.controls);
    } else {
      console.log('Formulário válido', this.sForm.value);
      this.isLoading = true;
  
      const id = this.buscarId(); // Chama uma vez
      const type = id
        ? this.dinfopService.editar(this.sForm.value, id)
        : this.dinfopService.registar(this.sForm.value);
  
      type.pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: () => {
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditGrupo.emit(true);
        },
        error: (err: any) => {
          console.error('Erro ao registrar ou editar:', err);
          // Exibir um alerta ou notificação
        }
      });
    }
  }
  

  reiniciarFormulario() {
    this.sForm.reset();
    this.grupo = new GrupoModel()
  }

  buscarId(): number {
    return this.grupo?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
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
}
