import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { ModalService } from '@core/services/config/Modal.service';
import { ModuloService } from '@core/services/config/Modulo.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { PerfisOperativoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/perfis/perfis_operativo/perfis-operativo.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfis-listar-utilizador',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarPerfisComponent implements OnInit {
  public utilizadores: any[] = [];
  public utilizador: any;


  public pagination = new Pagination();

  totalBase: number = 0

  options = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  filtro = {
    page: 1,
    perPage: 5,
    moduloId: 'null',
    orgaoId: 'null',
    estado: 'null',
    tipoOrgao: null,
    search: "",

  }




  estados: Array<Select2OptionData> = [{

    id: 'null',
    text: 'Todos'
  },
  {

    id: '1',
    text: 'Inactivo'
  },
  {
    id: '2',
    text: 'Activo'
  }

  ]
  modulos: Array<Select2OptionData> = []
  tipo = [
    {
      id: 0,
      text: "Todos"
    },
    {
      id: 1,
      text: "Sem conta"
    },
    {
      id: 2,
      text: "Tem Conta"
    },
  ]


  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = []

  constructor(private perfisOperativoService: PerfisOperativoService, private direcaoOuOrgaoService: DirecaoOuOrgaoService, private estruturaOrganicaServico: TipoEstruturaOrganica, private sec: SecureService, private moduloService: ModuloService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.buscarUtilizadores()
    this.buscarModulos()
    this.buscarTipoEstruturaOrganica()
  }

  buscarModulos(): void {
    const opcoes = {}
    this.moduloService.listar(opcoes)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response) => {
        this.modulos = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome
        }))

      })
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }


  buscarUtilizadores() {

    const options = { ...this.filtro };

    // this.isLoading = true;
    this.perfisOperativoService.listar(options).pipe(
      finalize(() => {
        // this.isLoading = false;
      }),
    ).subscribe((response) => {
      this.utilizadores = response.data; 
      console.log('NET:', this.utilizadores)
      
      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);

    });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.search = ""
    this.filtro.perPage = 5
    this.filtro.moduloId = 'null'
    this.filtro.orgaoId = 'null'
    this.filtro.estado = 'null'
    this.filtro.tipoOrgao = null
    this.buscarUtilizadores()
  }



  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'moduloId') {
      this.filtro.moduloId = $e;
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    } else if (key == 'estado') {
      this.filtro.estado = $e;
    }
    this.buscarUtilizadores()
  }


  editar(utilizador: any) {
    console.log(utilizador)
    this.utilizador = utilizador
  }

  visualizar(utilizador: any) {
    this.utilizador = utilizador

  }

  registar() {
    this.utilizador = null
  }

  public actualizarTabela() {
    this.registar()
    this.buscarUtilizadores()
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  get getAuth() {
    return this.sec.getTokenValueDecode()
  }
}