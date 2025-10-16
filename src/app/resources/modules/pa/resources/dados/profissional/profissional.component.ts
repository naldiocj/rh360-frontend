import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { DadosProfissionalService } from '@resources/modules/pa/core/service/dados-profissional.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent implements OnInit {

  funcionario:any

  options: any = {
    id: this.agenteService.id
  }

  public isLoading = false;

  constructor(
    private secureService: SecureService,
    private dadosProfissional: DadosProfissionalService,
    private agenteService: AgenteService) { }

  ngOnInit(): void {
    this.buscarDadosProfissional()
  }


  buscarDadosProfissional() {
    this.isLoading = true;

    this.dadosProfissional.listar(this.options)
      .pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe((response) => {
        this.funcionario = response
      })
  }
}
