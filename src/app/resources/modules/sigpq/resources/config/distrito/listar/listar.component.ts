import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from '@core/services/Provincia.service';
import { DistritoService } from '@resources/modules/sigpq/core/service/config/Distrito.service';
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

  public distritos: any[] = []
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
    provincia_id: null,
    municipio_id: null
  }

  public provincias: Array<Select2OptionData> = []
  public municipios: Array<Select2OptionData> = []

  constructor(private municipioService: MunicipioService, private provinciaService: ProvinciaService, private distritoService: DistritoService) { }

  ngOnInit(): void {
    this.buscarProvincias()
    this.buscarDistritos()


  }

  private buscarProvincias() {
    this.provinciaService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.provincias = []
        this.provincias.push({
          id: 'null',
          text: 'Todos'
        })
        const prs = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.provincias.push(...prs)
      }
    })
  }


  buscarDistritos(op: any = null) {
    const options = { ...this.filtro, ...op };
    this.distritoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.distritos = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.provincia_id = null
    this.filtro.municipio_id = null
    this.buscarDistritos()
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
      this.handlerProvincia($e)
    }
    else if (key == 'municipio_id') {
      this.filtro.municipio_id = $e;
    }
    this.buscarDistritos()
  }

  public handlerProvincia($event: any) {
    if (!$event) return

    const options = { provincia_id: $event };
    this.municipioService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.municipios = []
      this.municipios.push({
        id: 'null',
        text: 'Todos'
      })
      const ms = response.map((m: any) => ({ id: m.id, text: m.nome }));
      this.municipios.push(...ms)

    });
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
