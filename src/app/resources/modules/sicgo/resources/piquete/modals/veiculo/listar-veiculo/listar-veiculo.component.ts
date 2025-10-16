import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';

@Component({
  selector: 'app-listar-veiculo',
  templateUrl: './listar-veiculo.component.html',
  styleUrls: ['./listar-veiculo.component.css']
})
export class ListarVeiculoComponent implements OnInit {


  public veiculos: any[] = [];
  @Input() dados: any;
  constructor(private OcorrenciaService: OcorrenciaService) {

    }


  ngOnInit(): void { 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.veiculos = this.dados.veiculos;
    }
  }


  

}

