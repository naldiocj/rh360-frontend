import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EvidenciaService } from '@resources/modules/sicgo/core/service/piquete/evidencias.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';

@Component({
  selector: 'app-listar-evidencia',
  templateUrl: './listar-evidencia.component.html',
  styleUrls: ['./listar-evidencia.component.css']
})
export class ListarEvidenciaComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public evidencias: any[] = [];
  @Input() dados: any;
  constructor() {}


  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.evidencias = this.dados.evidencias;
    }
  }

 



}
