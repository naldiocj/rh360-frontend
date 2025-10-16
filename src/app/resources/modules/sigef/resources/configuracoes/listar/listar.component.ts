import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HabilitacoesService } from '@resources/modules/sigef/core/service/habilitacoes.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {


  public pagination = new Pagination();
  simpleForm!: FormGroup;
  habilitacoes: any = []
  totalBase: number = 0


  filtro = {
    page: 1,
    perPage: 1,
    regime: 1,
    search: ''
  }

  constructor(
    private habilitacoesService: HabilitacoesService,
  ) { }

  ngOnInit(): void {
    this.buscarHabilitacoes()
  }


  buscarHabilitacoes() {
    this.habilitacoesService
      .listar(this.filtro)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.habilitacoes = response.data;
          console.log(response);

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }
  

  filtrarPagina (key: any, $e: any){
    if(key == 'page'){
      this.filtro.page = $e;
    }else if (key == 'perPage'){
      this.filtro.perPage = $e.target.value;
    }else if(key == 'search'){
      this.filtro.search = $e;
    }
  }


}
