import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';

import { PatenteService } from '@core/services/Patente.service';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';
// import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';

import { Select2OptionData } from 'ng-select2';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sigpq-promover-modal',
  templateUrl: './promover-modal.component.html',
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class PromoverModalComponent implements OnInit, OnDestroy {

  @Input() emTempos: any = null
  @Output() eventRegistarPromocaoModel = new EventEmitter<boolean>()

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  public simpleForm!: any

  isLoading: boolean = false
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  public em_tempo: any
  public destroy$ = new Subject<void>()
  public patentes: Array<Select2OptionData> = []
  public _patentes: Array<Select2OptionData> = []
  public actoProgressaos: Array<Select2OptionData> = []
  public actoNomeacaos: Array<Select2OptionData> = []
  public tipoFuncaos: Array<Select2OptionData> = []
  public tipoCargos: Array<Select2OptionData> = []
  // modelos: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private actoProgressaoService: ActoProgressaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private propostaService: PropostaProvimentoService,
    private tipoCargoService: TipoCargoService,
    private tipoFuncaoService: TipoFuncaoService,
    private formatarDataHelper: FormatarDataHelper
  ) { }


  ngOnInit(): void {
    this.createForm()
    this.buscarPatente()
    this.buscarActoProgressao()
    this.buscarActoNomeacao()
    this.buscarTipoCargo()
    this.buscarTipoFuncao()
  }

  private buscarTipoFuncao(): void {
    this.tipoFuncaoService.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.tipoFuncaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }
  buscarTipoCargo(): void {
    const opcoes = {}
    this.tipoCargoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoCargos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })

  }
  private formData() {
    const data: FormData = new FormData()
    data.append('patente_id', this.simpleForm.get('patente_id')?.value)
    data.append('sigpq_acto_progressao_id', this.simpleForm.get('sigpq_acto_progressao_id')?.value)
    data.append('sigpq_acto_nomeacao_id', this.simpleForm.get('sigpq_acto_nomeacao_id')?.value)
    data.append('sigpq_tipo_cargo_id', this.simpleForm.get('sigpq_tipo_cargo_id')?.value)
    data.append('pessoas_id', this.simpleForm.value?.pessoas_id)
    data.append('estado', this.simpleForm.get('estado')?.value)

    return data
  }
  createForm() {
    this.simpleForm = this.fb.group({
      patente_id: [null, [Validators.required]],
      sigpq_acto_progressao_id: ['', [Validators.required]],
      sigpq_acto_nomeacao_id: [null],
      sigpq_tipo_cargo_id: [null],

      pessoas_id: this.fb.array([]),
      estado: ['P', Validators.required]
    });
  }

  public get pessoasId() {
    return this.emTempos?.id
  }
  buscarPatente(): void {
    // const opcoes = { patente_em_tempo_id: this.getEmTempoPatenteId }
    this.patenteService.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this._patentes=this.patentes
      })
  }

  buscarActoProgressao(): void {
    const opcoes = {}
    this.actoProgressaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.actoProgressaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }
  buscarActoNomeacao(): void {
    const opcoes = {}
    this.actoNomeacaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.actoNomeacaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true
    this.simpleForm.value.pessoas_id = this.emTempos.map((agente: any) => agente.id)


    const data: FormData = this.formData()
    this.propostaService.registar(data)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {
        this.removerModal()
        this.reiniciarFormulario()
        this.eventRegistarPromocaoModel.emit(true)
      })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
    this.emTempos = []
    this.simpleForm.value.pessoas_id = []
    this.simpleForm.get('anexo')?.setValue(null);
    this.simpleForm.patchValue({
      situacao: 'actual'
    })
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

    const { files } = evt.target as HTMLInputElement

    const file: File | Blob = files?.item(0) as File
    this.simpleForm.get(key)?.setValue(file)
    this.simpleForm.get(key)?.updateValueAndValidity()

  }
  public handlerTipo($event: string | string[]) {
    if($event=='1')this.patenteSeguinte(this.emTempos[0].patente_nome)
    else if($event=='4') this.patenteAnterior(this.emTempos[0].patente_nome)
    else this._patentes=this.patentes
    if (!$event)
      return
    const [acto] = this.actoProgressaos.filter((item: any) => item.id == $event)



  }

  patenteSeguinte(patente: string) {
    this._patentes=[]
    const indexAtual = this.patentes.findIndex((item) => item.text === patente);

    if (indexAtual === -1) {
      console.error('Patente não encontrada.');
      return;
    }

    // Pega a patente atual
    const patenteAtual = this.patentes[indexAtual];

    // Verifica se existe uma patente seguinte
    const patenteSeguinte = this.patentes[indexAtual - 1] || null;

    this._patentes.push(patenteAtual)
    this._patentes.push(patenteSeguinte)
  }


  patenteAnterior(patente:string)
  {
    this._patentes=[]
    const indexAtual = this.patentes.findIndex((item) => item.text === patente);

    if (indexAtual === -1) {
      console.error('Patente não encontrada.');
      return;
    }

    // Pega a patente atual
    const patenteAtual = this.patentes[indexAtual];

    // Verifica se existe uma patente seguinte
    const patenteAnterior = this.patentes[indexAtual +1] || null;

    this._patentes.push(patenteAtual)
    this._patentes.push(patenteAnterior)
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
