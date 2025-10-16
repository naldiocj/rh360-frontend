import { finalize } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-pa-tratamento-solicitacao',
  templateUrl: './tratamento-solicitacao.component.html',
  styleUrls: ['./tratamento-solicitacao.component.css']
})
export class TratamentoSolicitacaoComponent implements OnChanges {
  @Input() public tratamento: any
  @Output() public onFecharModal: EventEmitter<any>
  @Input() public funcionario: any
  @Input() pessoaId: any

  public isLoading: boolean = false;
  public abrirJustificar: boolean = false;
  public simpleForm: any
  public conteudo: any
  public podeImprimir: boolean = false;

  public fileUrl: any
  public fileUrlArquivo: any



  constructor(
    private ficheiroService: FicheiroService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private sanitizier: DomSanitizer,
    public utilsHelper: UtilsHelper) {
    this.onFecharModal = new EventEmitter<any>()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tratamento']?.currentValue != changes['tratamento']?.previousValue) {
      console.log(this.tratamento)
      this.verFoto(this.getFuncionario?.foto_efectivo)
    }

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

  public gerarPDF(documento: any) {
    this.conteudo = documento;
    this.podeImprimir = true;
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
