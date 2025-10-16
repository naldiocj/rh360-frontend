import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sigpq-impressao-digital',
  templateUrl: './impressao-digital.component.html',
  styleUrls: ['./impressao-digital.component.css']
})
export class ImpressaoDigitalComponent implements OnInit {

  constructor() { }
  @Input() public params: any
  @Input() public options: any
  ngOnInit(): void {
  }

}
