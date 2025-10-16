import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from '@core/services/Provincia.service';
import { PessoaFisicaModel } from '@resources/modules/sigpq/shared/model/config/PessoaFisicaModel.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public provincias: any[] = [];
  public pessoaFisica: PessoaFisicaModel = new PessoaFisicaModel();

  public pagination = new Pagination();
  public carregando: boolean = false;
  public item: any

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    tipoOrgao: 'null'
  }

  constructor(private provinciaService: ProvinciaService) { }

  ngOnInit(): void {
    this.buscarProvincia()

  }



  buscarProvincia(op: any = null) {
    const options = { ...this.filtro, ...op };
    this.provinciaService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.provincias = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.tipoOrgao = 'null'
    this.buscarProvincia()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarProvincia()
  }

  changePage(event: any, e: any) { }

  public setItem(item: any) {
    this.item = item
  }

  public setItemNull() {
    this.item = null
    this.recarregarPagina()
  }

}
