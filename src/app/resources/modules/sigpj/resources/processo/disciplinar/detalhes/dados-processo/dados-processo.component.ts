import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { DisciplinarList } from '@resources/modules/sigpj/shared/model/disciplinar-list.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpj-processo-detalhes-dados-processo',
  templateUrl: './dados-processo.component.html',
  styleUrls: ['./dados-processo.component.css']
})
export class DadosProcessoComponent implements OnInit {

  @Input() disciplinarId: any = null

  disciplinarTotal: any = 0
  reclamacaoTipo: any = 0
  isLoading: boolean = false
  public disciplinars?: any

  constructor(
    private disciplinarService: DisciplinarService
  ) { }


  ngOnInit(): void {
    this.buscarUmDisciplinar()
  }

  public get getId() {
    return this.disciplinarId as number;
  }

  buscarUmDisciplinar() {
    this.disciplinarService
      .verUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.disciplinars = response;
        // this.buscarUmArguido(response.funcionario_id);
        // this.antecedentesDisciplinar(response.funcionario_id)
        // this.antecedentesReclamacao(response.funcionario_id)
      });
  }

}
