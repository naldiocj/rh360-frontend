import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';

import { PatenteService } from '@core/services/Patente.service';
import ProvimentoHelper from '@resources/modules/sigpq/core/helper/Provimento.helper';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';

import { Select2OptionData } from 'ng-select2';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
  // modelos: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private actoProgressaoService: ActoProgressaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private provimentoService: ProvimentoService,
    private tipoCargoService: TipoCargoService,
    private tipoFuncaoService: TipoFuncaoService,
    private formatarDataHelper: FormatarDataHelper,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.buscarPatente();
    this.buscarActoProgressao();
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
      if (
        key != 'pessoas_id' &&
        key != 'anexo' &&
        key != 'anexo_nomeacao' &&
        value != undefined
      ) {
        data.append(key, (value as string).toString());
      }
    });

    data.append('anexo', this.simpleForm.get('anexo')?.value);
    data.append('anexo_nomeacao', this.simpleForm.get('anexo_nomeacao')?.value);
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
      data_despacho_nomeacao: [null],
      numero_despacho_nomeacao: [null],
      // numero_ordem_nomeacao: [null, [Validators.pattern('^[0-9]*$')]],
      // pessoa_id: [this.pessoaId, Validators.required],
      situacao: ['actual', Validators.required],
      anexo: [null, Validators.required],
      anexo_nomeacao: [null],
    });
  }
  // createForm() {
  //   this.simpleForm = this.fb.group({
  //     patente_id: [null, [Validators.required]],
  //     numero_ordem: [null, [Validators.required]],
  //     // numero_despacho: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
  //     anexo: [null, Validators.required],
  //     anexo_nomeacao: [null],
  //     sigpq_acto_progressao_id: ['', [Validators.required]],
  //     sigpq_acto_nomeacao_id: [null],
  //     sigpq_tipo_cargo_id: [null],
  //     sigpq_tipo_funcao_id: [null],
  //     data_ordem: [null, Validators.required],
  //     // data_despacho: [null, Validators.required],
  //     // data_ordem_nomeacao: [null],
  //     data_despacho_nomeacao: [null],
  //     numero_despacho_nomeacao: [null],
  //     // numero_ordem_nomeacao: [null, [Validators.pattern('^[0-9]*$')]],
  //     // pessoa_id: [this.pessoaId, Validators.required],
  //     pessoas_id: this.fb.array([]),
  //     situacao: ['actual', Validators.required],
  //   });
  // }

  public get pessoasId() {
    return this.emTempos?.id;
  }
  buscarPatente(): void {
    // const opcoes = { patente_em_tempo_id: this.getEmTempoPatenteId }
    this.patenteService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  buscarActoNomeacao(): void {
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

  onSubmit() {
    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.simpleForm.value.pessoas_id = this.emTempos.map(
      (agente: any) => agente.id
    );

    const data: FormData = this.formData();

    this.provimentoService
      .registar(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.removerModal();
        this.reiniciarFormulario();
        this.eventRegistarPromocaoModel.emit(true);
      });
  }

  reiniciarFormulario() {
    this.simpleForm.reset();
    this.emTempos = [];
    this.simpleForm.value.pessoas_id = [];
    this.simpleForm.get('anexo')?.setValue(null);
    this.simpleForm.patchValue({
      situacao: 'actual',
    });
  }

  buscarId(): number {
    return this.em_tempo?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  // setEmTempo(item: any) {
  //   this.emTempo = item
  // }

  // get getEmTempoPatenteId() {
  //   return this.emTempo?.patente_id
  // }

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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
