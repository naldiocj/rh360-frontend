import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, debounceTime, finalize } from 'rxjs';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { TipoCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Correspondencia.service';
import { TipoNaturezaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Natureza.service';
import { TipoDestinoService } from '@resources/modules/sigdoc/core/service/config/tipo-destino.service';
import { EntradaExpedienteService } from '@resources/modules/sigdoc/core/service/entrada-expediente.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigpq/core/service/config/Procedencia-Correpondencia.service';
import { FuncionarioOrgaoService } from '@core/services/Funcionario-orgao.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TipoProvenienciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Proveniencia.service';
const QRCode = require('qrcode');

@Component({
  selector: 'app-sigdoc-registar-documento-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnChanges, OnInit {

  private scannerLoaded = false;
  public idOrgaoSelecionado: string | undefined
  public showAssuntoField: boolean = true;
  public showNumberDocField: boolean = true;
  public showDAtaField: boolean = true;
  referenciaDoc!: string;
  registroId: string | number | null = null;
  imagesScanned: any[] = [];
  isAnexo: boolean = true;
  public showAdditionalSelects = false;
  public showInput = false;
  public siglaSelecionada: string | undefined;
  public nomeOrgaoSelecionada: string | undefined;
  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public documento: any;
  @Output() public onEnviarOcorrencia: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;
  public procedenciaExterna: boolean = false;
  public haProcedencia: boolean = false;

  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

  public tipoNatureza: Array<Select2OptionData> = [];
  public tipoProveniencia: Array<Select2OptionData> = [];
  public tipoCorrespondencia: Array<Select2OptionData> = [];

  estado: Array<Select2OptionData> = [];
  tipo_destino: Array<Select2OptionData> = [];
  tipo_destino_final: Array<Select2OptionData> = [];
  direcaoOuOrgao: Array<Select2OptionData> = [];
  private direcaoOrgaoCache: { [key: string]: Array<Select2OptionData> } = {};

  public procedenciaCorrespondencia: Array<Select2OptionData> = [];
  public pessoaJuridicas: Array<Select2OptionData> = [];
  public departamentos: Array<Select2OptionData> = [];
  public funcionario: Array<Select2OptionData> = [];
  public submitted: boolean = false;
  public isLoading: boolean = false

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
  };

  public carregando: boolean = false;
  selectedTipoProveniencia: any;

  constructor(
    private fb: FormBuilder,
    private secureService: SecureService,
    private formatarDataHelper: FormatarDataHelper,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private iziToast: IziToastService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private tipoNaturezaService: TipoNaturezaService,
    private tipoProvenienciaService: TipoProvenienciaService,
    private tipoCorrespondenciaService: TipoCorrespondenciaService,
    public tipoDestinoService: TipoDestinoService,
    public tipoDestinoFinalService: DirecaoOuOrgaoService,
    private entradaexpedienteService: EntradaExpedienteService,
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private funcionarioOrgaoService: FuncionarioOrgaoService
  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documento'] && changes['documento'].currentValue !== changes['documento'].previousValue) {
      this.editForm();
    }
    this.criarForm();
    if (this.buscarId()) {
      this.editForm();
    }

    this.simpleForm.get('tipo_proveniencia_id')?.valueChanges.subscribe((value: number) => {
      this.selectedTipoProveniencia = value;
      this.updateValidators();
    });

    this.simpleForm.get('tipo_natureza_id')?.valueChanges.subscribe((value: number) => {
      this.toggleAssuntoField(value);
      this.toggleDataField(value);
      this.updateValidators();
    });

    this.simpleForm.get('tipo_correspondencia_id')?.valueChanges.subscribe((value: number) => {
      this.toggleNumberDocField(value);
      this.updateValidators();
    });

    this.simpleForm.get('tipo_orgao')?.valueChanges.subscribe((value: number) => {
    });
  }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica();
    this.buscarProcedenciaCorrespondencia();
    this.buscarTipoNatureza();
    this.buscarTipoProveniencia();
    this.buscarTipoCorrespondencia();
    this.buscarTipoDestinoFinal();
  }

  private toggleAssuntoField(value: number): void {
    if (value == 2 || value == 3 || value == 4) {
      this.showAssuntoField = false;
      this.simpleForm.get('assunto')?.setValue('');
    } else {
      this.showAssuntoField = true;
    }
  }

  private toggleNumberDocField(value: number): void {
    if (value == 6) {
      this.showNumberDocField = false;
      this.simpleForm.get('numeroOficio')?.setValue('');
    } else {
      this.showNumberDocField = true;
    }
  }  

  private toggleDataField(value: number): void {
    if (value == 2 || value == 3 || value == 4) {
      this.showDAtaField = false;
      this.simpleForm.get('data_documento')?.setValue('');
    } else {
      this.showDAtaField = true;
    }
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {
        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name, outro: item.id }))
      })
  }

  private buscarDirecaoOrgao(opcoes: any) {
  const cacheKey = JSON.stringify(opcoes);
  if (this.direcaoOrgaoCache[cacheKey]) {
    this.pessoaJuridicas = this.direcaoOrgaoCache[cacheKey];
    return;
  }

  const options = {
    ...opcoes,
    //minha_pessoajuridica_id: this.getOrgaoId,
  };

  this.direcaoOuOrgaoService
    .listarTodos(options)
    .pipe(
      debounceTime(300), // Adiciona um atraso de 300ms para evitar chamadas rápidas
      finalize(() => {})
    )
    .subscribe((response: any): void => {
      this.pessoaJuridicas = response.map((item: any) => ({
        id: item.id,
        text: item.sigla + ' - ' + item.nome_completo,
        sigla: item.sigla,
      }));
      this.direcaoOrgaoCache[cacheKey] = this.pessoaJuridicas; // Armazena no cache
    });
}

  public handlerDirecaoOrgao($event: any): void {
    if (!$event) return;

    let eventValue: any;
    if ($event.value) {
      eventValue = $event.value;
    } else if ($event.id) {
      eventValue = $event.id;
    } else if (typeof $event === 'string' || typeof $event === 'number') {
      eventValue = $event;
    } else {
      console.log('Estrutura inesperada de $event:', JSON.stringify($event, null, 2));
    }
    let selecionado = null;
    this.pessoaJuridicas.forEach(item => {
      if (String(item.id) === String(eventValue)) {
        selecionado = item;
      }
    });

    if (selecionado) {
      this.siglaSelecionada = selecionado['sigla'];
      this.nomeOrgaoSelecionada = selecionado['text'];
    } else {
      console.log('Item não encontrado na lista pessoaJuridicas');
    }
    this.buscarFuncionario({ proveniencia_id: eventValue });
  }

  recarregarPagina() {
    const opcoes = {
      pessoafisica: this.getOrgaoId,
    };
    this.documento = {};
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.pagination.current_page = 1
    this.filtro.pessoafisica = null;
    this.simpleForm.reset();
    this.buscarDirecaoOrgao(opcoes);
  }

  filtrarPagina(key: any, $e: any) {
    const opcoes = {
      pessoafisica: this.getOrgaoId,
    };
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarDirecaoOrgao(opcoes);
  }

  private buscarTipoNatureza() {
    this.tipoNaturezaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoNatureza = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }

  private buscarTipoProveniencia() {
    this.tipoProvenienciaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoProveniencia = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }

  buscarTipoDestinoFinal() {
    this.tipoDestinoFinalService
      .listarTodos({})
      .pipe()
      .subscribe((response) => {
        this.tipo_destino_final = response.map((item: any) => ({
          id: item.id,
          text: item.nome_completo.toString().toUpperCase(),
        }));
      });
  }

  private buscarTipoCorrespondencia() {
    this.tipoCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoCorrespondencia = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }

  private buscarFuncionario(opcoes: any) {
    this.funcionarioOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe({
        next: (response: any) => {
          this.funcionario = response.map((item: any) => ({
            id: item.id,
            text: `${item?.patente_nome} - ${item?.nip} - ${item?.nome_completo
              ?.toString()
              .toUpperCase()} ${item?.apelido?.toString().toUpperCase()}`,
          }));
        },
      });
  }

  /*private buscarProcedenciaCorrespondencia() {
    this.procedenciaCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.procedenciaCorrespondencia = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
  }*/

 private buscarProcedenciaCorrespondencia() {
    this.procedenciaCorrespondenciaService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          if (response.length > 0) {
            const primeiroItem = response[0];
            this.procedenciaCorrespondencia = [{
              id: primeiroItem.id,
              text: primeiroItem.nome.toString().toUpperCase(),
            }];
          } else {
            this.procedenciaCorrespondencia = [];
          }
        },
        error: (err) => {
          this.procedenciaCorrespondencia = []; // Limpa em caso de erro
        },
      });
  }


  dataDocumentoValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      return { dataInvalida: true };
    }
    return null;
  }

  onInputChange(event: any) {
    const input = event.target.value;
    const sanitizedInput = input.replace(/\D/g, '');
    if (sanitizedInput.length > 9) {
      event.target.value = sanitizedInput.slice(0, 9);
    } else {
      event.target.value = sanitizedInput;
    }
  }

  public upload(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
  }

  scanWithoutAspriseDialog(): void {
    if (!this.scannerLoaded) {
      this.loadScannerScript();
      return;
    }

    if (!(window as any).scanner) {
      this.iziToast.erro('O scanner não está disponível.');
      return;
    }

    (window as any).scanner.scan(this.displayImagesOnPage.bind(this), {
      "use_asprise_dialog": false,
      "output_settings": [
        {
          "type": "return-base64",
          "format": "jpg"
        }
      ]
    });
  }

  private loadScannerScript(): void {
    const script = document.createElement('script');
    script.src = 'assets/js/scanner.js';
    script.onload = () => {
      this.scannerLoaded = true;
      this.setupScannerErrorHandling();
      this.scanWithoutAspriseDialog();
    };
    script.onerror = () => {
      this.iziToast.erro('Erro ao carregar script do scanner.');
    };
    document.body.appendChild(script);
  }

  private setupScannerErrorHandling(): void {
    const originalWindowError = window.onerror;
    
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message && 
        (message.toString().includes('WebSocket') || 
         message.toString().includes('Failed to connect'))
      ) {
        return true;
      }
      
      return originalWindowError 
        ? originalWindowError(message, source, lineno, colno, error) 
        : false;
    };

    window.addEventListener('error', (event) => {
      if (
        event.message.includes('WebSocket') || 
        event.message.includes('Failed to connect')
      ) {
        event.preventDefault();
      }
    });
  }

  displayImagesOnPage(successful: boolean, mesg: string, response: any): void {
    try {
      if (!successful) {
        this.iziToast.erro('Falha ao escanear documento.');
        return;
      }

      if (successful && mesg && mesg.toLowerCase().indexOf('user cancel') >= 0) {
        return;
      }

      const scanner = (window as any).scanner;
      const scannedImages = scanner.getScannedImages(response, true, false);
      
      for (let i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
        const scannedImage = scannedImages[i];
        this.processScannedImage(scannedImage);
      }
    } catch (error) {
      this.iziToast.erro('Erro ao processar imagens escaneadas.');
    }
  }

  processScannedImage(scannedImage: any): void {
    this.imagesScanned.push(scannedImage);
    const imgElement = document.createElement('img');
    imgElement.src = scannedImage.src;
    imgElement.classList.add('scanned');
    imgElement.style.height = '200px';
    imgElement.style.marginRight = '12px';

    const imagesContainer = document.getElementById('images');
    if (imagesContainer) {
      imagesContainer.appendChild(imgElement);
    }
  }

  createPDF(callback: (pdfBlob: Blob) => void): void {
    if (this.imagesScanned.length === 0) {
      callback(new Blob([]));
      return;
    }

    const doc = new jsPDF();
    this.imagesScanned.forEach((scannedImage, index) => {
      if (index > 0) doc.addPage();
      doc.addImage(scannedImage.src, 'JPEG', 10, 10, 190, 280);
    });

    const pdfBlob = doc.output('blob');
    callback(pdfBlob);
  }


  private criarForm() {
    this.simpleForm = this.fb.group({
      tipo_natureza_id: ['', [Validators.required]],
      tipo_proveniencia_id: ['', [Validators.required]],
      assunto: ['', { disabled: false }, Validators.required],
      tipo_correspondencia_id: ['', [Validators.required]],
      numeroOficio: ['', { disabled: false }, [Validators.required]],
      remetente_id: [this.getOrgaoId, Validators.required],
      proveniencia_id: [''],
      provenienciaDoc: [''],
      nomeRemetente: ['', [Validators.required]],
      contactoRemetente: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      data_documento: ['', [this.dataDocumentoValidator.bind(this)]],
      anexo: [''],
      procedencia_correspondencia_id: [''],
      tipo_orgao: [''],
    });
    this.simpleForm.get('tipo_orgao')?.disable();
  }

  private editForm() {
    if (this.documento) {
      this.simpleForm.patchValue({
        id: this.documento.id,
        tipo_natureza_id: this.documento.tipo_natureza_id,
        tipo_proveniencia_id: this.documento.tipo_proveniencia_id,
        assunto: this.documento.assunto,
        tipo_correspondencia_id: this.documento.tipo_correspondencia_id,
        numeroOficio: this.documento.numeroOficio,
        remetente_id: this.documento.remetente_id,
        provenienciaDoc: this.documento.provenienciaDoc,
        nomeRemetente: this.documento.nomeRemetente,
        contactoRemetente: this.documento.contactoRemetente,
        data_documento: this.formatarDataHelper.formatDate(this.documento.data_documento),
        anexo: this.documento.anexo,
        procedencia_correspondencia_id: this.documento.procedencia_correspondencia_id,
        tipo_orgao: this.documento.tipo_orgao,
        proveniencia_id: this.documento.proveniencia_id,
      });
      this.simpleForm.get('tipo_orgao')?.enable();
    }
  }

  toggleAnexo(event: any) {
    this.isAnexo = event.target.checked;
  }

  private updateValidators() {
  const numberDocControl = this.simpleForm.get('numeroOficio');
  const assuntoControl = this.simpleForm.get('assunto');
  const procedenciaCorrespondenciaControl = this.simpleForm.get('procedencia_correspondencia_id');
  const tipoorgaoControl = this.simpleForm.get('tipo_orgao');
  const pessoaJuridicaControl = this.simpleForm.get('proveniencia_id');
  const provenienciaDocControl = this.simpleForm.get('provenienciaDoc');
  const dataDocumentoControl = this.simpleForm.get('data_documento');

  const tipoNaturezaValue = this.simpleForm.get('tipo_natureza_id')?.value;
  if (tipoNaturezaValue == 1 || tipoNaturezaValue == 5) {
    assuntoControl?.setValidators([Validators.required]);
  } else {
    assuntoControl?.clearValidators();
  }

  if (this.selectedTipoProveniencia == 1) {
    pessoaJuridicaControl?.setValidators([Validators.required]);
    provenienciaDocControl?.clearValidators();
    // Habilita campos apenas se necessário
    if (!pessoaJuridicaControl?.disabled) pessoaJuridicaControl?.enable();
    provenienciaDocControl?.disable();
  } else if (this.selectedTipoProveniencia == 2) {
    pessoaJuridicaControl?.clearValidators();
    provenienciaDocControl?.setValidators([Validators.required]);
    // Desabilita e limpa apenas se necessário
    if (!pessoaJuridicaControl?.disabled) {
      pessoaJuridicaControl?.disable();
      pessoaJuridicaControl?.setValue(null);
    }
    procedenciaCorrespondenciaControl?.setValue(null);
    tipoorgaoControl?.setValue(null);
    provenienciaDocControl?.enable();
  } else {
    pessoaJuridicaControl?.clearValidators();
    provenienciaDocControl?.clearValidators();
    if (!pessoaJuridicaControl?.disabled) pessoaJuridicaControl?.disable();
    if (!provenienciaDocControl?.disabled) provenienciaDocControl?.disable();
    procedenciaCorrespondenciaControl?.setValue(null);
    tipoorgaoControl?.setValue(null);
  }

  if (tipoNaturezaValue == 2 || tipoNaturezaValue == 3 || tipoNaturezaValue == 4) {
    dataDocumentoControl?.clearValidators();
  } else {
    dataDocumentoControl?.setValidators([Validators.required, this.dataDocumentoValidator.bind(this)]);
  }

  if (this.simpleForm.get('tipo_correspondencia_id')?.value == 6) {
    numberDocControl?.clearValidators();
  } else {
    numberDocControl?.setValidators([Validators.required]);
  }

  // Atualiza apenas os controles que mudaram
  assuntoControl?.updateValueAndValidity({ onlySelf: true });
  numberDocControl?.updateValueAndValidity({ onlySelf: true });
  pessoaJuridicaControl?.updateValueAndValidity({ onlySelf: true });
  provenienciaDocControl?.updateValueAndValidity({ onlySelf: true });
  dataDocumentoControl?.updateValueAndValidity({ onlySelf: true });
}

