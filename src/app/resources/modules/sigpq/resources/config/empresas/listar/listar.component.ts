import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';


import { Pagination } from '@shared/models/pagination';
import { CursoModel } from '@resources/modules/sigpq/shared/model/config/CursoModel.model';
import { Select2OptionData } from 'ng-select2';
import { EmpregasService } from '../../../../../../../core/services/config/Empregas.service';

@Component({
  selector: 'app-sigpq-listar-direcao-ou-orgao',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public instituicaes_de_ensino: any[] = [];
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
    search: ""
  }

  public tipoDeFormacao: Array<Select2OptionData>=[]
  constructor(private empresasService:EmpregasService) { }

  ngOnInit(): void {
    this.listarInstituicaoDeEnsino()
  }

 

  listarInstituicaoDeEnsino() {
    const options = {...this.filtro };
    this.empresasService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.instituicaes_de_ensino=response.data
      console.log("ISNTITUIÇÕES:",this.instituicaes_de_ensino)
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  public eliminar(identificador:any)
  {
    this.empresasService.eliminar(identificador).pipe(
      finalize(() => {
        this.listarInstituicaoDeEnsino()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

  toggleActive(ativar:number,cargo:any)
  {
    const formData = new FormData();
    formData.append('activo', ativar==1?'false':'1');
    formData.append('nome', cargo.nome);
    formData.append('sigla', cargo.sigla);
    formData.append('descricao', cargo.descricao?cargo.descricao:'sem descricao');
    this.empresasService.editar(formData,cargo.id).pipe(
      finalize(() => {
        this.listarInstituicaoDeEnsino()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.listarInstituicaoDeEnsino()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.listarInstituicaoDeEnsino()
  }

  changePage(event: any, e: any) { }

  public setCurso(curso: any) {
    this.curso = curso
  }

  public setIdAndRecarregar() {
    this.setCurso(null)
    this.recarregarPagina()
  }
}
