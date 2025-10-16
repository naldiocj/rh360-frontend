import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  public dados_de_filtro: Array<Select2OptionData> = [];
  public flag_mudar_grid_lista_card: boolean = false;
  public options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%'
  };


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

  public mudarEstadoDosCards(event: any) {
    if(event == 'lista')
      this.flag_mudar_grid_lista_card = true;
    else if(event == 'grid')
      this.flag_mudar_grid_lista_card = false;
      
  }
}