private getFormData() {
    const formData = new FormData();
    formData.append('tipo_natureza_id', this.simpleForm.get('tipo_natureza_id')?.value || '');
    formData.append('tipo_proveniencia_id', this.simpleForm.get('tipo_proveniencia_id')?.value || '');
    formData.append('assunto', String(this.simpleForm.get('assunto')?.value || '').trim());
    formData.append('tipo_correspondencia_id', this.simpleForm.get('tipo_correspondencia_id')?.value || '');
    formData.append('provenienciaDoc', String(this.simpleForm.get('provenienciaDoc')?.value || '').trim());
    formData.append('numeroOficio', String(this.simpleForm.get('numeroOficio')?.value || '').trim());
    formData.append('nomeRemetente', String(this.simpleForm.get('nomeRemetente')?.value || '').trim());
    formData.append('contactoRemetente', String(this.simpleForm.get('contactoRemetente')?.value || '').trim());
    formData.append('anexo', this.simpleForm.get('anexo')?.value || '');
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value || '');
    formData.append('proveniencia_id', this.simpleForm.get('proveniencia_id')?.value || '');
    const dataDocumento = this.simpleForm.get('data_documento')?.value;
    if (dataDocumento) {
        formData.append('data_documento', dataDocumento);
    }
    return formData;
}


  public onSubmit(): void {
    this.carregando = true;

    if (this.simpleForm.invalid || this.submitted) return;
    this.carregando = true;
    this.submitted = true;

    this.handleFormData();
  }

  public handleFormData() {
    this.createPDF((pdfBlob) => {
      if (pdfBlob.size === 0 && !this.simpleForm.get('anexo')?.value) {
        return;
      }

      let pdfFile: File | null = null;
      if (pdfBlob.size > 0) {
        pdfFile = new File([pdfBlob], 'documento.pdf', { type: 'application/pdf' });
      }

      const formData = this.getFormData();
      if (pdfFile) {
        formData.append('anexo', pdfFile);  // Adiciona o PDF como anexo se existir
      } else {
        const uploadedFile = this.simpleForm.get('anexo')?.value;
        if (uploadedFile) {
          formData.append('anexo', uploadedFile);  // Adiciona o arquivo carregado
        }
      }

      const type = this.buscarId()
        ? this.entradaexpedienteService.editar(formData, this.buscarId())
        : this.entradaexpedienteService.registar(formData);

      type.pipe(
        finalize((): void => {
          this.carregando = false;
          this.submitted = false;
        })
      ).subscribe({
        next: (response: any) => {
          if (response) {
          // Capturar o ID da resposta
          this.registroId = response.id || this.buscarId() || null;
          // No caso de registro (não edição), capturar o referenciaDoc da resposta
          if (this.documento) {
            this.referenciaDoc = response.referenciaDoc || this.documento.referenciaDoc ||'N/A';
          }
          // Gerar o PDF
          this.gerarPDF();
          } else {
          console.error('Erro: resposta vazia do backend.');
          this.iziToast.erro('Erro ao salvar o documento.');
          }
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onEnviarOcorrencia.emit({ enviar: true });
        },
      });
    });
  }

  public get getCorrespondenciaId() {
    return this.documento?.id;
  }

  buscarId(): number {
    return this.documento?.id;
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
    $('input-file').val('');
    this.simpleForm.patchValue({
      remetente_id: this.getOrgaoId,
    });

    $('#file-anexo').val('');

    this.limparImagensEscaneadas();
  }

  private limparImagensEscaneadas() {
    const imageContainer = document.getElementById('images');
    if (imageContainer) {
      imageContainer.innerHTML = '';
    }
  }

  public selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;
    const opcoes = {
      tipo_estrutura_sigla: $event,
    };
    this.filtro.tipo_estrutura_sigla = $event
    this.buscarDirecaoOrgao(opcoes);
  }

  public selecionarProcedencia($event: any): void {
  const opcoes = {
    pessofisica: this.getOrgaoId,
  };
  if ($event == 1) {
    this.filtro.pessoafisica = null;
    this.filtro.tipo_estrutura_sigla = 'UC';
    this.simpleForm.get('tipo_orgao')?.enable();
    this.simpleForm.get('tipo_orgao')?.setValue(null);
    this.buscarDirecaoOrgao(opcoes);
  } else if ($event == 2) {
    this.filtro.pessoafisica = this.getOrgaoId;
    this.filtro.tipo_estrutura_sigla = '';
    this.simpleForm.get('tipo_orgao')?.disable();
    this.simpleForm.get('tipo_orgao')?.setValue(null);
    this.buscarDirecaoOrgao(opcoes);
  }
}

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get getOrgaoSigla() {
    return this.secureService.getTokenValueDecode()?.orgao?.sigla;
  }

  public get getNomeOrgao(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user?.nome_completo;
  }

  get nomeIdUtilizador() {
    return this.secureService.getTokenValueDecode().user?.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
    this.reiniciarFormulario();
  }

  async gerarPDF(): Promise<void> {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const diaAtual = dataAtual.getDate();
    const forData = {
      data: dataAtual.toLocaleDateString(),
      ano: anoAtual,
      dia: diaAtual
    };

    const formData = this.simpleForm.value;
    const referenciaDoc = this.referenciaDoc;

    let pdf = new jsPDF('l', 'pt', 'a8');
    let ab = '../../../../../../../assets/dashboard/Vector 51.png';
    pdf.setFontSize(8);

    var x = 20;
    var y = 20;
    autoTable(pdf, {
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          pdf.addImage(ab, 'jpg', data.cell.x + 2, data.cell.y + 2, 10, 10);
        }
      },
    });
    pdf.addImage(ab, 'jpg', x - 14, y - 16, 60, 60);
    pdf.setFont('helvetica', 'bold');
    //pdf.text(`CODIGO: ${formData.referenciaDoc}`, x - 14, y + 70);

    let provenienciaText;
    if (formData.tipo_proveniencia_id == 1) {
      provenienciaText = this.siglaSelecionada;
    } else if (formData.tipo_proveniencia_id == 2) {
      provenienciaText = 'Externo';
    } else {
      provenienciaText = 'Desconhecido';
    }
    //pdf.text(`REFERÊNCIA: ${referenciaDoc}`, x - 14, y + 80);
    pdf.text(`CÓDIGO: ${this.registroId || 'N/A'}`, x - 14, y + 90);
    //pdf.text(`CÓDIGO: ${provenienciaText}`, x - 14, y + 90);
    pdf.text(`REF. Nº: ${referenciaDoc}/${provenienciaText}/PNA`, x - 14, y + 100);

    pdf.setFontSize(6);
    pdf.text(`*Pela Ordem e Pela Paz ao Serviço da Nação*`, x + 20, y + 110);

    pdf.setFontSize(15);
    const nomeOrgao = this.getNomeOrgao;
    const nomeRegistto = this.nomeUtilizador;

    const options = {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      margin: 1
    };
    let proOutroText;
    if (formData.tipo_proveniencia_id == 1) {
      proOutroText = this.nomeOrgaoSelecionada;
    } else if (formData.tipo_proveniencia_id == 2) {
      proOutroText = formData.provenienciaDoc;
    } else {
      proOutroText = 'Desconhecido';
    }

    let OficioText;
    if (formData.numeroOficio.trim() != '' || formData.numeroOficio != null) {
      OficioText = formData.numeroOficio;
    } else {
      OficioText = 'sem Nº de oficio';
    }
    const qrCodeValue = `Código: ${this.registroId || 'N/A'}\nProveniência: ${proOutroText}\nDestino: ${nomeOrgao}\nRef. Nº: ${referenciaDoc}/${provenienciaText}/PNA\nNº do Documento: ${OficioText}\nRegistado Por: ${nomeRegistto}\nData de Registo: ${forData.data}\nProcessado automático por SIGDOC/PNA/${forData.ano}`;

    QRCode.toDataURL(qrCodeValue, options)
      .then((url: any) => {
        pdf.addImage(url, 'PNG', x + 90, y + -11, 80, 80);
        console.log(pdf.output('blob'));
        pdf.output('dataurlnewwindow');
      })
      .catch((err: any) => {
        console.error('Erro ao gerar QR code:', err);
      });
  }
}
