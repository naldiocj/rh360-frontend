import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiResponse, ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import { SecureService } from '@core/authentication/secure.service';

declare var bootstrap: any; // Para manipulação do modal Bootstrap

interface FormField {
  name: string;
  type: string;
  label: string;
  validators: any[];
}
// Defina as chaves válidas para EXPEDIENTE_FIELDS
type ExpedienteType =
  | 'Expediente de Processo de Pesquisa Operativa'
  | 'Expediente de Processo Acompanhamento Operativo'
  | 'Expediente de Grupo de Marginais Passivos'
  | 'Expediente de Grupo de Marginais Activos'
  | 'Expediente de Trabalho do Agente Secreto'
  | 'Expediente Pessoal do Agente Secreto'
  | 'Expediente de Trabalho da Pessoa de Confiança'
  | 'Expediente Pessoal da Pessoa de Confiança';





@Component({
  selector: 'app-sicgo-registar-ou-editar-expediente',
  templateUrl: './registar-ou-editar-expediente.component.html',
  styleUrls: ['./registar-ou-editar-expediente.component.css']
})
export class RegistarOuEditarExpedienteComponent implements OnInit {
  @Input() expediente: any = null; // Recebe os dados do backend para edição
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();
  response?: ApiResponse;
  selectedAgentIds: any;
  selectedOfficialOp: any;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  removedTagIndex: number | null = null;
  searchTag: string | null = null;
  // Objeto que armazena um FormGroup para cada tag
  forms: { [key: string]: FormGroup } = {};

  editorConfig: any;
  editorInstance: any;
  public submitted: boolean = false;
  public isLoading: boolean = false;
  public formErrors: any;
  params: any;
  fotodfault = './assets/img/insignia.png';
  fotodfaultdINFP = './assets/assets_sicgo/img/dinfop.png';

  selectedOffioperativo: any;

  @Input() orgaoIdDoUsuarioLogado: any = 0;

  public tipoOcorrencias: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
  currentStep: number = 0; // Etapa atual
  totalSteps: number = 2; // Total de etapas
 


  constructor(
    private expedienteService: ExpedienteService,
    private secureService: SecureService,
    private fb: FormBuilder
  ) {
    this.initializeForms();


  }


  // Avança para a próxima etapa
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  // Volta para a etapa anterior
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  get orgao() {
    return this.secureService.getTokenValueDecode().orgao.sigla
  }

