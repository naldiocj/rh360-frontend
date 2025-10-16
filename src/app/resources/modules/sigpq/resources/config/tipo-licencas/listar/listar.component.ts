import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { TipoLicencasService } from '../../../../core/service/TipoLicencas.service';
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
  public licencas:any
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
  constructor(private licencaService:TipoLicencasService) { }

  ngOnInit() {

    this.buscarlicenca()
  }



  public setCargo(cargo: any) {
    this.cargo = cargo
  }

  public setIdAndRecarregar() {
    this.setCargo(null)
    this.buscarlicenca()
  }

  recarregarPagina()
  {
    this.buscarlicenca()
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
    this.buscarlicenca()
  }


  private buscarlicenca(): void {
    const options = { ...this.filtro };
    this.licencaService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.licencas = response.data
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  public eliminar(identificador:any)
  {
    this.licencaService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarlicenca()
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
    formData.append('dias_maximos', cargo.dias_maximos);
    formData.append('exige_anexo', cargo.exige_anexo);
    formData.append('limite_anual', cargo.limite_anual);
    formData.append('descricao', cargo.descricao?cargo.descricao:'sem descricao');
    this.licencaService.editar(formData,cargo.id).pipe(
      finalize(() => {
        this.buscarlicenca()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

  verificarLicenca(licenca:string): boolean {
    return !['DISCIPLINAR', 'FALTA', 'FALTAS', 'DISCIPLINA'].includes(licenca.toUpperCase())
  }

}
