import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sigiac-dados-queixa',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class DadosQueixaComponent implements OnInit {

  @Input()  dadosForm:any   


  constructor(){}


  ngOnInit():void{
 
  }

}
