import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TipobensService } from '@resources/modules/sicgo/core/service/piquete/tipobens.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';

@Component({
  selector: 'app-listar-tipodebens',
  templateUrl: './listar-tipodebens.component.html',
  styleUrls: ['./listar-tipodebens.component.css']
})
export class ListarTipodebensComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public tipobens: any[] = [];
  @Input() dados:                number | any;
    
constructor() {}


  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.tipobens = this.dados.tipobens;
    }
  }
 
 
}
