import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarGrupoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar_grupo_ocorrencia/associar-grupo-ocorrencia.service';
import { DinfopAntecedenteDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/antecedente_delitouso.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-grupo-lista',
  templateUrl: './grupo-lista.component.html',
  styleUrls: ['./grupo-lista.component.css']
})
export class GrupoListaComponent implements OnInit {

  public grupoDelituoso: any[] = [];
  public isLoading: boolean = false

  totalBase: number = 0
  NovoProcesso:any
  idade: number | null = null;
  @Input() dados: any;

  constructor(){}

  ngOnInit( ){ 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.grupoDelituoso = this.dados.grupos;
    }
  }

  

}
