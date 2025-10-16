import { Component, Input, OnInit } from '@angular/core';

import { Pagination } from '@shared/models/pagination';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '@resources/modules/sigpq/core/service/Evento.service';

@Component({
  selector: 'app-sigpq-portal-agente',
  templateUrl: './portal-agente.component.html',
  styleUrls: ['./portal-agente.component.css']
})
export class PortalAgenteComponent implements OnInit {

  totalBase: number = 0
  @Input() pessoaId: any = 5
  public pagination = new Pagination()
  pendentes: Array<any> = []

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: "",
    estado: 'P',
    pessoafisica_id: this.buscarPessoaId()
  }

  constructor(
    private eventoService: EventoService,
    private secureService: SecureService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.buscarEventosPendentes()
  }

  buscarEventosPendentes() {

    this.eventoService
      .listarPorEstado(this.filtro)
      .subscribe((response) => {

        this.pendentes = response.data;

        console.log("Buscar dados dos eventos:",response)

        this.totalBase = response?.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  buscarPessoaId(): number {
    return this.router.snapshot.params['id'] as number;
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarEventosPendentes()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarEventosPendentes()
  }

  public get getPessoaId() {
    return this.secureService.getTokenValueDecode().pessoa.id as number;
  }

}
