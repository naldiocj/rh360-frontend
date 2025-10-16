import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@resources/modules/sicgo/core/service/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { VitimaService } from '@resources/modules/sicgo/core/service/piquete/vitima.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vitima-lista',
  templateUrl: './vitima-lista.component.html',
  styleUrls: ['./vitima-lista.component.css']
})
export class VitimaListaComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public vitimas: any[] = [];
  @Input() dados:                number | any;
  isLoading: boolean = false;
  public fileUrlCivil: any = null;
  constructor(private vitimaService: VitimaService) {

    }


  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.vitimas = this.dados.vitimas;
    }
  }
 
}
