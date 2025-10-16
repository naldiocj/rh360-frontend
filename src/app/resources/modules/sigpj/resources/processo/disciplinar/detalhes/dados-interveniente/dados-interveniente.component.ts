import { Component, Input, OnInit } from '@angular/core';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-sigpj-processo-detalhes-dados-interveniente',
  templateUrl: './dados-interveniente.component.html',
  styleUrls: ['./dados-interveniente.component.css']
})
export class DadosIntervenienteComponent implements OnInit {

  @Input() disciplinarId: number = 0

  public intervenientes?: any

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
    disciplinar_id: null
  };

  public isLoading: boolean = false;
  public pagination = new Pagination();
  totalBase: number = 0;

  public todosIntervenientes: any[] = [];

  constructor(
    private arguidoServico: ArguidoDisciplinarService,
  ) { }

  ngOnInit(): void {
    this.buscarIntervenientes()
  }

  public get getId() {
    return this.disciplinarId as number;
  }

  filtrar(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarIntervenientes();
  }

  recarregar() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarIntervenientes();
  }

  buscarIntervenientes() {

    if (!this.getId) {
      return
    }

    const options = {
      ...this.filtro,
      disciplinar_id: this.getId
    }

    this.isLoading = true;
    this.arguidoServico
      .listarTodos(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.intervenientes = response.data;
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

}
