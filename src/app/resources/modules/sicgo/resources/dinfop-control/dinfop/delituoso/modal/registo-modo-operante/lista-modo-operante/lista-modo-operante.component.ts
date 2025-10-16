import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DelitousoModoOperanteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delitouso_modo_operante/delitouso-modo-operante.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dinfop-lista-modo-operante',
  templateUrl: './lista-modo-operante.component.html',
  styleUrls: ['./lista-modo-operante.component.css']
})
export class ListaModoOperanteComponent implements OnInit {

  @Input() modooperante: any[] = [];
  sanitizedContent: SafeHtml | null = null;
  modo: any;
  modoOp: any;
  mostrarTudo: boolean = false; // Controla se o texto completo será mostrado
  limiteTexto: number = 100;    // Limite de caracteres para exibição



  constructor(private delitousoModoOperanteService: DelitousoModoOperanteService) { }

  ngOnInit(): void {
  
  }

  toggleTexto(descricao: string) {
    this.mostrarTudo = !this.mostrarTudo;
    this.limiteTexto = this.mostrarTudo ? descricao.length : 100;
  }

  
  enviarIds(modooperante: any): void {
    this.delitousoModoOperanteService.enviarId(modooperante); 
  }

 
}
