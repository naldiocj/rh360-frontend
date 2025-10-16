import { Component, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { DisciplinarModel } from '@resources/modules/sigpj/shared/model/disciplinar.model';
import { finalize } from 'rxjs';
import { EstadoHelper } from '@resources/modules/sigpj/core/helper/CoresEstados.helper';

@Component({
  selector: 'app-sigpj-processo-disciplinar-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {

  public disciplinars: Array<any> = []
  public isLoading: boolean = false;

  public pagination = new Pagination();
  totalBase: number = 0;
  novoProcesso: any;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  estados = ['P', 'E', 'A', 'C', 'R']

  constructor(
    private disciplinar: DisciplinarService,
  ) { }

  ngOnInit() {
    this.buscarDisciplinar();
  }

  setDisciplinar(item: DisciplinarModel) {
    this.novoProcesso = item;
  }

  buscarCor(estado: string) {
    return EstadoHelper.buscarCor(estado) || '#000000';
  }

  buscarTexto(letra: string) {
    return EstadoHelper.buscarTexto(letra) || 'Pendente';
  }

  buscarDisciplinar() {
    this.isLoading = true;
    this.disciplinar
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.disciplinars = response.data;
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
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
    this.buscarDisciplinar();
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.search = '';
    this.buscarDisciplinar();
  }

  removerModal() {
    $('.modal-arguidos').hide();
    $('.modal-backdrop').hide();
  }
}
