import { Component, Input, OnInit } from '@angular/core';
import { DinfopAntecedenteDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/antecedente_delitouso.service';

@Component({
  selector: 'app-sicgo-lista-antecedente',
  templateUrl: './lista-antecedente.component.html',
  styleUrls: ['./lista-antecedente.component.css']
})
export class ListaAntecedenteComponent implements OnInit {
  @Input() antecedentes: any[] = [];
  mostrarTudo: boolean = false; // Controla se o texto completo será mostrado
  limiteTexto: number = 100;    // Limite de caracteres para exibição

  constructor(private dinfopAntecedenteDelitousoService:DinfopAntecedenteDelitousoService) { }

  ngOnInit(): void {
  }


  toggleTexto(descricao: string) {
    this.mostrarTudo = !this.mostrarTudo;
    this.limiteTexto = this.mostrarTudo ? descricao.length : 100;
  }

  enviar(antecedente: any): void {
    this.dinfopAntecedenteDelitousoService.enviardado(antecedente); 
  }
}
