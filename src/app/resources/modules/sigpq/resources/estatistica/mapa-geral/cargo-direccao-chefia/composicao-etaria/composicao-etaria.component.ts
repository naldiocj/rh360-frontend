import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-composicao-etaria',
  templateUrl: './composicao-etaria.component.html',
  styleUrls: ['./composicao-etaria.component.css']
})
export class ComposicaoEtariaComponent implements OnInit {

  constructor(private apiEstatistica:EstatisticasService ) { }
  defaluValue:boolean=false;
  composicaoEtaria:boolean=this.defaluValue;
  composicaosEtaria:any
  ngOnInit(): void {
    this.loadDados()
  }

  togglecomposicaoEtaria(){
    this.composicaoEtaria=!this.composicaoEtaria
  }

  loadDados()
  {
    this.apiEstatistica.listar_todos_composicao_etaria().pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.composicaosEtaria=response[0]
    })
  }



}
