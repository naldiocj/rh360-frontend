import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargo-direccao-chefia',
  templateUrl: './cargo-direccao-chefia.component.html',
  styleUrls: ['./cargo-direccao-chefia.component.css']
})
export class CargoDireccaoChefiaComponent implements OnInit {

  constructor() { }
  defaluValue:boolean=false;
  cargoDirecao:boolean=this.defaluValue;
  formacaoAcademica:boolean=this.defaluValue;
  distribuicaoOrgao:boolean=this.defaluValue;
  composicaoEtaria:boolean=this.defaluValue;
  ngOnInit(): void {
  }

  togglecomposicaoEtaria(){
    this.composicaoEtaria=!this.composicaoEtaria
  }

  toggledistribuicaoOrgao(){
    this.distribuicaoOrgao=!this.distribuicaoOrgao
  }


  toggleformacaoAcademica(){
    this.formacaoAcademica=!this.formacaoAcademica
  }


  togglecargoDirecao(){
    this.cargoDirecao=!this.cargoDirecao
  }

}
