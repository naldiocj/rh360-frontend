import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { TipoCargoService } from '../../../../core/service/Tipo-cargo.service';
import { RegistarOuEditarComponent } from '../registar-ou-editar/registar-ou-editar.component';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit,AfterViewInit {

  @ViewChild('editarOrEliminar', { static: false }) editarOrEliminarComponent!: RegistarOuEditarComponent

  ngAfterViewInit() {
    if (this.editarOrEliminarComponent) {
      this.editarOrEliminarComponent.createForm();
    }
  }

  public pagination = new Pagination();
  public carregando: boolean = false;
  public cargos:any
  public cargo:any

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    searchBy:'nome'
  }
  constructor(private cargosService:TipoCargoService) { }

  ngOnInit() {

    this.buscarcargos()
  }

  public setCargo(cargo: any) {
    this.cargo = cargo
  }

  public setIdAndRecarregar() {
    this.setCargo(null)
    this.buscarcargos()
  }

  recarregarPagina()
  {
    this.buscarcargos()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e.target.value;
    }
    /* else if (key == 'regime') {
      this.filtro.regime = $e;
    } */
    this.buscarcargos()
  }


  private buscarcargos(): void {
    const options = { ...this.filtro };
    this.cargosService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.cargos = response.data
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  public eliminar(identificador:any)
  {
    this.cargosService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarcargos()
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
    formData.append('ordem', cargo.ordem);
    formData.append('descricao', cargo.descricao?cargo.descricao:'sem descricao');
    this.cargosService.editar(formData,cargo.id).pipe(
      finalize(() => {
        this.buscarcargos()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

}
