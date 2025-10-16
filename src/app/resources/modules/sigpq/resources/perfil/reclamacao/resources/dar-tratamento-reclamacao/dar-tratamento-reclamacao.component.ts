import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { AgenteReclamationService } from '@resources/modules/pa/core/service/agente-reclamation.service';
import { TratarReclamacaoService } from '@resources/modules/pa/core/service/tratar-reclamacao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-tratamento-reclamacao',
  templateUrl: './dar-tratamento-reclamacao.component.html',
  styleUrls: ['./dar-tratamento-reclamacao.component.css']
})
export class DarTratamentoReclamacaoComponent implements OnChanges {

  @Input() reclamacao_id: number | undefined
  @Input() agented_id: number | undefined
  @Input() informacaoAgente: any
  public carregando: boolean = false;
  @Input() fileUrl:any

  @Output() onAlterar!:EventEmitter<any>
  public reclamacao: any = []

  constructor(private reclamacaoService: AgenteReclamationService, private modalService: ModalService, private tratarReclamacaoService:TratarReclamacaoService) {
    this.onAlterar =  new EventEmitter<any>()
   }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.reclamacao_id != undefined) {
      this.buscarSolicitcao(this.agented_id, this.reclamacao_id)

    }
  }


  public buscarSolicitcao(agente_id: any,reclamacao_id: any) {
    this.carregando = true;
    this.reclamacaoService.listarUm(agente_id,reclamacao_id).pipe(
      finalize((): void => {
        this.carregando = false
      })
    ).subscribe({
      next: (res: any) => {
        this.reclamacao = res;
        console.log(res)
      }, error: (erro: any) => {
        console.error(erro)
      }
    })
  }

  public aprovar(id: any) {
    this.carregando = false;
    this.tratarReclamacaoService.aprovar(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('close-modal')
        this.onAlterar.emit({alterado:true})
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }
  public reprovar(id: any) {
    this.carregando = false;
    this.tratarReclamacaoService.reprovar(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('close-modal')
        this.onAlterar.emit({alterado:true})
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }
  public pendente(id: any) {
    this.carregando = false;
    this.tratarReclamacaoService.pendente(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('close-modal')
        this.onAlterar.emit({alterado:true})
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }


public reset(){
  this.fileUrl = undefined
}
}
