import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { RegimeService } from '../../../../../../../core/services/Regime.service';
import { TipoFuncaoService } from '../../../../core/service/config/TipoFuncao.service';
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
  public funcoes: any[] = [];
  public curso:any

  public pagination = new Pagination();
  public carregando: boolean = false;

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    regime: ''
  }
  public regimes: Array<Select2OptionData> = []

  constructor(private regimeService: RegimeService,
    private tipoFuncaoService: TipoFuncaoService,) { }

    private buscarFuncao(): void {
      const options = { ...this.filtro };
      this.tipoFuncaoService.listar(options)
        .pipe(
          finalize((): void => {

          })
        )
        .subscribe((response: any): void => {
          this.funcoes = response.data
          this.pagination = this.pagination.deserialize(response.meta);
        })
    }


  private buscarRegime(): void {
    const opcoes = {}
    this.regimeService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.regimes=response.map((item: any) => ({ id: item.id, text: item.nome }));
        this.regimes.push({ id: 'null', text: 'Todos' })
      })
  }

  ngOnInit(): void {
    this.buscarFuncao()
    this.buscarRegime()
  }



  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.regime = 'null'
    this.buscarFuncao()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e.target.value;
    }
    else if (key == 'regime') {
      this.filtro.regime = $e;
    }

    this.buscarFuncao()
  }

  changePage(event: any, e: any) { }

  public setCurso(curso: any) {
    this.curso = curso
  }

  public setIdAndRecarregar() {
    this.setCurso(null)
    this.buscarFuncao()
  }

  public eliminar(identificador:any)
  {
    this.tipoFuncaoService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarFuncao()
      })
    ).subscribe((sucess:any) => {
      console.log("Resultado:",sucess)
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }
}
