import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-activa-desactiva',
  templateUrl: './activa-desactiva.component.html',
  styleUrls: ['./activa-desactiva.component.css']
})
export class ActivaDesactivaComponent {

  @Input() public utilizador: any = null
  @Output() public onActiva: EventEmitter<void>

  constructor(private utilizadorService: UtilizadorService, private modalService: ModalService) {
    this.onActiva = new EventEmitter<void>()
  }

  public activaDesactiva(utilizadorId: any) {
    this.utilizadorService.activaDesactiva(utilizadorId).pipe(
      finalize((): void => {

      })
    ).subscribe((): void => {
      this.fecharModal()
      this.emitaEvento()
    })
  }

  public emitaEvento() {
    this.onActiva.emit()
  }
  private fecharModal() {
    this.modalService.fechar('btn-close-activa')
  }

}
