import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public DADOS_EFECTIVOS = [
    {id:1, numero_efect: 200, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 340, patente: 'Oficial', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
    {id:1, numero_efect: 20, patente: 'Agente', design_meio: 'Farda de Campanha', tam: 65},
  ]
}
