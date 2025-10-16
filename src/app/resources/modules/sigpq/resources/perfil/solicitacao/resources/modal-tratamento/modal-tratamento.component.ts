import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { ModalService } from '@core/services/config/Modal.service';
import { SolicitacaoService } from '@resources/modules/pa/core/service/solicitacao.service';
import { TratarSolicitacaoService } from '@resources/modules/pa/core/service/tratar-solicitacao.service';
import { finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-modal-tratamento',
  templateUrl: './modal-tratamento.component.html',
  styleUrls: ['./modal-tratamento.component.css']
})
export class ModalTratamentoComponent implements OnChanges, OnInit, OnDestroy {

  @Input() solicitacao_id!: any
  @Input() agented_id!: number
  @Input() informacaoAgente: any
  @Output() onAlterar!: EventEmitter<any>

  public simpleForm: any
  public carregando: boolean = false;
  public isAprovar: boolean = false;
  public isReprovado: boolean = false;
  public isPendente: boolean = false;
  public hoje = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  private destroy$: Subject<void>

  public solicitacao: any = []

  constructor(
    private solicitacaoService: SolicitacaoService,
    private tratarSolicitacaoService: TratarSolicitacaoService,
    private modalService: ModalService,
    public utilsHelper: UtilsHelper,
    private fb: FormBuilder,
    private sanitizier: DomSanitizer,
    private formatarDataHelper: FormatarDataHelper,
  ) {
    this.onAlterar = new EventEmitter<any>()
    this.destroy$ = new Subject<void>()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.solicitacao_id != undefined) {
      this.buscarSolicitcao(this.solicitacao_id, this.agented_id!)
      this.insertSolicitacaoId()
    }
  }

  ngOnInit(): void {
    this.criarForm()
  }


  private insertSolicitacaoId() {
    this.simpleForm.patchValue({
      solicitacao_id: this.getSolicitacaoId
    })
  }
  private criarForm() {

    this.simpleForm = this.fb.group({
      data: [null, Validators.compose([Validators.required])],
      solicitacao_id: [null, Validators.required],

    });

  }

  private get getPessoaId(): number | null {
    return this.agented_id;
  }

  private get getSolicitacaoId(): number | null {
    return this.solicitacao_id;
  }


  public buscarSolicitcao(solicitacao_id: number, agente_id: number) {
    this.carregando = true;
    this.solicitacaoService.listarUm(solicitacao_id).pipe(
      finalize((): void => {
        this.carregando = false
      })
    ).subscribe({
      next: (res: any) => {
        this.solicitacao = res;
      }
    })
  }

  public aprovar() {
    this.carregando = true;
    this.tratarSolicitacaoService.aprovar(this.simpleForm?.value).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: () => {
        this.modalService.fechar('btn-close-modal')
        this.onAlterar.emit({ alterar: true })
        this.setAprovar(false)
      }
    })
  }
  public reprovar(id: any) {
    this.carregando = false;
    this.tratarSolicitacaoService.reprovar(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('btn-close-modal')
        this.onAlterar.emit({ alterar: true })
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }
  public pendente(id: any) {
    this.carregando = false;
    this.tratarSolicitacaoService.pendente(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('btn-close-modal')
        this.onAlterar.emit({ alterar: true })
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }

  public tratamento() {
    this.onAlterar.emit({ alterar: true })

    this.isReprovado = false
    this.isPendente = false;
  }

  public setAprovar(value: boolean) {
    this.isAprovar = value
  }

  public get getIsAprovado(): boolean {
    return this.isAprovar
  }



  public openReprovar() {
    this.isReprovado = true
  }

  public openPendente() {
    this.isPendente = true;
  }

  public capitalize(text: string) {
    return this.utilsHelper.capitalize(text)
  }

  public sanitizerText(text: string | null): SafeHtml {
    if (text === null) {
      return '';
    }
    return this.sanitizier.bypassSecurityTrustHtml(text)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
