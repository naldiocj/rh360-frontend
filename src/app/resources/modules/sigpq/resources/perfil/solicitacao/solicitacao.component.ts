import { Component, Input, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { SolicitacaoService } from '@resources/modules/pa/core/service/solicitacao.service';
import { Pagination } from '@shared/models/pagination';
import { finalize, first } from 'rxjs';
import { RelatorioLicencaService } from '../../../core/service/Relatorio-licenca.service';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-sigpq-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css'],
})
export class SolicitacaoComponent implements OnInit {
  @Input() pessoaId: any;
  totalBase: number = 0;

  @Input() funcionario: any;

  public solicitacao: any
  fileUrl: any = null

  public pagination: Pagination = new Pagination();
  public solicitacoes: any = [];
  public carregando: boolean = false;
  public solicitacao_id!: number | null;

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,

  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    private utilService: UtilService,
    private secureService: SecureService,
    private relatorioService: RelatorioLicencaService,
  ) {

    this.filtro.orgao = this.secureService.getTokenValueDecode().orgao.id
  }

  ngOnInit(): void {
    // this.buscarSolicitacoes();
    // this.fillTipoBancos();
    // this.fillTipoDeclaracao();
  }

  private buscarSolicitacoes() {
    this.carregando = true;
    this.solicitacaoService
      .listar({ ...this.filtro, agente_id: this.getPessoaId })
      .pipe(
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.solicitacoes = response.data;



          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  public filtrarPagina(key: any, event: any) {
    if (key == 'page') {
      this.filtro.page = event;
    } else if (key == 'perPage') {
      this.filtro.perPage = event.target.value;
    } else if (key == 'search') {
      this.filtro.search = event;
    }
    this.buscarSolicitacoes();
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarSolicitacoes();
  }

  public get getPessoaId(): number {
    return this.pessoaId as number;
  }
  public getEstado(status: any): any {
    return this.utilService.estado(status);
  }

  public setId(id: number | null) {
    this.solicitacao_id = id;
  }

  public wipeId() {
    this.solicitacao_id = null;
  }

  public get getFuncionario(): any {

    return this.funcionario;
  }

  public darTratamento(estado: any): boolean {
    return (estado == 'E' || estado == 'P') ? true : false;
  }
  public setSolicitacao(item: any) {
    this.solicitacao = item;
  }

  tipoBancos:Array<Select2OptionData>=[]
  fillTipoBancos() {
    this.tipoBancos.push({ id: 'BFA', text: 'BFA - Banco de Fomento Angola' });
    this.tipoBancos.push({ id: 'BAI', text: 'BAI - Banco Angolano de Investimentos' });
    this.tipoBancos.push({ id: 'BCI', text: 'BCI - Banco Comercial e Industrial' });
    this.tipoBancos.push({ id: 'BPC', text: 'BPC - Banco de Poupança e Crédito' });
    this.tipoBancos.push({ id: 'BIC', text: 'BIC - Banco Internacional de Crédito' });
    this.tipoBancos.push({ id: 'BANC', text: 'BANC - Banco Nacional de Angola' });
    this.tipoBancos.push({ id: 'ATL', text: 'ATL - Banco Atlântico' });
    this.tipoBancos.push({ id: 'KEVE', text: 'KEVE - Banco Keve' });
    this.tipoBancos.push({ id: 'SOL', text: 'SOL - Banco Sol' });
    this.tipoBancos.push({ id: 'VTB', text: 'VTB - VTB África' });
    this.tipoBancos.push({ id: 'FNB', text: 'FNB - First National Bank Angola' });
    this.tipoBancos.push({ id: 'BCGA', text: 'BCGA - Banco Caixa Geral Totta de Angola' });
    this.tipoBancos.push({ id: 'BCH', text: 'BCH - Banco Comercial do Huambo' });
    this.tipoBancos.push({ id: 'BIR', text: 'BIR - Banco de Investimento Rural' });
    this.tipoBancos.push({ id: 'BMAIS', text: 'BMAIS - Banco Mais' });
    this.tipoBancos.push({ id: 'BVB', text: 'BVB - Banco Valor' });
    this.tipoBancos.push({ id: 'SBA', text: 'SBA - Standard Bank Angola' });
    this.tipoBancos.push({ id: 'BDA', text: 'BDA - Banco de Desenvolvimento de Angola' });
    this.tipoBancos.push({ id: 'BESA', text: 'BESA - Banco Espírito Santo Angola' });
    this.tipoBancos.push({ id: 'BEE', text: 'BEE - Banco Económico' });
  }

  tipoDeDeclaracaos: Array<Select2OptionData>=[];
  fillTipoDeclaracao() {
    this.tipoDeDeclaracaos.push({
      id: 'null',
      text: 'Nenhum',
    });
    this.tipoDeDeclaracaos.push({ id: 'EFETIVIDADE', text: 'De Efectividade' });
    this.tipoDeDeclaracaos.push({ id: 'CONDUCAO', text: 'De Carta de Condução' });
    this.tipoDeDeclaracaos.push({ id: 'CASAMENTO', text: 'De Casamento' });
    this.tipoDeDeclaracaos.push({ id: 'CONTA', text: 'De Abertura de Conta' });
  }

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public setNullSolicitacao() {
    this.solicitacao = null;
  }
  tipoDeDeclaracao:any='';
  bancoSelecionado:any='';
   visualizarDocumento()
   {
    
     /*  this.gerarDocumentoParaLicencaDoTipo=type
      this.showModal('modalVisualizarFichaDoEfectivoComBaseALicenca')
      this.licenca_disciplinarComponent.atualizarTodosOsDados() */
      this.showModal('modalGerarModeloEfetividade')
      
   }

   gerarDeclaracao() {
    this.carregando = true;
    switch (this.tipoDeDeclaracao) {
      case 'EFETIVIDADE':
        this.declaracaoDeEfectividade('efectividade');
        break;
      case 'CONTA':
        this.declaracaoDeConta();
        break;
      case 'CONDUCAO':
          this.declaracaoDeEfectividade('efeito de Carta de Condução');
          break;
      case 'CASAMENTO':
            this.declaracaoDeEfectividade('efeito de enlace matrimonial');
            break;
      // Adicione outros casos conforme necessário
      default:
        console.warn('Tipo de declaração não reconhecido:', this.tipoDeDeclaracao);
        break;
    }
  }
  
 
  declaracaoDeConta() {
    // Lógica específica para declaração de conta bancária
    if (!this.bancoSelecionado) {
      alert('Por favor, selecione um banco');
      this.carregando = false;
      return;
    }
    this.declaracaoDeEfectividade('efeito de abertura de conta Bancária junto do '+this.getNomeBancoPorId(this.bancoSelecionado));
  }

  getNomeBancoPorId(id: string): string {
    const banco = this.tipoBancos.find(b => b.id === id);
    if (!banco) return 'Banco não encontrado'; // ou retorne null/undefined se preferir
    
    // Remove a parte da sigla e o traço
    const nomeCompleto = banco.text.split(' - ')[1];
    return nomeCompleto || banco.text; // Fallback caso não encontre o separador
  }

   declaracaoDeEfectividade(efeitos:any=null)
   {
     const options = {
        ...this.filtro
        , pessoafisica_id: this.getPessoaId,
        efeito:efeitos
      }
      this.relatorioService.gerarModeloEfetividade(options)
            .pipe(
              first(),
              finalize(() => {
                this.carregando = false;
              })
            ).subscribe((response:any) => {
              this.fileUrl = this.relatorioService.createImageBlob(response);
            });
   }

   showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  fecharModalRelatorio() {
    this.fileUrl = null
    this.relatorioService.cancelarGeracaoRelatorio()
  }
}
