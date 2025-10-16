import { Component, OnInit } from '@angular/core';
import { EstatisticasService } from '@resources/modules/sigpq/core/service/estatisticas.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cargo-e-chefia',
  templateUrl: './cargo-e-chefia.component.html',
  styleUrls: ['./cargo-e-chefia.component.css']
})
export class CargoEChefiaComponent implements OnInit {

  constructor(private apiEstatistica:EstatisticasService) { }
  defaluValue:boolean=false;
  cargoDirecao:boolean=this.defaluValue;
  dadosCargoEChefia:any
  async ngOnInit() {
    await this.loadDados()
  }


  togglecargoDirecao(){
    this.cargoDirecao=!this.cargoDirecao
  }

  async loadDados()
  {
    await this.apiEstatistica.listar_orgaos_e_chefia().pipe(finalize(()=>{}))
    .subscribe((response)=>{
      //console.log("Dados carregados da composição etaria:",response[0])
      this.dadosCargoEChefia=response
    })
  }



}
