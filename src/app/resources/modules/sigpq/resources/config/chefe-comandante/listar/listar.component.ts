import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChefiaComandoService } from '@resources/modules/sigpq/core/service/Chefia-Comando.service';
import { Pagination } from '@shared/models/pagination';
import { Subject, finalize, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { PatenteService } from '../../../../../../../core/services/Patente.service';
import { EstadosParaFuncionario } from '../../../../core/service/config/Estados-para-Funcionario.service';
import { TipoVinculoService } from '../../../../core/service/Tipo-vinculo.service';
import { TipoCarreiraOuCategoriaService } from '../../../../core/service/config/Tipo-carreira-ou-categoria.service';
import { SecureService } from '../../../../../../../core/authentication/secure.service';
import { DirecaoOuOrgaoService } from '../../../../../../../shared/services/config/DirecaoOuOrgao.service';
import { RegimeService } from '../../../../../../../core/services/Regime.service';
import { TipoEstruturaOrganica } from '../../../../../../../core/services/config/TipoEstruturaOrganica.service';
import { SituacaoEstadoService } from '../../../../core/service/config/Situacao-Estado.service';
import { TipoChefeComandoService } from '../../../../core/service/config/Tipo-Chefia-Comando.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit, OnDestroy {


  private destroy$ = new Subject<void>()
  public pagination: Pagination = new Pagination()
  public chefias: any[] = []
  public totalBase: number = 0
  filtro = {
    page: 1,
    perPage: 5,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    situacaoId: '1',
    //forcaPassiva: 'null',
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    funcao_id: 'null',
    search: '',
    idadeMais: 'null',
    idadeMenos: 'null',
    anoMais: 'null',
    anoMenos: 'null',
    orderby: 'null',
    dashboard: false,
  };
  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes: Array<Select2OptionData> = [];
  public patenteClasses: Array<Select2OptionData> = [];
  public patentes: Array<Select2OptionData> = [];
  public tipoOrgaos: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public tipoOrdenacao: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public tipoCargos: Array<Select2OptionData> = []
  public tituloSituacao: string = '';
  public carregando: boolean = false;
  public mostrarCarreira:boolean=false
  public _regimeSelecionado: string = 'null';
  public _classeSelecionada: string = 'null';

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  options_ordenar: any = {
    placeholder: 'Selecione uma opção',
    width: '140%',
  }; 

  constructor(private chefiaComandoService: ChefiaComandoService, private patenteService: PatenteService,
    private estadosParaFuncionarioService: EstadosParaFuncionario,private tipoVinculoService: TipoVinculoService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private sec: SecureService,private regimeService: RegimeService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
     private direcaoOuOrgaoService: DirecaoOuOrgaoService,
     private situacaoEstadoService: SituacaoEstadoService,
     private tipoCargoService: TipoChefeComandoService,
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngOnInit(): void {
    this.buscarChefiaComando()
    this.buscarRegimes();
    this.buscarTipoEstruturaOrganica();
    this.buscarSituacaoEstados();
    this.buscarTipoCargo();
    this.fillTipoOrdenacao()
  }

  get getAuth() {
    return this.sec.getTokenValueDecode();
  }

  fillTipoOrdenacao() {
    this.tipoOrdenacao.push({
      id: 'null',
      text: 'Padrão',
    });
    this.tipoOrdenacao.push({ id: 'PATENTE', text: 'Patente' });
    this.tipoOrdenacao.push({ id: 'NIP', text: 'Nip' });
    this.tipoOrdenacao.push({ id: 'NOME', text: 'Nome' });
  }

  private buscarSituacaoEstados() {
    this.situacaoEstadoService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          const aux = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          console.log(aux)
          this.situacaoEstados = [];
          this.situacaoEstados.push({
            id: 'null',
            text: 'Todos',
          });
          this.situacaoEstados.push(...aux);
        },
      });
  }

  buscarTipoCargo(): void {
      const opcoes = {}
      this.tipoCargoService.listar(opcoes)
        .pipe(
          finalize((): void => {
  
          })
        )
        .subscribe((response: any): void => {
          const aux = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          console.log(aux)
          this.tipoCargos = [];
          this.tipoCargos.push({
            id: 'null',
            text: 'Todos',
          });
          this.tipoCargos.push(...aux);
        })
    }

  buscarRegimes(): void {
    const opcoes = {};

    this.regimeService
      .listar(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.regimes = [];
        this.regimes.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.regimes.push(...aux);
      });
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico
      .listar({})
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = [];
        this.tipoEstruturaOrganicas.push({
          id: 'null',
          text: 'Todos',
        });

        const org = response.map((item: any) => ({
          id: item.sigla,
          text: item.name,
        }));

        // response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.tipoEstruturaOrganicas.push(...org);
      });
  }



  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' },
  ];

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;

    const opcoes = {
      tipo_estrutura_sigla: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.orgaos = [];
        this.orgaos.push({
          id: 'null',
          text: 'Todos',
        });

        const org = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        this.orgaos.push(...org);
      });

    this.filtrarPagina('tipoOrgaoId', $event);
  }
  private buscarChefiaComando() {
    this.carregando = true
    this.chefiaComandoService.listarTodos(this.filtro).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {
        this.carregando = false
      })
    ).subscribe({
      next: (response: any) => {
        this.chefias = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }
    })
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'regimeId') {
      this._regimeSelecionado =
        key == 'null' ? key : this.getNameFilterById($e, this.regimes);
      this.filtro.regimeId = $e;
      this.buscarTipoVinculo($e);
    } else if (key == 'patenteId') {
      this.filtro.patenteId = $e;
    } else if (key == 'tipoVinculoId') {
      this.filtro.tipoVinculoId = $e;
    } else if (key == 'tipoOrgaoId') {
      this.filtro.tipoOrgaoId = $e;
      this.filtro.orgaoId = 'null';
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    } else if (key == 'genero') {
      this.filtro.genero = $e;
    } else if (key == 'patenteClasse') {
      this._classeSelecionada =
        key == 'null' ? key : this.getNameFilterById($e, this.patenteClasses);
      this.filtro.patenteClasse = $e;
      this.buscarPatentes($e);
    } else if (key == 'situacaoId') {
      this.filtro.situacaoId = $e;
      this.selecionarSituacaoLaboral($e);
    } else if (key == 'estadoId') {
      this.filtro.estadoId = $e;
    } else if (key == 'idadeMenos') {
      this.filtro.idadeMenos = $e.target.value;
    } else if (key == 'idadeMais') {
      this.filtro.idadeMais = $e.target.value;
    } else if (key == 'anoMais') {
      this.filtro.anoMais = $e.target.value;
    } else if (key == 'anoMenos') {
      this.filtro.anoMenos = $e.target.value;
    } else if (key == 'orderby') {
      this.filtro.orderby = $e;
    } else if (key == 'funcao') {
      this.filtro.funcao_id = $e;
    }
    if (reiniciar) {
      this.filtro.page = 1;
    }
    this.filtro.dashboard = false;
    this.buscarChefiaComando()
  }

  getNameFilterById(id: string, array: any) {
    const foundItem = array.find(
      (item: { id: string; text: string }) => item.id == id
    );
    return foundItem ? foundItem.text : null; // Retorna o nome ou null se não encontrado
  }

  private buscarPatentes($event: any) {
    if (!$event || $event == 'null') {
      this.patentes = [];
      this.patentes.push({
        id: 'null',
        text: 'Todos',
      });
      return;
    }

    const options = {
      sigpq_tipo_carreira_id: $event,
    };

    this.patenteService
      .listar(options)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.patentes = [];
        this.patentes.push({
          id: 'null',
          text: 'Todos',
        });

        this.patentes.push(...aux);
        // this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))
      });
    // if (!$event || $event == 'null') return

    // const options = {
    //   classe: $event
    // }
    // this.patenteService.listar(options).pipe().subscribe((response: any): void => {

    //   const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))
    //   this.patentes = []
    //   this.patentes.push({
    //     id: 'null',
    //     text: 'Todos'
    //   })

    //   this.patentes.push(...aux)

    // })
  }
  
  buscarTipoVinculo($event: any): void {
    this.mostrarCarreira = false;
    this.tipoVinculos = [];
    if (!$event || $event == 'null') return;

    if ($event == 1) {
      this.mostrarCarreira = true;
    } else {
      this.mostrarCarreira = false;
    }

    const [regime] = this.regimes.filter((item: any) => item.id == $event);

    const opcoes = {
      regime: regime?.text,
    };
    let todos = true;
    this.tipoVinculoService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          if ($event == 1) {
            this.tipoVinculos = this.tipoVinculos.filter(
              (item: any) => item?.id == 1
            );
          }
        })
      )
      .subscribe((response: any): void => {
        this.tipoVinculos = [];
        this.tipoVinculos.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.tipoVinculos.push(...aux);
      });

    this.buscarTipoCarreiraOuCategoria($event);
  }

  private buscarTipoCarreiraOuCategoria(event: any): void {
    if (!event) return;

    const opcoes = {
      regime_id: event,
    };
    this.tipoCarreiraOuCategoriaService
      .listar(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.patenteClasses = [];
        this.patenteClasses.push({
          id: 'null',
          text: 'Todos',
        });

        let aux: any = response
          .filter((item: any) => item.nome.toUpperCase() !== "Tesoureiro".toUpperCase())
          .map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        this.patenteClasses.push(...aux);
        // this.tipoCarreiraOuCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))
        // this.tipoCarreiraOuCategorias_ = response;
      });
  }

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = '';

    if (!$event || $event == 'null') return;
    const [situacao] = this.situacaoEstados.filter(
      (item: any) => item.id == $event
    );
    if (!situacao) return;

    this.tituloSituacao = situacao.text;

    const options = {
      sigpq_situacao_estado_id: $event,
    };

    this.estadosParaFuncionarioService
      .listarTodos(options)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.estado = [];
          this.estado.push({
            id: 'null',
            text: 'Todos',
          });
          const aux = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

          this.estado.push(...aux);
        },
      });
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    
    this.buscarChefiaComando()
  }

  validarEliminar(item: any) {
      Swal.fire({
        title: 'Eliminar?',
        html: `Pretende eliminar <b>${item.nome_completo} do seu cargo </b>? Esta ação não poderá ser revertida!`,
        icon: 'warning',
        cancelButtonText: 'Cancelar',
        // timer: 2000,
        showCancelButton: true,
        confirmButtonText: 'Sim, Eliminar!',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary px-2 mr-1',
          cancelButton: 'btn btn-danger ms-2 px-2',
        },
      }).then((result: any) => {
        if (result.value) {
          this.eliminar(item.id);
        }
      });
    }

    eliminar(id: number) {
      this.chefiaComandoService
        .eliminar(id)
        .pipe(
          finalize(() => {
            this.buscarChefiaComando()
          })
        )
        .subscribe((response) => {
          
        });
    }

    
}
