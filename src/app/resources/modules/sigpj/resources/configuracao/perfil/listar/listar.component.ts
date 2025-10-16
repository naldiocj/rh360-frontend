import { Component, OnInit, ViewChildren } from '@angular/core';
import { PerfilService } from '../../../../core/service/Perfil.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpj-listar-perfil',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public perfis: any[] = [];

  totalBase: number = 0
  public pagination = new Pagination();
  public utilizador: any
  public selectPerfil: any

  filtro = {
    page: 1,
    perPage: 5,
    search: "",
    modulo: 'SIGPJ'
  }

  constructor(private perfilService:PerfilService) { }

  ngOnInit(): void {
    this.buscarPerfis()
  }

  buscarPerfis() {

    const options = { ...this.filtro };

    // this.isLoading = true;
    this.perfilService.listar(options).pipe(
      finalize(() => {
        // this.isLoading = false;
      }),
    ).subscribe((response) => {


      this.perfis = response.data;

      this.totalBase = response.meta.current_page ?
      response.meta.current_page === 1 ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);

    });
  }

  eliminarPerfil(item:any){
    this.selectPerfil = item


  }
  onDelete(){
    if(this.selectPerfil.id){

      this.perfilService.eliminar(this.selectPerfil, this.selectPerfil.id).pipe(
        finalize(()=>{})
        )
        .subscribe(
          ()=>{
          this.buscarPerfis()
          this.removerModal()
          }
        )

    }
  }
  setPerfil(item: any) {
    this.utilizador = item
  }

  changePage(event: any, e: any) { }

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
    this.buscarPerfis();
  }


  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarPerfis()
   }

}
