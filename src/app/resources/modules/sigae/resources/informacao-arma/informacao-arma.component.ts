import { Component, OnInit } from '@angular/core';

import { HelpingService } from '../../core/helping.service';

@Component({
  selector: 'app-informacao-arma',
  templateUrl: './informacao-arma.component.html',
  styleUrls: ['./informacao-arma.component.css']
})
export class InformacaoArmaComponent implements OnInit{
protected is!:number

constructor(
  private help:HelpingService 

){

}
  ngOnInit(): void {
    this.is=this.help.isUser
    
  }
}