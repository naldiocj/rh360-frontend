import { Component, OnInit } from '@angular/core';
import { ModuloService } from '@core/services/config/Modulo.service';
import { RoleService } from '@core/services/config/Role.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-listar-utilizador',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public funcoes: any[] = [];
  public funcao: any = null
  public modulos: Array<Select2OptionData> = [];

  public pagination = new Pagination();
  public carregando: boolean = false;

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 10,
    // modulo: 1,
    search: ""
  }

  constructor(private moduloService: ModuloService, private roleService: RoleService) { }

  ngOnInit(): void {
    this.buscarFuncoes()
    this.buscarModulos()
  }

  buscarModulos(): void {
    const opcoes = {}
    this.moduloService.listar(opcoes)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response) => {
        this.modulos = []
        this.modulos.push({
          id: 'null',
          text: 'Todos'
        })
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome
        }))
        this.modulos.push(...aux)

      })
  }

  buscarFuncoes() {

    const options = {modulo: 1, ...this.filtro };

    this.carregando = true;
    this.roleService.listar(options).pipe(
      finalize(() => {
        this.carregando = false;
      }),
    ).subscribe((response) => {
      this.funcoes = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.buscarFuncoes()
    this.clearItem()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } 
    // else if (key == 'modulo') {
     
    //   this.filtro.modulo = $e;
    // }

    this.buscarFuncoes()
  }

  changePage(event: any, e: any) { }


  setItem(item: any) {
    this.funcao = item;
  }

  clearItem() {
    this.funcao = null;
  }
}