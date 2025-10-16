import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { CursoService } from '@core/services/config/Curso.service';
import { Select2OptionData } from 'ng-select2';
import { TipoDeFormacaoService } from '../../../../../../../core/services/config/TipoDeFormacao';

@Component({
  selector: 'app-sigpq-listar-direcao-ou-orgao',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public tipoDeFormacaos: any[] = [];
  public tipoDeFormacao:any;


  public pagination = new Pagination();
  public carregando: boolean = false;

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    search: "",
    tipo: 'null'
  }


  constructor(private tipoDeFormacaoService: TipoDeFormacaoService) { }

  ngOnInit(): void {
    this.listarCursos()
  }

  listarCursos() {
    const options = { ...this.filtro };
    this.tipoDeFormacaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.tipoDeFormacaos = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.tipo = 'null'
    this.listarCursos()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    else if (key == 'tipo') {
      this.filtro.tipo = $e;
    }

    this.listarCursos()
  }

  changePage(event: any, e: any) { }

  public setCurso(tipoDeFormacao: any) {
    this.tipoDeFormacao = tipoDeFormacao
  }

  public setIdAndRecarregar() {
    this.setCurso(null)
    this.listarCursos()
  }
}
