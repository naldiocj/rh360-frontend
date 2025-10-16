import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sigpq-assinatura-digital',
  templateUrl: './assinatura-digital.component.html',
  styleUrls: ['./assinatura-digital.component.css']
})
export class AssinaturaDigitalComponent implements OnInit {

  constructor() { }
  @Input() public params: any
  @Input() public options: any
  ngOnInit(): void {
  }

}
