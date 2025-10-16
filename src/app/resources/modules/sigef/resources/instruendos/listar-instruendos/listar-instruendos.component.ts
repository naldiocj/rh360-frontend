import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlistadoService } from '@resources/modules/sigef/core/service/alistado.service';
import { InstruendoService } from '@resources/modules/sigef/core/service/instruendos.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-instruendos',
  templateUrl: './listar-instruendos.component.html',
  styleUrls: ['./listar-instruendos.component.css'],
})
export class ListarInstruendosComponent implements OnInit {
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  }

  instruendos: any = [];
  totalBase: number = 0;
  public pagination = new Pagination();
  simpleForm!: FormGroup;

  constructor(
    private instruendosService: InstruendoService
    ) {}

  ngOnInit(): void {
    this.buscarInstruendos();
  }


  buscarInstruendos() {
    const options = { ...this.filtro }
    this.instruendosService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.instruendos = response.data;
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

  recarregarPagina(){
    this.filtro.page = 1;
    this.instruendos()
  }

  public Recarregar(){
    var filtro:any;
    this.filtro =  filtro = {
      page: 1,
      perPage: 10,
      regime: 1,
      search: '',
    }; 
  }


  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarInstruendos();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
