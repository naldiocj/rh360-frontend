import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sicgo-lista-antecedente-ocorrencia',
  templateUrl: './lista-antecedente-ocorrencia.component.html',
  styleUrls: ['./lista-antecedente-ocorrencia.component.css']
})
export class ListaAntecedenteOcorrenciaComponent implements OnInit {
@Input() antecedenteocorrencia: any[] = [];
mostrarTudo: boolean = false; // Controla se o texto completo será mostrado
limiteTexto: number = 100;    // Limite de caracteres para exibição

  constructor() { }

  ngOnInit(): void {
  }

  toggleTexto(descricao: string) {
    this.mostrarTudo = !this.mostrarTudo;
    this.limiteTexto = this.mostrarTudo ? descricao.length : 100;
  }
}
