import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sigvest-cards',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  box = [
    {
      titulo:"Total de Efectivos Quadro I",
      dados: 22.450,
      colour: '#041b4e',
      icone: "bi bi-people-fill",
      link:'/piips/sigvest/planificacao/plano-de-necessidades/listar'
    },
    {
      titulo: "Total de Efectivos Quadro II",
      dados: '3.000',
      colour: '#041b4e',
      icone: "bi bi-person-fill",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Total de Efectivos Masculinos",
      dados: 15.450,
      colour: '#041b4e',
      icone: "bi bi-gender-male",
      link:'/piips/sigvest/dashboard'
    },
    {
      titulo: "Total de Efectivos Femeninos",
      dados: '7.000',
      colour: '#041b4e',
      icone: "bi bi-gender-female",
      link:'/piips/sigvest/dashboard'
    }
  ]
}
