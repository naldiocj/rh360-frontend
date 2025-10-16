import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapas-de-efetividades',
  templateUrl: './mapas-de-efetividades.component.html',
  styleUrls: ['./mapas-de-efetividades.component.css']
})
export class MapasDeEfetividadesComponent implements OnInit {

  constructor() { }
  mes="JULHO";
  anoNew=new Date()
  ano=this.anoNew.getFullYear();
  efetividade:boolean=false;
  situacaoPassiva:boolean=false;
  nivelAcademico:boolean=false;
  ngOnInit(): void {
  }

  togglenivelAcademico(){
    this.nivelAcademico=!this.nivelAcademico
  }


  togglesituacaoPassiva(){
    this.situacaoPassiva=!this.situacaoPassiva
  }


  toggleefetividade(){
    this.efetividade=!this.efetividade
  }



}
