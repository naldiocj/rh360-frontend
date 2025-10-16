import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';

import { PatenteService } from '@core/services/Patente.service';
import ProvimentoHelper from '@resources/modules/sigpq/core/helper/Provimento.helper';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';
// import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';

import { Select2OptionData } from 'ng-select2';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sigpq-promover-modal',
  templateUrl: './promover-modal.component.html',
  styles: [
    `
      /deep/ .ng-dropdown-panel .scroll-host {
        max-height: 120px !important;
      }
    `,
  ],
})
export class PromoverModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() emTempos: any = null;
  @Output() eventRegistarPromocaoModel = new EventEmitter<boolean>();
  public tituloPatente: string = '""';
  public patenteClasse: any = {};
  public tituloClasse: string = '""';
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public simpleForm!: any;

  isLoading: boolean = false;
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  public em_tempo: any;
  public destroy$ = new Subject<void>();
  public patentes: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public _patentes: Array<Select2OptionData> = [];
  public actoProgressaos: Array<Select2OptionData> = [];
  public actoNomeacaos: Array<Select2OptionData> = [];
  public tipoFuncaos: Array<Select2OptionData> = [];
  public tipoCargos: Array<Select2OptionData> = [];

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private actoProgressaoService: ActoProgressaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private propostaService: PropostaProvimentoService,
    private tipoCargoService: TipoCargoService,
    private tipoFuncaoService: TipoFuncaoService,
    private formatarDataHelper: FormatarDataHelper,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.buscarPatente();
    this.buscarActoNomeacao();
    this.buscarTipoCargo();
    this.buscarTipoFuncao();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['emTempos'].currentValue != changes['emTempos'].previousValue &&
      this.emTempos != null
    ) {
      this.filtarClasse(this.emTempos);
    }
  }

  private buscarTipoFuncao(): void {
    this.tipoFuncaoService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoFuncaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }
  buscarTipoCargo(): void {
    const opcoes = {};
    this.tipoCargoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCargos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }
  private formData() {
    const data: FormData = new FormData();

   
    Object.entries(this.simpleForm.value).forEach(([key, value]) => {
      if (key !== 'pessoas_id' && value != undefined)
        data.append(key, (value as string).toString());
    });
    data.append('pessoas_id', this.simpleForm.value?.pessoas_id);

   
    return data;
  }
  private createForm() {
    this.simpleForm = this.fb.group({
      patente_id: [null, [Validators.required]],
      sigpq_tipo_carreira_id: [null, [Validators.required]],
      sigpq_acto_progressao_id: ['', [Validators.required]],
      sigpq_acto_nomeacao_id: [null],
      sigpq_tipo_cargo_id: [null],
      pessoas_id: this.fb.array([]),
      estado: ['P', Validators.required],
    });
  }

  public get pessoasId() {
    return this.emTempos?.id;
  }
  buscarPatente(): void {
    this.patenteService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this._patentes = this.patentes;
      });
  }

  private buscarActoProgressao(options: any = null): void {
    const opcoes = {
      ...options,
    };
    this.actoProgressaoService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          // this.disabilitarCampos();
        })
      )
      .subscribe((response: any): void => {
        this.actoProgressaos = response
          .filter((item: any) => !this.utilService.isPatenteamento(item.nome))
          .map((item: any) => ({ id: item.id, text: item.nome }));
      });
  }
  private buscarActoNomeacao(): void {
    const opcoes = {};
    this.actoNomeacaoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.actoNomeacaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  public onSubmit() {
    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.simpleForm.value.pessoas_id = this.emTempos.map(
      (agente: any) => agente.id
    );

    const data: FormData = this.formData();
    this.propostaService
      .registar(data)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.removerModal();
        this.reiniciarFormulario();
        this.resetarEmTempos();
        this.eventRegistarPromocaoModel.emit(true);
      });
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.value.pessoas_id = [];
    this.simpleForm.patchValue({
      estado: 'P',
    });
  }
  private resetarEmTempos() {
    this.emTempos = null;
  }

  buscarId(): number {
    return this.em_tempo?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public uploadFilePDF(evt: Event, key: string) {
    const { files } = evt.target as HTMLInputElement;

    const file: File | Blob = files?.item(0) as File;
    this.simpleForm.get(key)?.setValue(file);
    this.simpleForm.get(key)?.updateValueAndValidity();
  }
  public handlerTipo($event: string | string[]) {
    if (!$event) return;
    const [acto] = this.actoProgressaos.filter(
      (item: any) => item.id == $event
    );
  }

  public handlerTipoPatente($event: string | string[]) {
    const [tipoActo]: { id: string; text: string }[] =
      this.actoProgressaos.filter((item) => item.id == $event);
    this.tituloPatente = '""';

    if (!tipoActo) return;

    const { text }: { text: string } = tipoActo;
    this.tituloPatente = this.utilService.getActoVerbos(text)!;
    if (this.utilService.isPromocao(text) || this.utilService.isGraducao(text))
      this.filtarPosto(this.emTempos);
    else if (
      this.utilService.isDespromocao(text) ||
      this.utilService.isDesgraducao(text)
    )
      this.filtarPosto(this.emTempos, false);
    else {
      this._patentes = [];
      return;
    }
  }

  private filtarPosto(efectivos: any[], ascender: boolean = true) {
    this._patentes = [];

    const patentesEfectivos = ProvimentoHelper.buscarPatentEfectivos(efectivos);

    let patentesValidas = ProvimentoHelper.buscarPatentesValidaPorPatente(
      efectivos,
      this.patentes
    );

    if (patentesValidas.length === 0) {
      console.error('Nenhuma patente válida encontrada.');
      return;
    }
    if (ascender) {
      patentesValidas = ProvimentoHelper.ordemPatente(patentesValidas);
      const patenteMaisAlta = patentesValidas[0];

      const patenteSeguinte = ProvimentoHelper.patenteSeguinte(
        this.patentes,
        patentesValidas
      );

      if (patenteSeguinte) {
        this._patentes.push(patenteSeguinte);
      } else {
        this._patentes.push(patenteMaisAlta);
      }
    } else {
      patentesValidas = ProvimentoHelper.ordemPatente(patentesValidas, false);
      const patenteMaisBaixa = patentesValidas[0];

      const patenteAnterior = ProvimentoHelper.patenteAnterior(
        this.patentes,
        patentesValidas
      );

      if (patenteAnterior) {
        this._patentes.push(patenteAnterior);
      } else {
        this._patentes.push(patenteMaisBaixa);
      }
    }

    this.patenteService
      .listar({})
      .pipe(
        finalize((): void => {
          this.tituloClasse = '""';
          this.tituloClasse = 'Classe de ' + this.patenteClasse.classe;
          this.classes = [];
          this.classes.push({
            id: this.patenteClasse.sigpq_tipo_carreira_id,
            text: this.patenteClasse.classe,
          });

          this.simpleForm.patchValue({
            patente_id: this._patentes[0]?.id,
            sigpq_tipo_carreira_id: this.patenteClasse?.sigpq_tipo_carreira_id,
          });
          this.simpleForm.get('patente_id')?.updateValueAndValidity();
          this.simpleForm
            .get('sigpq_tipo_carreira_id')
            ?.updateValueAndValidity();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.patenteClasse = response.find(
            (item: any) => item.id == this._patentes[0].id
          );
        },
      });
  }

  private disabilitarCampos() {
    this.simpleForm.get('patente_id').disable();
    this.simpleForm.get('patente_id').updateValueAndValidity();
    this.simpleForm.get('sigpq_tipo_carreira_id').disable();
    this.simpleForm.get('sigpq_tipo_carreira_id').updateValueAndValidity();
  }

  private filtarClasse(efectivos: any[]) {
    const classeSuperior = ProvimentoHelper.buscarClasseSuperior(efectivos);

    const options: { classeAcima: boolean; classeAbaixo: boolean } = {
      classeAcima: false,
      classeAbaixo: true,
    };
    if (classeSuperior) {
      options.classeAbaixo = false;
      options.classeAcima = true;
    }

    this.buscarActoProgressao(options);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
