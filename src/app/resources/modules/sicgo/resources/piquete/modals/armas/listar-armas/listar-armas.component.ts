import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sicgo-listar-armas',
  templateUrl: './listar-armas.component.html',
  styleUrls: ['./listar-armas.component.css']
})
export class ListarArmasComponent implements OnInit {
  @Input() ocorrenciaId:                number | any;
  constructor() { }

  ngOnInit(): void {
  }

}
