import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
 

@Component({
  selector: 'app-listar-testemunha',
  templateUrl: './listar-testemunha.component.html',
  styleUrls: ['./listar-testemunha.component.css']
})
export class ListarTestemunhaComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

 
  @Input() dados: any; 
  public testemunhas: any[] = [];
  constructor() {}


  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) { 
      this.testemunhas = this.dados.testemunhas; 
    }
  }

 


  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }


}



