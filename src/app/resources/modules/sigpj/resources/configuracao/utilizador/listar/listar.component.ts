import { Component, OnInit, ViewChildren } from '@angular/core'; 
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { RegistarOuEditarComponent } from '../registar-ou-editar/registar-ou-editar.component';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';
import { Funcionario } from '@shared/models/Funcionario.model';

@Component({
  selector: 'app-sigpq-listar-veiculo',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public utilizadores: any[] = [];

  @ViewChildren('RegistarOuEditarComponent') registarOuEditarModalComponent!: RegistarOuEditarComponent

  public pagination = new Pagination();
  public utilizador: any
  public Agente = new Funcionario()
  totalBase: number = 0
  public selectUtilizador: any

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    modulo: 'SIGPJ'  
  }

  constructor(private utilizadoresServico: UtilizadorService) { }

  ngOnInit(): void {  
    this.buscarUtilizadores()
  }

  buscarUtilizadores() {
 
 
    this.utilizadoresServico.listar(this.filtro).pipe(
      finalize(() => {
        // this.isLoading = false;
      }),
    ).subscribe((response) => {
      this.utilizadores = response.data;

      this.totalBase = response.meta.current_page ?
      response.meta.current_page === 1 ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }




  setUtilizador(item: any) {
    this.utilizador = item
  }

  eliminarUtilizador(item:any){
    this.selectUtilizador = item 
  }
  onDelete(){ 
    if(this.selectUtilizador.id){
     
      this.utilizadoresServico.eliminar(this.selectUtilizador, this.selectUtilizador.id).pipe(
        finalize(()=>{})
        )
        .subscribe(
          ()=>{
          this.buscarUtilizadores()
          this.removerModal()
          }
        )

    } 
  }
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
    // $('body').removeClass("modal-open");
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarUtilizadores();
  }

  
  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarUtilizadores()
   }

  changePage(event: any, e: any) { }
}