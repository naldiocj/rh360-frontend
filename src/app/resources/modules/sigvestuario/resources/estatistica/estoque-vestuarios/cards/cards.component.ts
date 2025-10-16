import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sigvest-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  box = [
    {
      titulo:"Total de Fardas",
      dados: 22.450,
      colour: '#041b4e',
      icone: "bi bi-emoji-smile-fill",
      link:'/piips/sigvest/planificacao/plano-de-necessidades/listar'
    },
    {
      titulo: "Total de Kicos",
      dados: '3.000',
      colour: '#041b4e',
      icone: "bi bi-emoji-smile-fill",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Total de Botas",
      dados: 15.450,
      colour: '#041b4e',
      icone: "bi bi-emoji-smile-fill",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Total de Cinturões",
      dados: '7.000',
      colour: '#041b4e',
      icone: "bi bi-emoji-smile-fill",
      link:'/piips/sigvest/dashboard'
    }
  ]
}
