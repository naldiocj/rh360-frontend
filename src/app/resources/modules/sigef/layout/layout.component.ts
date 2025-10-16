import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent  {
  @Input() showing!:boolean;
  touch:boolean=false;
   rel!:boolean;
   lista!:boolean;
   armas:boolean=false;


 toque(){
    this.touch=!this.touch;
 }

 
 rele(){
   this.rel=!this.rel;
}
list(){
 this.lista=!this.lista;
}

show(){
  this.showing=!this.showing;
}


gun(){
   this.armas=!this.armas;
}

}
