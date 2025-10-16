import { Component, Input, OnInit } from '@angular/core';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { SecureService } from '@core/authentication/secure.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sipa-dados-profissionais',
  templateUrl: './dados-profissionais.component.html',
  styleUrls: ['./dados-profissionais.component.css']
})
export class DadosProfissionaisComponent  {

  @Input() public dadosProfissionais: any = null

  constructor(
  
    public readonly utilsHelper: UtilsHelper
  ) { }

  


}
