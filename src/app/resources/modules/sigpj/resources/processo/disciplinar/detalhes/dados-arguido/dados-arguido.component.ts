import { Component, Input, OnInit } from '@angular/core';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
// import { arguidoService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpj-processo-detalhes-dados-arguido',
  templateUrl: './dados-arguido.component.html',
  styleUrls: ['./dados-arguido.component.css']
})
export class DadosArguidoComponent implements OnInit {

  @Input() disciplinarId: number = 0

  disciplinarTotal: any = 8
  reclamacaoTipo: any = 8
  isLoading: boolean = false
  public arguido?: any

  constructor(
    private arguidoService: ArguidoDisciplinarService
  ) { }

  ngOnInit(): void {
    this.buscarArguido()
  }

  public get getId() {
    return this.disciplinarId as number;
  }

  buscarArguido() {

    if (!this.getId) {
      return
    }

    this.isLoading = true;
    this.arguidoService
      .listarUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.arguido = response;
      });
  }

}
