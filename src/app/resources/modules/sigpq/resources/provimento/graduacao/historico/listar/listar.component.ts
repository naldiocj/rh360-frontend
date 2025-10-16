import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-provimento-promocao-em-tempo-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public pagination = new Pagination()

  historicos: any[] = []
  emTempo: any
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: "",
    tipo: 'GRADUACAO'
  }

  constructor(private provimentoService: ProvimentoService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buscarHistoricos()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.buscarHistoricos()
  }

  buscarHistoricos() {

    this.provimentoService.listarHistorico(this.getId, this.filtro).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      //

      this.historicos = response;

      // this.totalBase = response.meta.current_page ?
      //   response.meta.current_page === 1 ? 1
      //     : (response.meta.current_page - 1) * response.meta.per_page + 1
      //   : this.totalBase;

      // this.pagination = this.pagination.deserialize(response.meta);

    });
  }

   public get getId() {
    return this.route.snapshot.params["id"] as number
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarHistoricos()
  }

  construcao() {
    alert('Em construção')
  }
}
