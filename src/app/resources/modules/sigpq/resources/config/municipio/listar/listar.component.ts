import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from '@core/services/Provincia.service';
import { MunicipioService } from '@resources/modules/sigpq/core/service/config/Municipio.service';
import { PessoaFisicaModel } from '@resources/modules/sigpq/shared/model/config/PessoaFisicaModel.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public municipios: any[] = [];
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
    provincia_id: 'null'
  }

  public provincias: Array<Select2OptionData> = []

  constructor(private municipioService: MunicipioService, private provinciaService: ProvinciaService) { }

  ngOnInit(): void {
    this.buscarMunicipios()
    this.buscarProvincias()


  }

  private buscarProvincias() {
    this.provinciaService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.provincias = []
        this.provincias.push({ id: 'null', text: 'Todos' })
        const provincias_ = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.provincias.push(...provincias_)
      }
    })
  }


  buscarMunicipios(op: any = null) {
    const options = { ...this.filtro, ...op };
    this.municipioService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.municipios = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.provincia_id = 'null'
    this.buscarMunicipios()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    else if (key == 'provincia_id') {
      this.filtro.provincia_id = $e;
    }
    this.buscarMunicipios()
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
