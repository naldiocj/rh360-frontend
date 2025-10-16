import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlistadoService } from '@resources/modules/sigef/core/service/alistado.service';
import { HelpserviceService } from '@resources/modules/sigef/core/service/helpservice.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  simpleForm!: FormGroup;
  totalBase: number = 0;
  public pagination = new Pagination();

  alistados: any = [];

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  constructor(
    private alistadosService: AlistadoService,
    private help: HelpserviceService
  ) {}

  ngOnInit(): void {
    this.buscarAlistados();
  }

  buscarAlistados() {
    this.alistadosService
      .listar(this.filtro)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.alistados = response.data;
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

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
  }

  public Recarregar() {
    return () => {
     this.help.recarregarPagina();
    };
  }
}
