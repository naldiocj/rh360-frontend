import { finalize } from 'rxjs';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
@Component({
  selector: 'app-pessoal',
  templateUrl: './pessoal.component.html',
  styleUrls: ['./pessoal.component.css']
})
export class PessoalComponent implements OnChanges {
  @Input() public person: any = null;
  public carregando: boolean = true;
  constructor(
    public utilsHelper: UtilsHelper) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.carregando = !this.person
  }


  public capitalize(value: string) {
    return this.utilsHelper.capitalize(value)
  }


}
