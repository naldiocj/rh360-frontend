import { Component, OnInit } from '@angular/core';

interface item {
  nome: string,
  dados: number[],
  subtotal: boolean
}
interface mapa {
  titulo: string,
  itens: item[];
}
@Component({
  selector: 'app-mapa-efetividade',
  templateUrl: './mapa-efetividade.component.html',
  styleUrls: ['./mapa-efetividade.component.css']
})
export class MapaEfetividadeComponent implements OnInit {
  data = new Date();
  anoAtual: string | number = 2023;
  mesAtual: string | number = "06";
  meses: string[] = [];
  mapa_estatistico: mapa[] = [];

  constructor() { }

  ngOnInit() {
    this.loadingDates()
    this.loadingMapa_Estatistico();
  }

  loadingDates() {
    this.anoAtual = this.data.getFullYear();
    this.meses = ["janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"
      , "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    this.mesAtual = this.meses[this.data.getMonth()];
  }

  alterarMes(mes: any) {
    if (mes.target.value == "-1" || mes.target.value == -1) this.loadingDates();
    else this.mesAtual = this.meses[parseInt(mes.target.value)];
  }

  loadingMapa_Estatistico() {
    this.mapa_estatistico = [
      {
        titulo: '|) COMANDO',
        itens: [
          { nome: 'Gab. Comandante Geral', subtotal: false, dados: [1, 0, 1, 0, 2, 3, 3, 2, 4, 9, 5, 2, 8, 15, 26, 4, 1, 4, 9, 2, 0, 0, 2, 0, 37, 0, 0] },
          { nome: 'Gab. 2ª Cmdte Geral/P. Intervenção/Ferreira', subtotal: false, dados: [1, 0, 1, 0, 2, 3, 3, 2, 4, 9, 5, 2, 8, 15, 26, 4, 1, 4, 9, 2, 0, 0, 2, 0, 37, 0, 0] },
          { nome: 'Gab. 2ª Cmdte Geral/O. Pública/Kandela', subtotal: false, dados: [1, 0, 1, 0, 2, 3, 3, 2, 4, 9, 5, 2, 8, 15, 26, 4, 1, 4, 9, 2, 0, 0, 2, 0, 37, 0, 0] },
          { nome: 'Corpo de Conselheiros', subtotal: false, dados: [1, 0, 1, 0, 2, 3, 3, 2, 4, 9, 5, 2, 8, 15, 26, 4, 1, 4, 9, 2, 0, 0, 2, 0, 37, 0, 0] },
          { nome: 'SUBTOTAL', subtotal: true, dados: [1, 0, 1, 0, 2, 3, 3, 2, 4, 9, 5, 2, 8, 15, 26, 4, 1, 4, 9, 2, 0, 0, 2, 0, 37, 0, 0] },
        ]
      }
    ]
  }


}
