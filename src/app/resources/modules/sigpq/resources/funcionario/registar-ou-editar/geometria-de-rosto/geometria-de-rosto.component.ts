import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sigpq-geometria-de-rosto',
  templateUrl: './geometria-de-rosto.component.html',
  styleUrls: ['./geometria-de-rosto.component.css']
})
export class GeometriaDeRostoComponent implements OnInit {

  constructor() { }
  @Input() public params: any
  @Input() public options: any
  ngOnInit(): void {
  }

}
