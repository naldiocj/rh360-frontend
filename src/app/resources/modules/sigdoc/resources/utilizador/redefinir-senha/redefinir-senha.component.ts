import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent  {

  @Input() utilizador: any = null
  @Output() onSucesso: EventEmitter<void>
  constructor(private utilizadorServico: UtilizadorService, private modalService: ModalService) {
    this.onSucesso = new EventEmitter<void>()
  }

  public redefinirSenha(utilizadorId: any) {
    this.utilizadorServico.redefinirSenha(utilizadorId).pipe(
      finalize((): void => {

      })
    ).subscribe(() => {
      this.fecharModal()
      this.emitaEvento()
    })
  }

  private fecharModal() {
    this.modalService.fechar('btn-close-redefinir-senha')
  }
  public emitaEvento() {
    this.onSucesso.emit()
  }
}
