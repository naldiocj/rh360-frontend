import { Component, Input, OnInit } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';

@Component({
  selector: 'app-evidencia-historico',
  templateUrl: './evidencia-historico.component.html',
  styleUrls: ['./evidencia-historico.component.css']
})
export class EvidenciaHistoricoComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public testemunhas: any;
  @Input() ocorrenciaId:                number | any;
  constructor(private OcorrenciaService: OcorrenciaService) {

    }


  ngOnInit(): void {
    this.Testemunhas();
  }



 Testemunhas() {

  }


  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }


}



