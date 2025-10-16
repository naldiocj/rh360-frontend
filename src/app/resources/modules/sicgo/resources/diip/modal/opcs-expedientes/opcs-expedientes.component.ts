import { Component, OnInit } from '@angular/core';
import { ExpedienteDiipService } from '@resources/modules/sicgo/core/service/piquete/iip/diip/expediente-diip.service';
 
@Component({
  selector: 'app-opcs-expedientes',
  templateUrl: './opcs-expedientes.component.html',
  styles: []
})
export class OpcsExpedientesComponent implements OnInit {
  expedientes: any[] = [];
  responsavel: string = '';

  constructor(private expedienteService: ExpedienteDiipService) { }

  ngOnInit(): void {
    this.expedienteService.listarExpedientesPorResponsavel('OPCs')
      .subscribe(data => this.expedientes = data);
  }

  atribuirResponsavel(expedienteId: number) {
    if (!this.responsavel) {
      alert("Informe um responsável");
      return;
    }

    this.expedienteService.atribuirResponsavel(expedienteId, this.responsavel)
      .subscribe(response => {
        alert(response.message);
        this.ngOnInit();  // Atualizar lista
      });
  }
}
