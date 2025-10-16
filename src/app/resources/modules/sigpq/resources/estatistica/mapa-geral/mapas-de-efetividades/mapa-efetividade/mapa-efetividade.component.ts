import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa-eefetividade',
  templateUrl: './mapa-efetividade.component.html',
  styleUrls: ['./mapa-efetividade.component.css']
})
export class MapaEfetividadeComponent implements OnInit {

  constructor() { }
  mes="JULHO";
  anoNew=new Date()
  ano=this.anoNew.getFullYear();

  efetividade:boolean=false;
  situacaoPassiva:boolean=false;
  nivelAcademico:boolean=false;
  ngOnInit(): void {
    this.loadMes()
  }

  loadMes()
  {
    const meses = ["janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"
    , "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    this.mes = meses[this.anoNew.getMonth()].toUpperCase();
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
