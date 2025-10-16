import { finalize } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { TratarEscalaService } from '@resources/modules/pa/core/service/tratar-escala.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CancelarSolicitacaoService } from '@resources/modules/pa/core/service/cancelar-solicitacao.service';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-pa-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent implements OnInit, OnChanges {

  @Input() public solicitacao: any
  @Output() public onFecharModal: EventEmitter<any>
  @Output() public onSolicitacao: EventEmitter<any>;
  @Input() public funcionario: any
  @Input() public isAgente: boolean = false;
  @Input() pessoaId: any

  public isLoading: boolean = false;
  public abrirJustificar: boolean = false;
  public simpleForm: any

  public fileUrl: any
  public fileUrlArquivo: any



  constructor(
    private ficheiroService: FicheiroService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private cancelarService: CancelarSolicitacaoService,
    private modalService: ModalService,
    private sanitizier: DomSanitizer,
    public utilsHelper: UtilsHelper) {
    this.onFecharModal = new EventEmitter<any>()
    this.onSolicitacao = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitacao']?.currentValue != changes['solicitacao']?.previousValue) {
      this.verFoto(this.getFuncionario?.foto_efectivo)
      this.preenchaForm(this.solicitacao)
      console.log(this.solicitacao)
      this.abrirJustificar = false;
    }

  }


  ngOnInit(): void {
    this.criarForm()
  }


  private criarForm() {
    this.simpleForm = this.fb.group({
      sigpq_tipo_evento_id: [''],
      observacao: [''],
      mes_id: [''],
      ano: [''],
      id: [''],
      solicitacao_id: [''],
      pessoajuridica_id: [''],
      pessoafisica_id: [''],
      estado: ["E"],
      modulo_id: [''],
      justificacao: ['', Validators.compose([Validators.required, Validators.minLength(30)])],
    })
  }

  public preenchaForm(data: any) {
    this.simpleForm.patchValue({
      sigpq_tipo_evento_id: data.tipo_evento_id,
      observacao: data.observacao,
      mes_id: data.mes_id,
      id: data.id,
      ano: data.ano,
      solicitacao_id: data.solicitacao_id,
      pessoajuridica_id: data.pessoajuridica_id,
      pessoafisica_id: data.pessoafisica_id,
      estado: data.estado,
      modulo_id: data.modulo_id,
    })
  }



  public fecharModal() {
    this.onFecharModal.emit({ fechar: true })
  }

  public getTurno(sigla: any): any {
    return this.utilService.turno(sigla)
  }

  public getData(data: any) {
    return this.utilService.dataNormal(data).dia.nome + ' de ' + this.utilService.dataNormal(data).mes.nome + ' de ' + this.utilService.dataNormal(data).ano
  }
  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }

  private verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }

  public get getFotoEfectivo(): any {
    return this.getFuncionario.foto_efectivo
  }

  public get getFuncionario(): any {
    return this.funcionario
  }

  public get getPessoaId(): any {
    return this.pessoaId as number
  }


  public setSolicitacao(item: any) {
    this.onSolicitacao.emit({ item: item })
  }

  public podeJustificar(event: any = null) {
    if (event)
      this.simpleForm.get('justificacao')?.setValue(null)
    this.abrirJustificar = !this.abrirJustificar
  }

  private resetForm() {
    this.simpleForm.reset()
    this.abrirJustificar = true;
  }

  public onSubmit() {
    this.isLoading = true;
    this.cancelarService.registar(this.getPessoaId, this.simpleForm.value).pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('view-solicitacao');
        this.resetForm()
        this.onFecharModal.emit({ sucesso: true })
      }
    })
  }

  public sanitizerText(text: string | null): SafeHtml {
    if (text === null) {
      return '';
    }
    return this.sanitizier.bypassSecurityTrustHtml(text)
  }


  public verArquivo(item: any) {

    console.log(item)

    if (!item) return

    const opcoes: any = {
      pessoaId: item?.pessoafisica_id,
      url: item?.documento
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

        console.log(this.fileUrl)

      })
    ).subscribe((file: any) => {
      this.fileUrlArquivo = this.ficheiroService.createImageBlob(file);

    });

  }



}