  ngOnInit(): void {
    this.initializeEditorConfig();
    // Observa mudanças no ID
    this.initializeForms();
    if (this.expediente) {
      this.loadExpedienteData(); // Carregar dados do expediente para edição
    }


    this.expedienteService.selectedAgents$.subscribe((res: any) => { 
      this.response = res;
      this.selectedAgentIds = res?.object?.map((agent: any) => agent.id) || [];
    });
    
    
    
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expediente'] && this.expediente) {
      this.loadExpedienteData();
    }
    if (changes['searchTag'] && this.editorInstance) {
      // Atualizar conteúdo se a `searchTag` mudar após a inicialização do editor
      this.editorInstance.setContent(this.getEditorInitialContent());
    }
  }

  ngOnDestroy(): void { }


  initializeEditorConfig(): void {
    // Garantir que searchTag tem um valor válido
    if (this.searchTag === null) {
      this.searchTag = ''; // Valor padrão se searchTag for null
    }

    this.editorConfig = {
      height: 500,
      suffix: '.min',
      menubar: true,
      plugins: ['link', 'image charmap print preview anchor', 'advlist autolink lists', 'table', 'template',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'],
      toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist bullist outdent indent | removeformat | link image template',
      // Configurações para arrastar e soltar imagens
      automatic_uploads: true,
      file_picker_types: 'image',

      // Adiciona suporte para colar imagens diretamente no editor
      paste_data_images: true,
      // Adicionando fontes personalizadas
      font_formats:
        'Arial=arial,helvetica,sans-serif; ' +
        'Comic Sans MS=comic sans ms,sans-serif; ' +
        'Courier New=courier new,courier,monospace; ' +
        'Georgia=georgia,palatino,serif; ' +
        'Script MT Bold="Script MT Bold",cursive; ' +
        'Times New Roman=times new roman,times,serif; ' +
        'Verdana=verdana,geneva,sans-serif; ',

      content_style: `
       body { font-family: Arial, sans-serif; font-size: 14px; }
      .mce-content-body { font-family: 'Script MT Bold', cursive; }
    `,

      templates: [
        {
          title: 'Modelo Capa',
          description: 'Modelo com texto centralizado e logotipo',
          content: this.getTemplateContent('Modelo Capa')
        },
        {
          title: 'Índice de Documento',
          description: 'Modelo de índice de documentos',
          content: `
            <h2 style="text-align: center;">ÍNDICE DE DOCUMENTO</h2>
            <p><strong>Nº DE ORDEM:</strong> ____________</p>
            <p><strong>DATA DE DOCUMENTO:</strong> ____________</p>
            <p><strong>DENOMINAÇÃO DO DOCUMENTO:</strong> ____________</p>
            <p><strong>SERVIÇO DE SECTOR:</strong> ____________</p>
            <p><strong>Nº DE FOLHAS:</strong> ____________</p>
          `
        },
        {
          title: 'Modelo Padrão',
          description: 'Modelo com texto centralizado e logotipo',
          content: this.getTemplateContentP('Modelo Padrão')
        },
        {
          title: 'Modelo Segundario',
          description: 'Modelo com texto centralizado e logotipo',
          content: this.getEditorModelo1('PEDIDO DE ABERTURA DE PPO')
        },
        {
          title: 'EXPEDIENTE DE PROCESSO DE PESQUISA OPERATIVA',
          description: 'Modelo com texto centralizado e logotipo',
          content: this.getEditorModelo2('PEDIDO DE ABERTURA DE PPO')
        },

        {
          title: 'PLANO DE MEDIDA OPERATIVA',
          description: 'Modelo com texto centralizado e logotipo',
          content: this.getEditorModeloPlanoDeMedidaOp('PLANO DE MEDIDA OPERATIVA')
        }
      ],


      setup: (editor: { on: (arg0: string, arg1: () => void) => void; setContent: (arg0: string) => void; }) => {
        editor.on('init', () => {
          // Defina o conteúdo do editor após a inicialização
          editor.setContent('');
        });
      }
    };
  }


  // Função para gerar conteúdo para os modelos
  getTemplateContent(modelName: string): string {
    return `
    <div style="text-align: center; font-family: Times New Roman; margin: 0; padding: 0;">
      <img src="${this.fotodfault}" alt="Logotipo" style="margin-bottom: 5px; width:50px; display: inline-block;">
      <p style="margin-top: -3px; padding: 0; font-size: 12px;">REPÚBLICA DE ANGOLA</p>
      <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">MINISTÉRIO DO INTERIOR</p>
      <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL</p>
      <h2 style="margin-top: -1.5%; padding: 0; font-size: 16px;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
      <h2 style="margin-top: -1%; padding: 0; font-size: 16px;">______________________________________</h2>
      <h2 style="margin-top: 0%; padding: 0; font-size: 16px;">${this.searchTag || ''}</h2>
    </div>`;
  }

  getTemplateContentP(modelName: string): string {
    return `
   <div style="text-align: center; font-family: Times New Roman; margin: 0; padding: 0;">
              <img src="${this.fotodfault}" alt="Logotipo" style="margin-bottom: 5px; width:50px; display: inline-block;">
              <p style="margin-top: -3px; padding: 0; font-size: 12px;">REPÚBLICA DE ANGOLA</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">MINISTÉRIO DO INTERIOR</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL</p>
              <h2 style="margin-top: -1.5%; padding: 0; font-size: 16px;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
              
              <h2 style="margin-top: 2%; padding: 0; font-size: 16px; font-weight: bold;">_______________________________</h2>
              </div>

              
              `;
  }
  // Função para gerar conteúdo para os modelos fim

  // Função para conteúdo inicial do editor
  getEditorInitialContent(): string {
    return `
    <div style="text-align: center; font-family: Times New Roman; margin: 0; padding: 0;">
              <img src="${this.fotodfaultdINFP}" alt="Logotipo" style="margin-bottom: 5px; width:50px; display: inline-block;">
              <p style="margin-top: -3px; padding: 0; font-size: 12px;">REPÚBLICA DE ANGOLA</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">MINISTÉRIO DO INTERIOR</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL</p>
              <h2 style="margin-top: -1%; padding: 0; font-size: 16px;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
              <h2 style="margin-top: -1%; padding: 0; font-size: 16px;">DEPARTAMENTO DE PESQUISA</h2>
              </div>
            
              
  
  
          
  `;
  }

  getEditorModelo2(modelName: string): string {
    return `
    <div style="text-align: center; font-family: Times New Roman; margin: 0; padding: 0;">
              <img src="${this.fotodfault}" alt="Logotipo" style="margin-bottom: 5px; width:50px; display: inline-block;">
              <p style="margin-top: -3px; padding: 0; font-size: 12px;">REPÚBLICA DE ANGOLA</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">MINISTÉRIO DO INTERIOR</p>
              <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL</p>
              <h2 style="margin-top: -1%; padding: 0; font-size: 16px;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
              <h2 style="margin-top: -1%; padding: 0; font-size: 16px;">DEPARTAMENTO DE PESQUISA</h2>
              </div>
            
              <div style="text-align: left; font-family: Times New Roman; margin:6% 0; padding: 0;">
              <p>
  
              DE: _____________________________________________________________________________________
              PARA:___________________________________________________________________________________
              ASSUNTO:_______________________________________________________________________________
              REFERENCIAª: ____________________________________________________________________________________
              DATA: ___________________________________________________________________________________
  
              </p>
             <p>
              CONTEÚDO:
              ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
  
              </p>
             <p>
             CONSIDERAÇÕES GERAIS: 
              ___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
              </p>
  
               <p>
              PROPOSTA DE MEDIDAS: 
              ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
              </p>
  
              <p>
              MEDIDAS TOMADAS: 
              ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
              </p>
            </div>
  
  
          <div style="width:250px; float:right; text-align: center; font-family: Times New Roman; margin-top:9%; padding: 0;">
              <p>
              O ESPECIALISTA
              __________________________________
              __________________________
              </p>
           </div>
  `;
  }

  getEditorModeloPlanoDeMedidaOp(modelName: string): string {
    return `
     <div style="text-align: center; font-family: Arial; margin: 0; padding: 0;">
            <img src="${this.fotodfaultdINFP}" alt="Logotipo" style="margin-bottom: 5px; width:70px; display: inline-block;">
            <p style="margin-top: -1%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL DE ANGOLA</p>
            <h2 style="margin-top: -1%; padding: 0; font-size: 16px; font-weight: bold;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
            <h2 style="margin-top: -1.5%; padding: 0; font-size: 14px; font-weight: bold;">DEPARTAMENTO DE PESQUISA</h2>
            </div>
            
            <div style="width:250px; float:right; text-align: center; font-family: Times New Roman; margin-top:%; padding: 0;">
              <p>
               VISTO E APROVADO___/___/___05
              </p>
              <p style="margin-top: -1.5%; font-size: 12px; ">
               O CHEFE DE DEPARTAMENTO
              </p>
              <p style="font-family: Script MT Bold">
              Antonio M.M. da Silva
              </p>
              <p>
              /*/<STRONG>INTENDENTE</STRONG>/*/
              </p>
           </div>

              <div style="text-align: left; font-family: Arial; margin:25% 0; padding: 0; width:100%">
              <p> 
              ASSUNTO: <strong>${modelName}</strong>
               </p>
              <p> 
               REFERENTE: ____________________________________________________________________________________
              </p>
             <p>
              CONTEÚDO:
              ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
  
              </p>
              
  
              <p>
              <strong>FORÇAS E MEIOS</strong>
              ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
              
              </p>
 
            </div>
  
  
           


            <div style="text-align: center; font-family: Arial; margin:7% 0; padding: 0; width:100%">
              <p> 
               <strong>"INTELIGENCIA, PREVENÇÃO E FIRMEZA"</strong>
               </p>
               <p> 
               Luanda,___ de_______ de 2025
               </p>

               <p> 
               O ESPECIALISTA 
               </p>
               <p> 
               __________________________
               </p>
               <p> 
              ...
               </p>
            </div>
  `;
  }

  // Função para conteúdo inicial do editor
  getEditorModelo1(modelName: string): string {
    return `
  <div style="text-align: center; font-family: Arial; margin: 0; padding: 0;">
            <img src="${this.fotodfaultdINFP}" alt="Logotipo" style="margin-bottom: 5px; width:70px; display: inline-block;">
            <p style="margin-top: -1%; padding: 0; font-size: 12px;">POLÍCIA NACIONAL DE ANGOLA</p>
            <h2 style="margin-top: -1%; padding: 0; font-size: 16px; font-weight: bold;">DIRECÇÃO DE INFORMAÇÕES POLICIAIS</h2>
            <h2 style="margin-top: -1.5%; padding: 0; font-size: 14px; font-weight: bold;">DEPARTAMENTO DE PESQUISA</h2>
            </div>
          
            <div style="text-align: left; font-family: Arial; margin:6% 0; padding: 0;">
            <p style="margin-top: -2%; padding: 0; font-size: 12px; font-weight: bold;">

            EXCELENCIA 
            </p>
             <p style="margin-top: -2%; padding: 0; font-size: 12px; font-weight: bold;"> 
            DIRECTOR DA DINFOP/PNA            
            </p>
            <p style="margin-top: -2%; padding: 0; font-size: 12px; "> 
            COMISSÁRIO ANTÓNIO JOSE BERNARDO            
            </p>
             <p style="font-weight: bold;">

            _________/DINFOP/PNA/2025 
            </p>
             <p style="margin-top: -1.5%; padding: 0; font-size: 12px;">
            ASSUNTO:
            </p>
             <p style="margin-top: -1.3%; padding: 0; font-size: 12px;">
            REFERENCIA: ${modelName}
             </p>
           <p>

            CONTEÚDO:
            ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

            </p>
           
          </div>

          <div style="width:350px; font-family: Arial;  text-align: center;  margin:9% auto; padding: 0;">
             <p style="font-size: 12px; font-weight: bold;"> 
            "<STRONG>INTELIGENCIA, PREVENÇÃO E FIRMEZA</STRONG>"           
            </p>
             
             <p>
            "<STRONG>PELA ORDEM E PELA PAZ, AO SERVIÇO DA NAÇÃO</STRONG>"
            </p>

            <p>
             Luanda,____de_______de 2025
            </p>
            </div>

        <div style="width:250px; font-family: Arial;  text-align: center;   margin:9% auto; padding: 0;">
            <p>
            O CHEFE DE DEPARTAMENTO
            __________________________________
            __________________________
            </p>
             <p style="font-family: Script MT Bold">
             Antonio M.M. da Silva
            </p>
             <p>
            /*/<STRONG>INTENDENTE</STRONG>/*/
            </p>
         </div>
`;
  }



  @ViewChild('tagsContainer', { static: true }) tagsContainer!: ElementRef;
  @ViewChild('searchContainer', { static: true }) searchContainer!: ElementRef;

  tags = [
    'Expediente de Processo de Pesquisa Operativa',
    'Expediente de Processo de Acompanhamento Operativo',
    'Expediente de Grupo de Marginais Passivos',
    'Expediente de Grupo de Marginais Activos',
    'Expediente de Trabalho do Agente Secreto',
    'Expediente Pessoal do Agente Secreto',
    'Expediente de Trabalho da Pessoa de Confiança',
    'Expediente Pessoal da Pessoa de Confiança'
  ];

  ngAfterViewInit() {
    const buttons = this.tagsContainer.nativeElement.querySelectorAll('button');
    buttons.forEach((btn: HTMLElement, index: number) => {
      btn.style.setProperty('--view-transition-name', `tag-${index}`);
      btn.style.order = index.toString();
    });
  }


  EXPEDIENTE_FIELDS: Record<string, FormField[]> = {
    'Expediente de Processo de Pesquisa Operativa': [
      { name: 'numeroExpediente', type: 'text', label: 'Número do Expediente', validators: [Validators.required] },
      { name: 'assunto', type: 'text', label: 'Nome do Caso', validators: [Validators.required] },
      { name: 'referencia', type: 'text', label: 'Referencia', validators: [Validators.required] },
      { name: 'expedienteP', type: 'editor', label: 'Pedido', validators: [] },

    ],
    'Expediente de Processo de Acompanhamento Operativo': [
      { name: 'numeroExpediente', type: 'text', label: 'Número do Expediente', validators: [Validators.required] },
      { name: 'nomeCaso', type: 'text', label: 'Nome do Caso', validators: [Validators.required] },
      { name: 'especialista', type: 'text', label: 'Especialista', validators: [Validators.required] },
      { name: 'local', type: 'text', label: 'Local', validators: [] },
      { name: 'ano', type: 'number', label: 'Ano', validators: [] },
      { name: 'observacao', type: 'editor', label: 'Observação', validators: [] },
      { name: 'expedienteP', type: 'editor', label: 'Pedido', validators: [] },

    ],
    'Expediente de Grupo de Marginais Passivos': [
      // Defina os campos para esse tipo de expediente aqui
      { name: 'numeroExpediente', type: 'text', label: 'Número do Expediente', validators: [Validators.required] },
      { name: 'nomeCaso', type: 'text', label: 'Nome do Caso', validators: [Validators.required] },
      { name: 'observacao', type: 'textarea', label: 'Observação', validators: [] }
    ],
    'Expediente de Grupo de Marginais Activos': [
      // Campos específicos para esse expediente
    ],
    'Expediente de Trabalho do Agente Secreto': [
      // Campos para esse expediente
    ],
    'Expediente Pessoal do Agente Secreto': [
      // Campos para esse expediente
    ],
    'Expediente de Trabalho da Pessoa de Confiança': [
      // Campos para esse expediente
    ],
    'Expediente Pessoal da Pessoa de Confiança': [
      { name: 'numeroExpediente', type: 'text', label: 'Número do Expediente', validators: [Validators.required] },
      { name: 'nomeCaso', type: 'text', label: 'Nome do Caso', validators: [Validators.required] },
      { name: 'especialista', type: 'text', label: 'Especialista', validators: [Validators.required] }
    ]
  };
  // Inicializa os formulários com base nos campos definidos para cada expediente
  initializeForms() {
    this.forms = {};
    Object.keys(this.EXPEDIENTE_FIELDS).forEach(tag => {
      const fields = this.EXPEDIENTE_FIELDS[tag];
      const formGroup: { [key: string]: any } = {};
      fields.forEach(field => {
        formGroup[field.name] = ['', field.validators];
      });
      this.forms[tag] = this.fb.group(formGroup);
    });

     
  }


  moveToSearch(tagName: string, index: number) {
    if (this.searchTag) {
      this.removeTag();
    }

    this.searchTag = tagName;
    this.removedTagIndex = index;
    this.tags.splice(index, 1);
  }

  removeTag() {
    if (this.searchTag === null || this.removedTagIndex === null) return;

    this.tags.splice(this.removedTagIndex, 0, this.searchTag);
    this.searchTag = null;
    this.removedTagIndex = null;
  }


  loadExpedienteData(): void {
    if (!this.expediente) return;
    // Garantir que o editor seja inicializado com os dados
    setTimeout(() => {
      this.editorConfig = {
        height: 400,
        menubar: true,
        plugins: ['link', 'image', 'lists', 'table', 'template'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | numlist bullist | link image template',
      };

      // Preenche o formulário com os dados carregados
      this.activeForm?.patchValue(this.expediente);
    }, 300); // Atraso para garantir que os dados sejam carregados antes
    // Definir a tag já selecionada
    this.searchTag = this.expediente.tipoExpediente;

    // Remover a tag da lista para evitar duplicação
    this.tags = this.tags.filter(tag => tag !== this.searchTag);

    // Preencher o formulário com os dados do expediente  if (!this.expediente || !this.searchTag || !this.activeForm) return;

    if (this.activeForm) {
      this.activeForm.patchValue({
        tipoExpediente: this.expediente.tipoExpediente || '',
        numeroExpediente: this.expediente.numeroExpediente || '',
        nomeCaso: this.expediente.nomeCaso || '',
        especialista: this.expediente.especialista || '',
        local: this.expediente.local || '',
        ano: this.expediente.ano || '',
        assunto: this.expediente.assunto || '',
        referencia: this.expediente.referencia || '',
        observacao: this.expediente.observacao || '',
        expedienteP: this.expediente.expedienteP || ''
      });
    }
  }

  // Método para obter o formulário da tag ativa
  get activeForm(): FormGroup | null {
    return this.searchTag ? this.forms[this.searchTag] : null;
  }




  onSubmit(): void {
    if (!this.activeForm) {
      console.error('Erro: activeForm não está definido!');
      return;
    }

    if (this.activeForm.invalid) {
      this.submitted = true;
      console.warn('Formulário inválido:', this.activeForm.errors);
      return;
    }

    this.isLoading = true;
    
    // Formata o objeto de dados para enviar apenas a data de término
    if (this.selectedAgentIds.length === 0) {
      alert('Selecione pelo menos 1 agente!');
      return;
    }

    const formData = {
      ...this.activeForm.value,
      agentesIds: this.selectedAgentIds, // Remove valores vazios/nulos // Campo correto para a API 
      tipoExpediente: this.searchTag,
      orgao: this.orgao,
      };

    const request = this.buscarId()
      ? this.expedienteService.editar(formData, this.buscarId())
      : this.expedienteService.registar(formData);

    request.pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1400);
          this.reiniciarFormulario();
          this.removerModal();
          
          this.eventRegistarOuEditar.emit(true);
        },
        error: (err) => {
          console.error('Erro:', err);
          alert('Erro ao salvar registro. Tente novamente.');
        }
      });
  }





  reiniciarFormulario(): void {
    if (this.activeForm) {
      this.activeForm.reset();
    }
  }


  // Método unificado para obter o ID do modo operante
  buscarId(): number {
    return this.expediente?.id || 0;
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }



  removerModal(): void {
    const modal = document.getElementById('modalRegistarOuEditarExpediente');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  }




  openOccurrenceModal(): void {
    // Habilitar compartilhamento antes de abrir o modal
    this.expedienteService.enableSharing(true);
    this.expedienteService.disableSharing(false);

    // Abrir modal usando Bootstrap
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.classList.add('custom-modal-backdrop'); // Aplica o estilo
    }
    // Escutar o evento de fechamento do modal
    modalElement?.addEventListener('hidden.bs.modal', () => {
      // Desabilitar compartilhamento após o modal ser fechado
      this.expedienteService.enableSharing(false);
      this.expedienteService.disableSharing(true);

    });
  }


  onOccurrenceSelected(offioperativo: any): void {
    this.selectedOffioperativo = offioperativo;

    // Fechar o modal
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}

