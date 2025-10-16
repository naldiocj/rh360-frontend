import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sicgo-expedientes-view',
  templateUrl: './expedientes-view.component.html',
  styleUrls: ['./expedientes-view.component.css']
})
export class ExpedientesViewComponent implements OnInit {
  // Inicialmente, o banner está visível
  @Input() showup: number | any; // Inicialmente, o banner está visível

  @Input() atividade: any;
  constructor() { }

  ngOnInit(): void {
  }

}
