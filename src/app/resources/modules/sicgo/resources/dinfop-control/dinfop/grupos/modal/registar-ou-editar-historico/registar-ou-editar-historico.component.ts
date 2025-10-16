import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
 
import { GrupoModel } from '@resources/modules/sicgo/shared/model/grupo.model';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
 
@Component({
  selector: 'sicgo-dinfop-registar-ou-editar-historico',
  templateUrl: './registar-ou-editar-historico.component.html',
  styleUrls: ['./registar-ou-editar-historico.component.css']
})
export class RegistarOuEditarHistoricoComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  @Input() public grupo: any = null;
  @Output() eventRegistarOuEditGrupoModel = new EventEmitter<boolean>();

  public grupos: any[] = [];
  isLoading: boolean = false;
  simpleForm!: FormGroup;
  familiaDcrimes: any;
  provincias: any;

  public municipios: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public postos: Array<Select2OptionData> = [];


  constructor(
    private fb: FormBuilder,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private unidadeService: UnidadeService,
    private departamentoService: DepartamentoService,
    private dinfopService: DinfopGrupoDelitousoService,
  ){}

    ngOnInit(): void {
      this.buscarProvincia()
      this.buscarTipicidadeOcorrencias();
    }
  ngOnChanges():void{



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



  public buscarUnidade($event: any) {
    if (!$event) return
    const opcoes = {
      pessoajuridica_id: $event,
      entidade: 'Unidade',
    }
    this.departamentoService.listarTodos(opcoes).pipe(
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {

        this.unidades = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
      }
    })
  }



  buscarPostoPolicial($e: any) {
    if (!$e) return
    const options = { seccaoId: $e };

    this.unidadeService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.postos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
    });
  }

  createForm() {
    this.simpleForm = this.fb.group({
      tipo_veiculo_id: ['', [Validators.required]],
      marca_id: ['', [Validators.required]],
      modelo_id: ['', [Validators.required]],
      matricula: ['', [Validators.required]],
      chassi: ['', [Validators.required]],
      cor: ['#000000'],
      fornecedor: ['', [Validators.required]],
      numero_factura: ['', [Validators.required]],
      origem: ['', [Validators.required]],
      custo_meio: ['', [Validators.required]],
      estado_tecnico: ['', [Validators.required]],
      numero_motor: ['', [Validators.required]],
      ano_fabrico: ['', [Validators.required]],
      ano_aquisicao: ['', [Validators.required]],
      tipo_combustivel: ['', [Validators.required]],
    });
  }

  getDataForm() {
    this.simpleForm.patchValue({
      id: this.grupo.id,
      tipo_veiculo_id: this.grupo.tipo_veiculo_id,
      marca_id: this.grupo.marca_id,
      modelo_id: this.grupo.modelo_id,
      matricula: this.grupo.matricula,
      chassi: this.grupo.chassi,
      ano_fabrico: this.grupo.formatDate(this.grupo.ano_fabrico),
      ano_aquisicao: this.grupo.formatDate(
        this.grupo.ano_aquisicao
      ),
    });
  }

  onSubmit() {
    console.log('Funionando');
    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;
    const type = this.buscarId()
      ? this.dinfopService.editar(this.simpleForm.value, this.buscarId())
      : this.dinfopService.registar(this.simpleForm.value);
    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.removerModal();
        this.reiniciarFormulario();
        this.eventRegistarOuEditGrupoModel.emit(true);
      });
  }

  reiniciarFormulario() {
    this.simpleForm.reset();
    this.grupo = new GrupoModel();
  }

  buscarId(): number {
    return this.grupo?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}


