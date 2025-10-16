import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { RegistarOuEditarComponent } from '../registar-ou-editar/registar-ou-editar.component';
import { PlanoLicencasService } from '../../../../core/service/PlanoLicencas.service';
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
  constructor(private planolicencaService:PlanoLicencasService) { }

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
    this.planolicencaService.listar(options)
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
    this.planolicencaService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarlicenca()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

  toggleActive(cargo:any)
  {
    const formData = new FormData();
    formData.append('activo',cargo.activo==1?'false':'1')
    this.planolicencaService.alterarStadoActivo(formData,cargo.id).pipe(
      finalize(() => {
        this.buscarlicenca()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

}
