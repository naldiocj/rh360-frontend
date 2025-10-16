import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';

import { Pagination } from '@shared/models/pagination';
import { CursoModel } from '@resources/modules/sigpq/shared/model/config/CursoModel.model';
import { CursoService } from '@core/services/config/Curso.service';
import { Select2OptionData } from 'ng-select2';
import { TipoDeFormacaoService } from '../../../../../../../core/services/config/TipoDeFormacao';

@Component({
  selector: 'app-sigpq-listar-direcao-ou-orgao',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public cursos: any[] = [];
  public curso: CursoModel = new CursoModel();


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
    tipo_formacao_id: 'null'
  }

  public tipoDeFormacao: Array<Select2OptionData>=[]
  constructor(private cursoService: CursoService,private tipoDeFormacaoService: TipoDeFormacaoService) { }

  ngOnInit(): void {
    this.listarTipoDeFormacao()
    this.listarCursos()
  }

  listarTipoDeFormacao() {
    const options = { };
    this.tipoDeFormacaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.tipoDeFormacao = [];
        this.tipoDeFormacao.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.tipoDeFormacao.push(...aux);
      //this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  listarCursos() {
    const options = { ...this.filtro };
    this.cursoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.cursos = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.tipo_formacao_id = 'null'
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
      this.filtro.tipo_formacao_id = $e;
    }

    this.listarCursos()
  }

  changePage(event: any, e: any) { }

  public setCurso(curso: any) {
    this.curso = curso
  }

  public setIdAndRecarregar() {
    this.setCurso(null)
    this.listarCursos()
  }
}
