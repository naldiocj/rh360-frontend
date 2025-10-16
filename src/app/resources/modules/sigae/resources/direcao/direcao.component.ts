import { Component, OnInit } from "@angular/core";
import { finalize } from "rxjs";
import { Pagination } from "@shared/models/pagination";
import { LoteArmasService } from "../../core/lote-armas.service";
import { AtribuirLotesService } from "../../core/atribuir-lotes.service";
import { AgenteOrgaoService } from "../../core/service/agente-orgao.service";
import { Select2OptionData } from "ng-select2";
import { HelpingService } from "../../core/helping.service";
import { AuthService } from "@core/authentication/auth.service";

@Component({
  selector: "app-direcao",
  templateUrl: "./direcao.component.html",
  styleUrls: ["./direcao.component.css"],
})
export class DirecaoComponent implements OnInit {
  public arma: any = [];

  public pagination = new Pagination();
  public totalBase: number = 0;
  public id: any;
  public func: any;
  public carregando: boolean = false;
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial = "Comando Provincial";
  
  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    orgao_id:""
  };
  public is!:number
  constructor(
    private armas: LoteArmasService,
    private armaAt: AtribuirLotesService,
    private agenteOrgaoService: AgenteOrgaoService,
    private help:HelpingService ,
    private users:AuthService

  ) {}
  ngOnInit(): void {
    this.is= this.help.isUser
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.buscarCalibres();
    this.setAtribuido();
  }

  private buscarCalibres() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.armaAt
      .listar({})
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.arma = response;
        this.pagination = this.pagination.deserialize(response.meta);

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";
    this.buscarCalibres();
    this.nullCalibre();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }

    this.buscarCalibres();
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.armaAt
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina();
        },
      });
  }

  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  public setAtribuido() {
    this.armaAt.listar({}).subscribe((response: any) => {
      var at = response.map((resp: any) => {
      });
    });

    this.setArma();
  }

  public setArma() {
    this.armas.listar({}).subscribe((response: any) => {
      var at = response.map((resp: any) => {
      });
    });
  }


  selecionarAgente(event: any) {
    this.agenteOrgaoService
      .verAgenteOrgao({ pessoajuridica_id: event })
      .subscribe({
        next: (res: any) => {
        },
      });
  }

private search(com:any,id_nome:any){
if(com===id_nome){
}else{
}

}

  
}
