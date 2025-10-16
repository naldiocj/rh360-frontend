import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.css']
})
export class BoxesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  box = [
    { titulo: " Total de Auditorias ", descricao: "Dados Fornecidos Pela Inspecção ", dados: 0, icone: "bi bi-puzzle-fill", link: '' },
    { titulo: "Total de Averiguações", descricao: "Dados Fornecidos Pela Inspecção ", dados: 0, icone: "bi bi-eyeglasses", link: '' },
    { titulo: "Proc. disciplinar", descricao: "Dados Fornecidos Pela Instrução ", dados: 0, icone: "bi bi-clipboard-data", link: '' },
    { titulo: "Total de Queixas", descricao: "Dados Fornecidos Pelo Sistema ", dados: 0, icone: "bi bi-megaphone", link: '' },
    { titulo: "Proc. Acompanhamento", descricao: "Dados Fornecidos Pela Fiscalização ", dados: 0, icone: "bi bi-app-indicator", link: '' },
  ]

}
