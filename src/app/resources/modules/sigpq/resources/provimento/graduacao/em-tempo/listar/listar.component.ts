import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { PromoverModalComponent } from '../promover-modal/promover-modal.component';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';

@Component({
  selector: 'app-sigpq-provimento-promocao-em-tempo-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  @ViewChild('promoverModalComponent') public promoverModalComponent!: PromoverModalComponent;

  public pagination = new Pagination()

  emTempos: any[] = []
  emTempo: any
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: "",
    tipo: 'GRADUACAO'
  }

  constructor(private provimentoService: ProvimentoService, private propostaProvimentoService: PropostaProvimentoService) { }

  ngOnInit(): void {
    this.buscarPromocaoEmTempo()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.buscarPromocaoEmTempo()
  }

  buscarPromocaoEmTempo() {

    const options = { ...this.filtro };

    this.propostaProvimentoService.listar_promocao_emTempo(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {

      this.emTempos = response.data;

      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);

    });
  }

  novoAcidente() {
    // this.emTempo = new AcidenteModel()
  }

  setAvaria(item: any) {
    this.emTempo = item
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarPromocaoEmTempo()
  }

  setEmTempo(item: any) {
    this.emTempo = item
    // this.promoverModalComponent?.setEmTempo(item)
  }

  construcao() {
    alert('Em construção')
  }
}
