import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import Swal from 'sweetalert2';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { DelituosoTratamentoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delituoso_tratamento/delituoso_tratamento.service';
import { ProcuradosService } from '@resources/modules/sicgo/core/service/piquete/dinfop/procurados/procurados.service';
import { PaisService } from '@core/services/Pais.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { Select2OptionData } from 'ng-select2';
import { AuthService } from '@core/authentication/auth.service';
import { RegistoBiometricoComponent } from '../modal/registo-biometrico/registo-biometrico.component';

interface DelituosoSet {
  id: number;
  antecedentes: [
    {
      id: number;
    }
  ];
}

interface DelituosoOrigem {
  id: number;
  resultado_processo: [
    {
      id: number;
    }
  ];
  situacao_condenado: [
    {
      id: number;
    }
  ];
}
@Component({
  selector: 'app-listar-delituosos',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  @ViewChild(RegistoBiometricoComponent)
  registoBiometrico!: RegistoBiometricoComponent;
  @Output() enviarItem: EventEmitter<any> = new EventEmitter<any>();

  delituosos: any[] = [];
  selectedIds: any = [];

  isPhotoViewerOpen = false;
  selectedPhotoUrl = '';
  selectedPhotoId?: number;

  isExpanded: boolean = false;
  idade: any;
  isEditMode: boolean = false;

  public pais: Array<Select2OptionData> = [];
  public provincia: Array<Select2OptionData> = [];
  public municipio: Array<Select2OptionData> = [];

  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  public isLoading: boolean = false;
  public pagination = new Pagination();
  public isCameraActive: boolean = false;
  fotodfault = '../../../../../../../../assets/assets_sicgo/img/logopolice.png';
  totalBase: number = 0;
  NovoProcesso: any;

  filtro = {
    search: '',
    status: '',
    idade: 0,
    page: 1,
    perPage: 5,
    sicgo_nacionalidade_id: null,
    genero: null,
    sicgo_estadocivil_id: null,
    sicgo_provincia_id: null,
    sicgo_municipio_id: null,
    sicgo_naturalidade_id: null,
  };

  public delituoso: any;
  public isOffcanvasVisible: number | any = 0; 
  public isForID: number | any;
  public isOffVisible: DelituosoSet = {
    id: 0, // Valor padrão
    antecedentes: [
      {
        id: 0, // Valor padrão
      },
    ],
  };

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public isProcesso: string | null = null;
  fileUrl: any;

  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private municipioService: MunicipioService,
    private procuradosService: ProcuradosService,
    private delituosoTratamentoService: DelituosoTratamentoService,
    public authService: AuthService,
    private secureService: SecureService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef,
    private ficheiroService: FicheiroService,
    private dinfopDelitousoService: DinfopDelitousoService
  ) {}

  ngOnInit() {
    this.buscarDelituoso();
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarPais();
  }

  ngAfterViewInit(): void {
    const tabMain = this.el.nativeElement.querySelector('.tab__content');
    const modal = this.el.nativeElement.querySelector('.modal');

    console.log(tabMain, modal); // Verifique se os elementos estão sendo encontrados

    if (tabMain) {
      this.renderer.addClass(tabMain, 'liquid-effect');
    }

    if (modal) {
      this.renderer.setStyle(modal, 'filter', 'none');
    }
  }

  

  buscarPais() {
    const options = {};
    this.paisService
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any) => {
          this.pais = response.map((item: any) => ({
            id: item.id,
            text: item.nacionalidade,
          }));
        },
      });
  }

  getSavedFingerprints(selectedDelituoso: any) {
    this.registoBiometrico.openScanner();
    this.registoBiometrico.getSavedFingerprints(selectedDelituoso.id);
  }

  buscarMunicipio() {
    const options = {};
    this.municipioService
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any) => {
          this.municipio = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarProvincia() {
    const options = {};
    this.provinciaService
      .listarTodos(options)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any) => {
          this.provincia = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  public handlerProvincias($event: any) {
    if (!$event) return;

    const opcoes = {
      provincia_id: $event,
    };

    this.municipioService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.municipio = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  public editar(data: any): void {
    this.delituoso = data;
  }
  public setAr(data: DelituosoSet): void {
    this.isOffVisible = data;
    this.delituoso = data;
  }
  public setId(data: Number): void {
    this.isForID = data;
  }

  /**
   * Método para abrir o visualizador de fotos de um delituoso específico
   * @param photoUrl URL da foto a ser visualizada
   * @param photoId ID da foto para referência
   */
  openPhotoViewer(photoUrl: string, photoId: number) {
    this.selectedPhotoUrl = photoUrl;
    this.selectedPhotoId = photoId;
    this.isPhotoViewerOpen = true;
  }

  public estados = [
    {
      cor: '#ffcc00',
      texto: 'Suspeito',
    },
    {
      cor: '#FF6C3FFFFF',
      texto: 'Delituoso',
    },
    {
      cor: '#cc0000',
      texto: 'Criminoso',
    },
  ];

  get user_id() {
    return this.authService?.user?.id?.toString().toLowerCase();
  }

  // Função para buscar os delituosos
  buscarDelituoso() {
    const options = {
      ...this.filtro,
      user_id: this.authService?.user?.id?.toString().toLowerCase(), // Adiciona o user_id do usuário logado
    };

    this.isLoading = true;
    this.dinfopDelitousoService
      .listarTodos(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.delituosos = response.data; // Ajuste conforme a estrutura da resposta
          // Exibe as fotos de todos os delituosos automaticamente

          this.delituosos.forEach((delituoso: any) => {
            this.visualizarDelituoso(delituoso);
          });

          this.cdRef.detectChanges();

          this.totalBase = response.total
            ? response.page === 1
              ? 1
              : (response.page - 1) * response.perPage + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response);
        },
      });
  }

  // Atualiza o filtro de status e chama a função de busca
  onStatusChange(status: string): void {
    this.filtro.status = status; // Atualiza o filtro com o novo status selecionado
    this.buscarDelituoso(); // Recarregar os dados com o novo filtro
  }

  onIdadeChange(idade: number) {
    this.filtro.idade = idade; // Atualizar filtro de idade
    this.buscarDelituoso();
  }
  /**
   * Função para visualizar as fotos de todos os delituosos automaticamente ao carregar a página.
   * Exibe as imagens de acordo com o delituoso e as URLs de imagens cadastradas.
   */
  visualizarDelituoso(delituoso: any): void {
    // Verifique se o objeto e as imagens existem
    if (!delituoso || !delituoso.fotografias) {
      return;
    }

    // Exibe a foto frontal, se existir
    if (delituoso.fotografias.image_frontal) {
      this.ficheiroService
        .getFileUsingUrl(delituoso.fotografias.image_frontal)
        .pipe(finalize(() => {}))
        .subscribe((file: any) => {
          delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn('Imagem frontal não disponível');
    }

    // Exibe a foto lateral direita, se existir
    if (delituoso.fotografias.image_lateral_direita) {
      this.ficheiroService
        .getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
        .pipe(finalize(() => {}))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralDireita =
            this.ficheiroService.createImageBlob(file);
        });
    }

    // Exibe a foto lateral esquerda, se existir
    if (delituoso.fotografias.image_lateral_esquerda) {
      this.ficheiroService
        .getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
        .pipe(finalize(() => {}))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralEsquerda =
            this.ficheiroService.createImageBlob(file);
        });
    }
  }

  // Função para calcular a idade baseado na data de nascimento
  calculateAge(birthDate: string | number | Date): void {
    if (birthDate) {
      let birth: Date;

      // Verificar se birthDate é uma string no formato dd/MM/yyyy
      if (typeof birthDate === 'string' && birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/').map(Number); // Divide e converte os valores em números
        birth = new Date(year, month - 1, day); // Cria a data no formato aceito pelo JavaScript
      } else {
        // Caso seja um formato ISO ou Date, apenas converte diretamente
        birth = new Date(birthDate);
      }

      if (isNaN(birth.getTime())) {
        this.idade = null;
        return;
      }

      // Calcular a idade
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDifference = today.getMonth() - birth.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      this.idade = age;
    } else {
      this.idade = null;
    }
  }

  // Função para atualizar o filtro de pesquisa e buscar delituosos
  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    // Atualiza o filtro conforme a chave fornecida
    if (key === 'page') {
      this.filtro.page = $e; // Atualiza a página
    } else if (key === 'perPage') {
      this.filtro.perPage = $e.target.value; // Atualiza o número de itens por página
    } else if (key === 'search') {
      this.filtro.search = $e; // Atualiza o termo de busca
    } else if (key === 'genero') {
      this.filtro.genero = $e; // Atualiza o filtro de gênero
    } else if (key === 'idade') {
      this.filtro.idade = $e; // Atualiza o filtro de gênero
    } else if (key === 'sicgo_nacionalidade_id') {
      this.filtro.sicgo_nacionalidade_id = $e; // Atualiza o filtro de nacionalidade
    } else if (key === 'sicgo_estadocivil_id') {
      this.filtro.sicgo_estadocivil_id = $e; // Atualiza o filtro de estado civil
    } else if (key === 'sicgo_provincia_id') {
      this.filtro.sicgo_provincia_id = $e; // Atualiza o filtro de província
    } else if (key === 'sicgo_municipio_id') {
      this.filtro.sicgo_municipio_id = $e; // Atualiza o filtro de município
    } else if (key === 'sicgo_naturalidade_id') {
      this.filtro.sicgo_naturalidade_id = $e; // Atualiza o filtro de município
    }

    // Se o filtro for de pesquisa ou se reiniciar for verdadeiro, reseta para a primeira página
    if (reiniciar) {
      this.filtro.page = 1; // Reinicia a página para a primeira
    }

    // Chama a função de busca com os filtros atualizados
    this.buscarDelituoso();
  }

  // Função para recarregar a página e buscar os dados novamente
  recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarDelituoso();
  }

  // Função para alternar o modo de edição de um item
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  // Função para limpar todas as variáveis de seleção
  limparVariaveis(): void {
    this.selectedIds = [];
  }


  // Função para alternar a visibilidade de um item específico no sidebar
  public toggle(id: any): void {
    this.isOffcanvasVisible === id
      ? this.closeSidebar()
      : this.openSidebar(id);
  }
    

  private openSidebar(id: number): void {
    this.isOffcanvasVisible = id;
  }

  private closeSidebar(): void {
    this.isOffcanvasVisible = 0;
  }


  // Função para selecionar os itens em massa
  onSelectItem(item: any): void {
    const conjuntoUnico = new Set(this.selectedIds);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.selectedIds = Array.from(conjuntoUnico);
  }

  // Função para validar se um item foi selecionado
  validarSelecionado(id: number | undefined): boolean {
    const numeroUmExiste = this.selectedIds.find((o: any) => o.id === id);
    return !!numeroUmExiste;
  }

  // Função para alternar a expansão do sidebar
  toggleExpand(): void {
    const main = document.querySelector<HTMLElement>('#main_');
    const asidebar = document.querySelector<HTMLElement>('#asidebar');
    if (main && asidebar) {
      if (this.isExpanded) {
        asidebar.style.right = '-500px';
        main.style.marginRight = '0px';
      } else {
        asidebar.style.right = '600px';
        main.style.marginRight = '400px';
      }
      this.isExpanded = !this.isExpanded;
    }
  }

  // Função para excluir múltiplos registros selecionados
  eliminarSelecionados(): void {
    if (this.selectedIds.length > 0) {
      const idsParaEliminar = this.selectedIds.map((item: any) => item.id);
      this.isLoading = true;
      const request =
        this.dinfopDelitousoService.eliminarMultiplo(idsParaEliminar);

      request.pipe(finalize(() => (this.isLoading = false))).subscribe(
        (response: any) => {
          alert(response.message);
          this.buscarDelituoso();
          this.cdRef.detectChanges();
        },
        (error: any) => {
          console.error('Erro ao eliminar:', error);
        }
      );
    } else {
      alert('Nenhum item selecionado!');
    }
  }

  // Função para controlar o status dos delituosos
  Status(items: any, id: Number): void {
    if (!items || !id) {
      console.error('Item inválido ou ID não encontrado.');
      return;
    }

    // Verifique o estado atual e determine o novo estado
    const estadoAtual = items.status;
    const novoEstado = estadoAtual === 'Ativo' ? 'Passivo' : 'Ativo';

    // Atualize localmente para feedback imediato
    const estadoAnterior = items.status; // Salva o estado anterior
    items.status = novoEstado;

    // Inicia o processo de atualização no backend
    this.isLoading = true;

    this.delituosoTratamentoService
      .status(id, novoEstado) // Envia o estado correto para o backend
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          console.log(
            `Status do ID ${items.id} alterado de '${estadoAtual}' para '${novoEstado}' com sucesso.`
          );
          this.buscarDelituoso(); // Atualiza a lista após sucesso
        },
        error: (error: any) => {
          console.error('Erro ao alterar status:', error);
          alert('Não foi possível alterar o status. Tente novamente.');
          items.status = estadoAnterior; // Reverte o estado local em caso de erro
        },
      });
  }

  // Função para controlar o status dos delituosos
  atividade(id: any, event: Event): void {
    const item = this.selectedIds.find((i: any) => i.id === id);
    if (!item) {
      console.error(`Item com ID ${id} não encontrado.`);
      return;
    }

    const isChecked = (event.target as HTMLInputElement).checked;
    const estados = ['S', 'D', 'P'];
    const currentIndex = estados.indexOf(item.estado);
    const nextIndex = (currentIndex + 1) % estados.length;
    const kvState = estados[nextIndex];

    const originalState = item.estado;
    item.estado = kvState;

    this.isLoading = true;

    this.delituosoTratamentoService
      .stados(id, kvState)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        async (response: any) => {
          this.buscarDelituoso();
          this.cdRef.detectChanges();
        },
        (error: any) => {
          console.error('Erro ao alterar status:', error);
          alert('Não foi possível alterar o status. Tente novamente.');
          item.estado = originalState;
        }
      );
  }
  // Função para procurado delituosos
  procurado(): void {
    const idsParaEliminar = this.selectedIds.map((item: any) => item.id);

    if (!idsParaEliminar) {
      console.error(`Item com ID ${idsParaEliminar} não encontrado.`);
      return;
    }
    const kvState = 'Procurado';

    this.isLoading = true;

    this.procuradosService
      .addProcurados(kvState, idsParaEliminar)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        async (response: any) => {
          this.buscarDelituoso();
          this.cdRef.detectChanges();
        },
        (error: any) => {
          console.error('Erro ao alterar para procurado:', error);
          alert('Não foi possível alterar o procurado. Tente novamente.');
        }
      );
  }

  // Função para selecionar um delituoso e abrir detalhes
  selecionarDelituoso() {
    this.isExpanded = true; // Expande automaticamente ao selecionar
  }

  atividadeall(event: Event) {
    if (this.selectedIds.length > 0) {
      // Extrair os IDs em um array simples
      const isChecked = (event.target as HTMLInputElement).checked;

      const idsParaEliminar = this.selectedIds.map((item: any) => item.id);

      this.isLoading = true; // Ativar indicador de carregamento

      const request =
        this.dinfopDelitousoService.eliminarMultiplo(idsParaEliminar);

      request.pipe(finalize(() => (this.isLoading = false))).subscribe(
        (response: any) => {
          alert(response.message);
          this.buscarDelituoso(); // Atualizar a lista de registros
          console.log('IDs eliminados:', idsParaEliminar);
          this.cdRef.detectChanges(); // Atualizar a tabela na interface
        },
        (error: any) => {
          console.error('Erro ao eliminar:', error);
        }
      );
    } else {
      alert('Nenhum item selecionado!');
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  activeTab: boolean = true; // Aba inicial

  // Função para alternar entre as abas
  openTab(tab: boolean): void {
    this.activeTab = tab;
  }
}
