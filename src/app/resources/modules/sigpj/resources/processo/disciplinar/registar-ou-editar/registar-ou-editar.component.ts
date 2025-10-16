import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';

import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { Funcionario } from '@shared/models/Funcionario.model';
import { DisciplinarModel } from '@resources/modules/sigpj/shared/model/disciplinar.model';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { PatenteService } from '@core/services/Patente.service';

@Component({
  selector: 'sigpj-registar-ou-editar-model',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})

export class RegistarOuEditarComponent implements OnChanges {

  @Input() novoProcesso: any = null
  @Output() eventRegistarOuEditDisciplinarModel = new EventEmitter<boolean>()

  arrayFiles!: File[]
  totalBase: number = 0
  disciplinarForm!: FormGroup

  public funcionarios: Funcionario[] = []
  public pagination = new Pagination();

  public isLoading: boolean = false
  public isLoadingForm: boolean = false
  public submitted: boolean = true

  public orgaos: Array<Select2OptionData> = [];
  public provimentos: Array<any> = []
  public funcionario: any
  public mostrarCarreira = false;
  public patenteClasses: Array<Select2OptionData> = []
  public patentes: Array<Select2OptionData> = []
  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' }
  ]

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: "",
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    dashboard: false
  }

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  constructor(
    private fb: FormBuilder,
    private disciplinar: DisciplinarService,
    private funcionarioServico: FuncionarioService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private patenteService: PatenteService,
    private formatarDataHelper: FormatarDataHelper
  ) { }

  ngOnChanges(): void {
    this.createForm()
    this.buscarFuncionarios()
    this.buscarOrgaos()
    this.buscarPatentes(1)

    if (this.buscarId()) {
      this.getDataForm();
      this.settarAcusado()
    }

  }

  createForm() {
    this.disciplinarForm = this.fb.group({
      id: [''],
      orgao_id: ['', [Validators.required]],
      numero_oficio: ['', [Validators.required]],
      data_oficio: ['', [Validators.required]],
      infracao: ['', [Validators.required]],
      numero_processo: ['', [Validators.required]]
    })
  }

  getDataForm() {
    this.disciplinarForm.patchValue({
      id: this.novoProcesso.id,
      orgao_id: this.novoProcesso.orgao_id,
      infracao: this.novoProcesso.infracao,
      numero_oficio: this.novoProcesso.numero_oficio,
      data_oficio: this.formatarDataHelper.formatDate(this.novoProcesso.data_oficio),
      numero_processo: this.novoProcesso.numero_processo
    });

    this.funcionario = this.novoProcesso
  }

  buscarOrgaos() {
    this.direcaoOuOrgaoService.listarTodos("orgao").pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe((response) => {
        this.orgaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome_completo,
        }));
      })
  }

  buscarFuncionarios() {
    this.isLoading = true;
    this.funcionarioServico
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {

        this.funcionarios = response.data
        console.log(this.funcionarios);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  private buscarPatentes($event: any = null) {
    if (!$event || $event == 'null') return

    const options = {
      // sigpq_tipo_carreira_id: $event,
    }

    this.patenteService.listar(options)
      .subscribe((response: any): void => {
        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))
        console.log(aux);

        this.patentes = []
        this.patentes.push({
          id: 'null',
          text: 'Todos'
        })
        this.patentes.push(...aux)
      })
  }

  get dataActual() {
    return this.formatarDataHelper.formatDate(new Date())
  }

  registar() {

    this.isLoading = false

    // this.buscarId() ? this.canCode = 'disciplinar-update' : this.canCode = 'disciplinar-store';

    // const code = {
    //   permission: this.canCode
    // }
    // const result1 = this.guardRole.canActivate(this.canValidation.getRoute(code), this.canValidation.getState()).valueOf()
    // const result2 = this.guardUser.canActivate(this.canValidation.getRoute(code), this.canValidation.getState())
    // if (result1 == false || result2 == false) {
    //   this.removerModal()
    //   return
    // }

    if (this.disciplinarForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const formData = new FormData()
    formData.append('funcionario_id', `${this.funcionario.id}`)

    const newDisciplinar = this.disciplinarForm.value;

    if (this.arrayFiles && this.arrayFiles.length > 0) {
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
    } else {
      formData.append('files[]', '');
    }

    Object.keys(newDisciplinar).forEach(key => {
      formData.append(key, newDisciplinar[key]);
    });

    const operation = this.buscarId()
      ? this.disciplinar.editar(formData, this.buscarId())
      : this.disciplinar.registar(formData);

    operation.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(() => {
      this.removerModal();
      this.reiniciarFormulario();
      this.eventRegistarOuEditDisciplinarModel.emit(true);
      this.funcionario.id = undefined;
      this.disciplinarForm.reset();
    });

  }

  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

  reiniciarFormulario() {
    this.disciplinarForm.reset()
    this.novoProcesso = new DisciplinarModel()
  }


  buscarId(): number {
    return this.novoProcesso?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionarios();
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'patenteId') {
      this.filtro.patenteId = $e;
    } else if (key == 'tipoVinculoId') {
      this.filtro.tipoVinculoId = $e;
    } else if (key == 'tipoOrgaoId') {
      this.filtro.tipoOrgaoId = $e;
      this.filtro.orgaoId = 'null';
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    } else if (key == 'genero') {
      this.filtro.genero = $e;
    } else if (key == 'patenteClasse') {
      this.filtro.patenteClasse = $e;
      // this.buscarPatentes($e)
    } else if (key == 'situacaoId') {
      // this.filtro.situacaoId = $e
      // this.selecionarSituacaoLaboral($e)
    } else if (key == 'estadoId') {
      this.filtro.estadoId = $e
    }
    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarFuncionarios();
  }

  selectedFuncionario(item: any) {
    this.funcionario = item
  }

  settarAcusado() {
    this.disciplinar.verUm(this.buscarId())
      .subscribe(item => {
        this.funcionarioServico.buscarUm(item.funcionario_id)
          .subscribe(response => {
            this.funcionario = response
          })
      })
  }
}
