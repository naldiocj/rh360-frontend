import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { PaisService } from '@core/services/Pais.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
import { DelituosoTratamentoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delituoso_tratamento/delituoso_tratamento.service';
import { ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import { ProcuradosService } from '@resources/modules/sicgo/core/service/piquete/dinfop/procurados/procurados.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import tinymce, { Editor } from 'tinymce';



 
 
interface Record {
  id: number;
  name: string;
  createdAt: Date;
  endEditDate: Date;
  activities: { date: Date; description: string }[];
}

@Component({
  selector: 'app-sicgo-dinfop-listar-expedientes',
  templateUrl: './listar-expedientes.component.html',
  styleUrls: ['./listar-expedientes.component.css']
})
export class ListarExpedientesComponent implements OnInit {

  @Output() enviarItem: EventEmitter<any> = new EventEmitter<any>();
  selectedexpediente: any;
  expedientes: any;
  expediente: any[] = [];
  expedientesForaDoPrazo: any[] = [];
  expedientesArquivados: any[] = [];
  a: any[] = [];
  selectedIds: any = [];
  historico: any = [];


  isPhotoViewerOpen = false;
  selectedPhotoUrl = '';
  selectedPhotoId?: number;
 @Input() isDisabled: boolean = false; // Valor padrão inicial é `false`
  isSharingEnabled = false;
 
  isExpanded: boolean = false;
  idade: any;
  isEditMode: boolean = false;

  public pais: Array<Select2OptionData> = [];
  public provincia: Array<Select2OptionData> = [];
  public municipio: Array<Select2OptionData> = [];
 
  public isLoading: boolean = false
  public pagination = new Pagination();
  public isCameraActive: boolean = false
  fotodfault = '../../../../../../../../assets/assets_sicgo/img/logopolice.png';
  totalBase: number = 0
  NovoProcesso: any

  filtro = {
    search: '',
    status: '', 
    page: 1,
    perPage: 10,
    
  }

  public delituoso: any;
  public isOffcanvasVisible: number | any;
  public isForID: number | any;
 

  mostrarTudo: boolean = false; // Controla se o texto completo será mostrado
  limiteTexto: number = 500;    // Limite de caracteres para exibição


  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public isProcesso: string | null = null;
  fileUrl: any;
  selectedExpediente: any;
  showPrintModal: boolean = false;
  

  diasRestantes: number = 0;
  public isOffVisible: string | null = null;

  constructor(
    private provinciaService: ProvinciaService,
    private dinfopDelituosoOrigemService:DinfopDelituosoOrigemService,
    private expedienteService:ExpedienteService,
    private municipioService: MunicipioService,
    public authService: AuthService,
    private procuradosService: ProcuradosService,
    private delituosoTratamentoService: DelituosoTratamentoService, 
    private secureService: SecureService, 
    private renderer: Renderer2, private el: ElementRef, 
    private cdRef: ChangeDetectorRef, 
    private ficheiroService: FicheiroService, 
    private dinfopDelitousoService: DinfopDelitousoService) { }


  ngOnInit() {
    this.buscarExpediente() 
    
  }



  get permissions() {
    return this.authService?.permissions || [];
  }
  
  get role() {
    return this.authService?.role?.name?.toString().toLowerCase();
  }
   

  
  
// Função para calcular os dias úteis restantes até o 'endEditDate' considerando apenas dias úteis
  calculateDaysRemaining(endEditDate: string): number {
  const currentDate = new Date(); // Data atual

  // Garantir que endEditDate seja um Date válido
  const endDate = new Date(endEditDate);

  if (isNaN(endDate.getTime())) {
    throw new Error('Data final inválida.');
  }

  let daysRemaining = 0;
  let tempDate = new Date(currentDate);

  // Calcular o número de dias úteis restantes
  while (tempDate < endDate) {
    tempDate.setDate(tempDate.getDate() + 1);
    
    // Se não for sábado (6) ou domingo (0), conta como dia útil
    if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
      daysRemaining++;
    }
  }

  return daysRemaining;
}



  public estados = [
    {
      cor: '#cc0000',
      texto: 'Indicio ',
    },
    {
      cor: '#F19800FF',
      texto: 'Verificado',
    }, {
      cor: '#1DD700FF',
      texto: 'Aprovado',
    },


  ];

   
  extendDeadline(post: any): void {
    if (post.additionalDays > 0) {
      const newEndDate = this.expedienteService.addBusinessDays(
        post.endEditDate,
        post.additionalDays
      );
      post.endEditDate = newEndDate;
      console.log('Novo prazo:', post.endEditDate);
    } else {
      console.log('Nenhum dia adicional foi informado.');
    }
  }

  canEdit(post: any): boolean {
    const today = new Date();
    const endEditDate = new Date(post.endEditDate);
    return today <= endEditDate; // Verifica se ainda está dentro do prazo
  }
  editPost(post: any): boolean {
    const today = new Date();
    const endEditDate = new Date(post.endEditDate);
    return today <= endEditDate; // Verifica se ainda está dentro do prazo
  }

  newActivity = { description: '' };

  canAddActivity(record: any): boolean {
    const today = new Date();
    const endEditDate = new Date(record.endEditDate);
    return today <= endEditDate; // Verifica se ainda está dentro do prazo
  }

  addActivity(record: any): void {
    if (!this.newActivity.description.trim()) {
      alert('A descrição da atividade não pode estar vazia!');
      return;
    }

    record.activities.push({
      date: new Date(),
      description: this.newActivity.description,
    });

    this.newActivity.description = ''; // Reseta o campo de atividade
    console.log('Atividade adicionada:', record);
  }
 
  @Output() expedienteSelected = new EventEmitter<any>();
  selectOccurrence(expediente: any): void {
    this.expedienteService.setOccurrence(expediente); // Seleciona a ocorrência
    this.selectedexpediente = expediente;
    this.expedienteSelected.emit(expediente); // Emite a ocorrência selecionada
  }
 

  buscarMunicipio() {
    const options = {};
    this.expedienteService
      .listarTodos({})
      .pipe(finalize(() => { }))
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
      .pipe(finalize(() => { }))
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
    if (!$event) return

    const opcoes = {
      provincia_id: $event
    }

    this.municipioService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.municipio = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })

  }
  
  public editar(data: any): void {
    this.expedientes = data;
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



  printContent(): void {
    const content = this.selectedExpediente?.expedienteP;
  
    if (!content) {
      console.warn('Nenhum conteúdo disponível para impressão.');
      return;
    }
  
    const printWindow = window.open('', '_blank');
  
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(` 
              ${content}
           
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
  
  
  editorConfig = {
    height: 800,
    menubar: false, 
    toolbar: 'print',
    statusbar: false,
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.getBody().setAttribute('contenteditable', 'false'); // 🔹 Remove edição
        editor.shortcuts.remove('newdocument');
         // Bloqueia atalhos indesejados
    editor.on('keydown', (event: any) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
      }
    });
      });
    }
  };
  
  

  toggleTexto(descricao: string) {
    this.mostrarTudo = !this.mostrarTudo;
    this.limiteTexto = this.mostrarTudo ? descricao.length : 100;
  }

  cards = [
    { title: 'Card 1', description: 'Descrição do Card 1', image: 'https://via.placeholder.com/150' },
    { title: 'Card 2', description: 'Descrição do Card 2', image: 'https://via.placeholder.com/150' },
    { title: 'Card 3', description: 'Descrição do Card 3', image: 'https://via.placeholder.com/150' },
    { title: 'Card 4', description: 'Descrição do Card 4', image: 'https://via.placeholder.com/150' },
    { title: 'Card 5', description: 'Descrição do Card 5', image: 'https://via.placeholder.com/150' }
  ];

  currentIndex = 0; // Índice do card visível

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    }
  }


  selectedExpedientes: any | null = null;

  selectExpediente(expediente: any) {
    this.selectedExpedientes = expediente;
  }

  
  // Função para buscar os delituosos
  buscarExpediente() {
    const options = { ...this.filtro };
    this.isLoading = true;
    this.expedienteService.listarTodos(options).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.expediente = response; // Ajuste conforme a estrutura da resposta
       
        this.cdRef.detectChanges();


        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      },
    });
  }

  // Atualiza o filtro de status e chama a função de busca
  onStatusChange(status: string): void {
    this.filtro.status = status; // Atualiza o filtro com o novo status selecionado
    this.buscarExpediente(); // Recarregar os dados com o novo filtro
  }
  
// No componente TS
ordenarPorData() {
  this.expediente.sort((a, b) => 
    new Date(a.endEditDate).getTime() - new Date(b.endEditDate).getTime()
  );
}
  
  /**
   * Função para visualizar as fotos de todos os delituosos automaticamente ao carregar a página.
   * Exibe as imagens de acordo com o delituoso e as URLs de imagens cadastradas.
   */
  visualizarDelituoso(delituoso: any): void {
    // Verifique se o objeto e as imagens existem
    if (!delituoso || !delituoso.fotografias) {
      console.error('Delituoso ou fotografias são null ou undefined');
      return;
    }

    // Exibe a foto frontal, se existir
    if (delituoso.fotografias.image_frontal) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_frontal)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
        });
    } else {
      console.warn('Imagem frontal não disponível');
    }

    // Exibe a foto lateral direita, se existir
    if (delituoso.fotografias.image_lateral_direita) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
        });
    }

    // Exibe a foto lateral esquerda, se existir
    if (delituoso.fotografias.image_lateral_esquerda) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
        .pipe(finalize(() => { }))
        .subscribe((file: any) => {
          delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
        });
    }
  }

 

  // Função para atualizar o filtro de pesquisa e buscar delituosos
  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    // Atualiza o filtro conforme a chave fornecida
    if (key === 'page') {
      this.filtro.page = $e;  // Atualiza a página
    } else if (key === 'perPage') {
      this.filtro.perPage = $e.target.value;  // Atualiza o número de itens por página
    } else if (key === 'search') {
      this.filtro.search = $e;  // Atualiza o termo de busca
    } 
    // Se o filtro for de pesquisa ou se reiniciar for verdadeiro, reseta para a primeira página
    if (reiniciar) {
      this.filtro.page = 1;  // Reinicia a página para a primeira
    }



    // Chama a função de busca com os filtros atualizados
    this.buscarExpediente();
  }


  // Função para recarregar a página e buscar os dados novamente
  recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 6;
    this.filtro.search = '';
    this.buscarExpediente();
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
  toggle(id: any): void {
    const main: HTMLElement | any = document.querySelector('#m_');
    const asidebar: HTMLElement | any = document.querySelector('#aside');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.marginTop;
      let asideRight: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;

      if (this.isOffcanvasVisible === id.id) {
        this.isOffcanvasVisible = null;
        this.isOffcanvasVisible === id;
        if (asideRight === '' || asideRight === '0px') {
          asideRight = '-400px';
          mainLeft = '0px';
          asideLeft = '30px';
        }
      } else if (this.isOffcanvasVisible !== id) {
        this.isOffcanvasVisible = id;
        asideRight = '0px';
        mainLeft = '530px';
      }

      asidebar.style.right = asideRight;
      main.style.marginRight = mainLeft;
    }
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


  formatExpedienteContent(content: string): string {
    return content.replace(/<img /g, '<img style="max-width: 100px; height: auto; display: block; margin: 10px auto;" ');
  }
  
  printExpediente(item: any): void {
    this.selectedExpediente = item; // Armazena os dados do expediente selecionado
    this.showPrintModal = true; // Exibe o modal de impressão
  }
   


  // Função para excluir múltiplos registros selecionados
  eliminarSelecionados(): void {
    if (this.selectedIds.length > 0) {
      const idsParaEliminar = this.selectedIds.map((item: any) => item.id);
      this.isLoading = true;
      const request = this.dinfopDelitousoService.eliminarMultiplo(idsParaEliminar);

      request.pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response: any) => {
            alert(response.message);
            this.buscarExpediente();
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
          console.log(`Status do ID ${items.id} alterado de '${estadoAtual}' para '${novoEstado}' com sucesso.`);
          this.buscarExpediente(); // Atualiza a lista após sucesso
        },
        error: (error: any) => {
          console.error('Erro ao alterar status:', error);
          alert('Não foi possível alterar o status. Tente novamente.');
          items.status = estadoAnterior; // Reverte o estado local em caso de erro
        },
      });
  }



  calcularDiasRestantes(endEditDate: string): number {
    const currentDate = new Date();
    const endDate = new Date(endEditDate);
    
    if (isNaN(endDate.getTime())) return 0;

    let days = 0;
    const tempDate = new Date(currentDate);

    while (tempDate < endDate) {
      tempDate.setDate(tempDate.getDate() + 1);
      if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) days++;
    }

    return days;
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

    this.delituosoTratamentoService.stados(id, kvState)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        async (response: any) => {
          this.buscarExpediente();
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
    const kvState = "Procurado"

    this.isLoading = true;

    this.procuradosService.addProcurados(kvState, idsParaEliminar)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        async (response: any) => {
          this.buscarExpediente();
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

      const request = this.dinfopDelitousoService.eliminarMultiplo(idsParaEliminar);

      request.pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response: any) => {
            alert(response.message);
            this.buscarExpediente(); // Atualizar a lista de registros
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



  private isLocked = false;
  ngAfterViewInit(): void {
    const inputs = this.el.nativeElement.querySelectorAll('#radiento input');
    inputs.forEach((input: HTMLInputElement) => {
      this.renderer.listen(input, 'click', (event: Event) => {
        window.performance && performance.mark('click');
        this.syncCheckedStateToAttribute(inputs, event.target as HTMLInputElement);
      });
    });

    const observer = new MutationObserver(async (mutations) => {
      if (this.isLocked) return;
      const checkedMutations = mutations.filter(m => m.type == 'attributes' && m.attributeName == 'checked');
      if (checkedMutations.length != 2) return;
      
      window.performance && performance.mark('mutation-process');
      this.isLocked = true;
      
      const [mutation1, mutation2] = checkedMutations;
      const checked1 = (mutation1.target as HTMLInputElement).checked;
      const checked2 = (mutation2.target as HTMLInputElement).checked;
      
      (mutation1.target as HTMLInputElement).checked = !checked1;
      (mutation2.target as HTMLInputElement).checked = !checked2;
      
      window.performance && performance.mark('vt-start');
      const t = (document as any).startViewTransition(() => {
        (mutation1.target as HTMLInputElement).checked = checked1;
        (mutation2.target as HTMLInputElement).checked = checked2;
      });
      
      await t.ready;
      window.performance && performance.mark('vt-ready');
      this.isLocked = false;
    });
    
    observer.observe(this.el.nativeElement.querySelector('#radiento'), {
      subtree: true,
      attributes: true,
    });
  }

  private syncCheckedStateToAttribute(candidates: NodeListOf<HTMLInputElement>, target: HTMLInputElement): void {
    if (target.hasAttribute('checked')) return;
    const prevTarget = Array.from(candidates).find(candidate => candidate.hasAttribute('checked'));
    if (prevTarget) {
      prevTarget.removeAttribute('checked');
    }
    target.setAttribute('checked', '');
  }


  public KV(id: any): void { 
  this.isOffVisible = id;
  }








  menuOptions = [
    { 
      label: 'Editar', 
      action: (item: any) => this.editar(item), 
      modal: '#modalRegistarOuEditarExpediente',
      icon: 'fas fa-edit', 
      roles: ['admin'], // Somente Admin pode ver
    },
    { 
      label: 'Prorrogar a Data', 
      action: (item: any) => this.editar(item), 
      modal: '#expedienteExpandModal',
      icon: 'bi bi-calendar-plus', 
      roles: ['admin'], 
      //permissions: ['expediente-update'], // Admin e Operador com essa permissão podem ver
    },
    { 
      label: 'Visualizar / Imprimir', 
      action: (item: any) => this.printExpediente(item), 
      modal: '#modalPrintExpediente',
      icon: 'bi bi-eye',
    },
    { label: 'INFORMAÇÃO INICIAL', icon: 'bi bi-person-lock' },
    { label: 'PLANO DE MEDIDAS', icon: 'bi bi-person-lock' },
    { label: 'SEQUÊNCIA INFORMATIVA', icon: 'bi bi-person-lock' },
    { label: 'RESUMO ANALITICO', icon: 'bi bi-person-lock' },
    { label: 'ANEXOS', icon: 'bi bi-paperclip' },
    { 
      label: 'ASSOCIAR SUSPEITOS', 
      action: (item: any) => this.KV(item.id), 
      modal: '#modalRegistarOuEditarAssociar',
      icon: 'bi bi-person-plus-fill',
    },
    {
      label: 'PDF',
      action: (item: any) => this.printExpedientePDF(item),
      icon: 'bi bi-file-pdf'
    },
    {
      label: 'Eliminar',
      action: (item: any) => {
        console.log('Item recebido para exclusão:', item); // Log para depuração
        this.eliminarExpediente(item.id);
      },
      icon: 'bi bi-trash' // Ícone mais adequado para exclusão
    }
    
  ];

 

  eliminarExpediente(item: number): void {
    if (!item || !item) {
      console.error('Erro: Item inválido para exclusão:', item);
      return;
    }
  
    console.log('Tentando excluir ID:', item, 'Tipo:', typeof item);
  
    this.expedienteService.eliminar(Number(item))
      .subscribe({
        next: (eliminado) => {
          console.log('Expediente eliminado com sucesso:', eliminado);
        },
        error: (error) => console.error('Erro ao eliminar:', error)
      });
  }
  
  
  
  printExpedientePDF(item: any): void {
    this.expedienteService.generatePDF(item)
      .subscribe({
        next: (pdf) => {
          const blob = new Blob([pdf], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error: (error) => console.error('Erro ao gerar PDF:', error)
      });
  }
  
  get filteredMenuOptions() {
    return this.menuOptions.filter(option => {
      if (option.roles && !option.roles.includes(this.role)) {
        return false;
      }
      // if (option.permissions && !this.hasPermission('expediente-update')) {
      //   return false;
      // }
      return true;
    });
  }
  
  hasPermission(permission: string): boolean {
    return this.authService?.permissions?.includes(permission) || false;
  }
  
}
