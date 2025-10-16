import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpedienteDiipService } from '@resources/modules/sicgo/core/service/piquete/iip/diip/expediente-diip.service';
 
@Component({
  selector: 'diip-view',
  templateUrl: './diip-view.component.html',
  styleUrls: ['./diip-view.component.css']
})
export class DiipViewComponent implements OnInit {
  @Input() expediente: any

  constructor(private expedienteService: ExpedienteDiipService) {}
  ngOnInit(): void {
     
  }

  despachar() {
    // Exemplo de dados para despacho
    const dados = { termoRecebimento: 'Termo recebido', termoApresentacao: 'Termo apresentado' }
    this.expedienteService.despacharExpediente(this.expediente.id, dados).subscribe(res => {
      this.expediente = res
    })
  }

  remeterMinisterio() {
    const nup = prompt('Informe o NUP atribuído:')
    if (nup) {
      this.expedienteService.remeterMinisterio(this.expediente.id, nup).subscribe(res => {
        this.expediente = res
      })
    }
  }

  receberOpcs() {
    this.expedienteService.receberOpcs(this.expediente.id).subscribe(res => {
      this.expediente = res
    })
  }

  distribuirChefia() {
    this.expedienteService.distribuirChefia(this.expediente.id).subscribe(res => {
      this.expediente = res
    })
  }

  distribuirDepartamento() {
    this.expedienteService.distribuirDepartamento(this.expediente.id).subscribe(res => {
      this.expediente = res
    })
  }

  iniciarInstrucao() {
    this.expedienteService.iniciarInstrucao(this.expediente.id).subscribe(res => {
      this.expediente = res
    })
  }

  concluir() {
    this.expedienteService.concluirExpediente(this.expediente.id).subscribe(res => {
      this.expediente = res
    })
  }
}