import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sigae',
  templateUrl: './sigae.component.html',
  styleUrls: ['./sigae.component.css']
})
export class SigaeComponent {
  title = 'Sistema de Gestão de Armamento';
   showing:boolean=false;
  touch:boolean=false;
    rel!:boolean;
    lista!:boolean;
    armas!:boolean;



}
