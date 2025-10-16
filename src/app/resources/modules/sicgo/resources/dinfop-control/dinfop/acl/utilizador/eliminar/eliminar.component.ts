import { Component, EventEmitter, Input,  Output } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent {

  @Input() utilizador: any = null
  @Output() onEliminar: EventEmitter<void>
  constructor(private utilizadorServico: UtilizadorService, private modalService: ModalService) {
    this.onEliminar = new EventEmitter<void>()
  }

  public eliminar(utilizadorId: any) {
    this.utilizadorServico.eliminar(utilizadorId).pipe(
      finalize((): void => {

      })
    ).subscribe(() => {
      this.fecharModal()
      this.emitaEvento()
    })
  }

  private fecharModal() {
    this.modalService.fechar('btn-close-eliminar')
  }
  public emitaEvento() {
    this.onEliminar.emit()
  }

}
