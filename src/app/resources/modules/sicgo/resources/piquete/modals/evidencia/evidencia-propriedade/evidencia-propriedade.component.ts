import { Component, Input, OnInit } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { finalize } from "rxjs";

@Component({
  selector: 'app-evidencia-propriedade',
  templateUrl: './evidencia-propriedade.component.html',
  styleUrls: ['./evidencia-propriedade.component.css']
})
export class EvidenciaPropriedadeComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public testemunhas: any;
  @Input() ocorrenciaId:                number | any;
  @Input() carateristica_nome: string | any;
  @Input() descricao: string | any; 
  @Input() onAdd: any;
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


