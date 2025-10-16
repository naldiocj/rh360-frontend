import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { TratarEscalaService } from '@resources/modules/pa/core/service/tratar-escala.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pa-esc-trabalho',
  templateUrl: './esc-trabalho.component.html',
  styleUrls: ['./esc-trabalho.component.css']
})
export class EscTrabalhoComponent implements OnChanges {

  @Input() public escala_trabalho: any
  @Output() public onFecharModal: EventEmitter<any>;
  @Input() public funcionario: any
  @Input() public pessoaId: any
  @Input() public isAgente: boolean = false;

  public isLoading: boolean = false;

  public fileUrl: any

  constructor(private ficheiroService: FicheiroService, private utilService: UtilService, private tratarEscalaService: TratarEscalaService) {
    this.onFecharModal = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['escala_trabalho']?.currentValue != changes['escala_trabalho']?.previousValue) {
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
    return this.utilService.estado_escala(status)
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

  public setCumprido(id: any) {
    this.tratarEscalaService.cumprir(id).pipe((
      finalize((): void => {

      })
    )).subscribe({
      next: (response: any) => {

      }
    })
  }

  public setNaoCumprido(id: any) {
    this.tratarEscalaService.naoCumprido(id).pipe((
      finalize((): void => {

      })
    )).subscribe({
      next: (response: any) => {

      }
    })
  }

  public imprimir(evt: any, id: any) {
    evt.target.style.display = 'none';
    this.utilService.imprirBrower(id)

  }
}

