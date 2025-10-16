import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { finalize } from "rxjs";
import { Pagination } from "@shared/models/pagination";
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { HelpingService } from "../../core/helping.service";

@Component({
  selector: "app-liistar-usuario",
  templateUrl: "./liistar-usuario.component.html",
  styleUrls: ["./liistar-usuario.component.css"],
})
export class LiistarUsuarioComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public onSucess: any;
  public lista_users: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    modulo_id:24,
  };
  ob: any;
  options: any = {
    placeholder: "Selecione uma opção",
    width: "100%",
  };
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
  lista: any={};

  constructor(
    private help:HelpingService ,
    private user: UtilizadorService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.mostrarUsersSigae()
  }

  mostrarUsersSigae() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.user.listar(options).pipe(
      finalize(() => {
        // this.isLoading = false;
      }),
    ).subscribe((response) => {
      let data = null;
      data = this.filtrarModulo(response.data)
 this.ver_user(data)
console.log(data)
    
     this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);

    });
  }



  ver_user(data:any){
this.lista=data
// console.log(data)

  }

  private filtrarModulo(obj:any){
   return obj.filter((r:any)=> r.modulo.id==this.filtro.modulo_id)
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }
    this.mostrarUsersSigae();
  }

  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }
}
