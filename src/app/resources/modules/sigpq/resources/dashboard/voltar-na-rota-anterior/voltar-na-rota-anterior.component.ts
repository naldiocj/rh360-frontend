import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-voltar-na-rota-anterior',
  templateUrl: './voltar-na-rota-anterior.component.html',
  styleUrls: ['./voltar-na-rota-anterior.component.css']
})
export class VoltarNaRotaAnteriorComponent implements OnInit {

  constructor(private location: Location) {}

  voltar(): void {
    this.location.back(); // Retorna para a página anterior
  }

  ngOnInit() {
  }

}
