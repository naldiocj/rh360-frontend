import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { FeriadosService } from '../../../../core/service/config/Feriados.service';
import { Select2OptionData } from 'ng-select2';
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
  public feriados:any
  public feriado:any

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    search: '',
    licenca_aplicada:'null',
    searchBy:'nome'
  }

  public licencas_aplicadas: Array<Select2OptionData> = [];
  constructor(private feriadosService:FeriadosService) { }

  ngOnInit() {
    this.licencas_aplicadas.push({ id: 'null', text: 'Todos'})
    this.licencas_aplicadas.push({ id: '1', text: 'Considerado como um Feriado'})
    this.licencas_aplicadas.push({ id: '2', text: 'Considerado como Indisponível'})
    this.buscarferiados()
  }

  public setFeriado(feriado: any) {
    this.feriado = feriado
  }

  public setIdAndRecarregar() {
    this.setFeriado(null)
    this.buscarferiados()
  }

  recarregarPagina()
  {
    this.buscarferiados()
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e.target.value;
    }
    else if (key == 'licenca_aplicada') {
      this.filtro.licenca_aplicada = $e;
    }
    this.buscarferiados()
  }


  private buscarferiados(): void {
    const options = { ...this.filtro };
    this.feriadosService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.feriados = response.data
        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  public eliminar(identificador:any)
  {
    this.feriadosService.eliminar(identificador).pipe(
      finalize(() => {
        this.buscarferiados()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

  toggleActive(ativar:number,feriado:any)
  {
    const formData = new FormData();
    formData.append('activo', ativar==1?'false':'1');
    formData.append('nome', feriado.nome);
    formData.append('observacoes', feriado.observacoes);
    formData.append('dia_selecionado', feriado.dia_selecionado);
    formData.append('licenca_aplicada', feriado.licenca_aplicada);
    formData.append('descricao', feriado.descricao?feriado.descricao:'sem descricao');
    this.feriadosService.editar(formData,feriado.id).pipe(
      finalize(() => {
        this.buscarferiados()
      })
    ).subscribe((sucess:any) => {
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }
  }

}
