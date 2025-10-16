import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { Select2OptionData } from 'ng-select2';

import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { PaisService } from '@core/services/Pais.service';

import { TipoOutroDadoModel } from '@resources/modules/sigpq/shared/model/tipo-outro-dado.model';

import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation';
import { TipoSanguineoService } from '@core/services/config/TipoSanguineo.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { CursoService } from '@core/services/config/Curso.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';

declare var $: any;

@Component({
  selector: 'app-sigpq-mobilidade-orgao-central',
  templateUrl: './orgao-central.component.html',
  styleUrls: ['./orgao-central.component.css']
})
export class OrgaoCentralComponent implements OnInit {

  @Input() formErrors: any
  @Input() options: any
  @Input() simpleForm: any

  cursos: Array<Select2OptionData> = []
  paises: Array<Select2OptionData> = []
  provincias: Array<Select2OptionData> = []
  estadoCivils: Array<Select2OptionData> = []
  tipoSanguineos: Array<Select2OptionData> = []
  tipoHabilitacaoLiterarias: Array<Select2OptionData> = []

  public formatAccept = ['.png', '.jpg', '.jpeg']
  public validarDataNascimento = this.formatarDataHelper.getPreviousDate(18, 0, 0, 'yyyy-MM-dd')

  tipoOutrosDados: TipoOutroDadoModel[] = [];

  constructor(
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,
    public funcionarioValidacao: FuncionarioValidation,
    private estadoCivilService: EstadoCivilService,
    private formatarDataHelper: FormatarDataHelper,
    private tipoSanguineo: TipoSanguineoService,
    private provinciaService: ProvinciaService,
    private cursoService: CursoService,
    private paisService: PaisService,
  ) {
    this.formErrors = this.funcionarioValidacao.errorMessages
  }

  ngOnInit(): void {
    this.listarPais()
    this.listarCursos()
    this.listarProvincias()
    this.buscarEstadoCivil()
    this.listarTipoSanguineo()
    this.buscarTipoHabilitacaoLiteraria()
  }

  get f() {
    return this.simpleForm.controls
  }

  get validaForm() {
    return this.simpleForm.controls
  }

  uploadFile(event: any, campo: string): void {
    let file = event.target.files[0];
    this.simpleForm.get(campo).value = file;
    this.simpleForm.get(campo).updateValueAndValidity();
  }

  listarCursos() {
    this.cursoService.listarTodos({}).pipe(
      finalize(() => {
      })
    ).subscribe((response) => {
      this.cursos = response.map((item: any) => ({ id: item.id, text: item.nome }))
    });
  }

  listarProvincias() {
    this.provinciaService.listarTodos({}).pipe(
      finalize(() => {
      })
    ).subscribe((response) => {
      this.provincias = response.map((item: any) => ({ id: item.id, text: item.nome }))
    });
  }

  listarTipoSanguineo(): void {
    const opcoes = {}
    this.tipoSanguineo.listarTodos(opcoes)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe((response) => {
        this.tipoSanguineos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  listarPais(): void {
    const opcoes = {}
    this.paisService.listarTodos(opcoes)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe((response) => {
        this.paises = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  buscarEstadoCivil(): void {
    const opcoes = {}
    this.estadoCivilService.listar(opcoes)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe((response) => {
        this.estadoCivils = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  buscarTipoHabilitacaoLiteraria(): void {
    const opcoes = {}
    this.tipoHabilitacaoLiterariaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoHabilitacaoLiterarias = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

}
