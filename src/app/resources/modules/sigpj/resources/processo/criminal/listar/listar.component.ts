import { Component, OnInit } from '@angular/core';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination'; 
import { DisciplinarList } from '../../../../shared/model/disciplinar-list.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public disciplinars: DisciplinarList[] = [];
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor( private disciplinar:DisciplinarService ){}


  ngOnInit(){
    
     this.buscarDisciplinar()
  }


  buscarDisciplinar(){
    
    this.isLoading = true;
    this.disciplinar.listar(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      console.log("processos disciplinar:", response)
      this.disciplinars = response.data;

      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });

  }

 

   filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarDisciplinar()
   }

   recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarDisciplinar()
   }

  construcao() {
    alert('Em construção')
  }

}
