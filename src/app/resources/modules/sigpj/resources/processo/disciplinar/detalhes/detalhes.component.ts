import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArguidoDisciplinarService } from "@resources/modules/sigpj/core/service/ArguidoDisciplinar.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-sigpj-processo-disciplinar-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css'],
})
export class DetalhesComponent implements OnInit {
  fileUrl:any
  arguido:any
  isLoading:boolean = false
  constructor(
    private route: ActivatedRoute,
    private arguidoService: ArguidoDisciplinarService
  ) { }

  ngOnInit(): void {
    this.buscarArguido()
  }

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }

  buscarArguido() {
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

  verFoto(xx:any){}
  setDisplayNone(xx:any){}
}
