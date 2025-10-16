import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { ProcedenciaCorrespondenciaService } from '@resources/modules/sigpq/core/service/config/Procedencia-Correpondencia.service';
import { TipoCorrespondenciaService } from '@resources/modules/sigpq/core/service/config/Tipo-Correspondencia.service';
import { TipoImportanciaService } from '@resources/modules/sigpq/core/service/config/Tipo-Importancia.service';
import { TipoNaturezaService } from '@resources/modules/sigpq/core/service/config/Tipo-Natureza.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize } from 'rxjs';
import { ArquivoDigitalService } from '@resources/modules/sigdoc/core/service/arquivo-digital.service';
import { FuncionarioOrgaoService } from '@core/services/Funcionario-orgao.service';
import jsPDF from 'jspdf';

//declare var scanner: any;

@Component({
  selector: 'app-sigpq-ocorrencia-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {

  private scannerLoaded = false;
  imagesScanned: any[] = [];
  selectedFile: File | null = null;
  isPinVisible = false;
  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public correspondencia: any;
  @Output() public onEnviarOcorrencia: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;

  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

  public importancias: Array<Select2OptionData> = [];
  public tipoNatureza: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public procedenciaCorrespondencia: Array<Select2OptionData> = [];
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public pessoaJuridicas: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public departamentos: Array<Select2OptionData> = [];
  public funcionario: Array<Select2OptionData> = [];

  public submitted: boolean = false;

  public adicionaPin: boolean = false;
  private formValidalitors = [Validators.required];

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
  };

  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private secureService: SecureService,
    private importanciaService: TipoImportanciaService,
    private tipoNaturezaService: TipoNaturezaService,
    private procedenciaCorrespondenciaService: ProcedenciaCorrespondenciaService,
    private tipoCorrespondenciaService: TipoCorrespondenciaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private correspondenciaService: ArquivoDigitalService,
    private iziToast: IziToastService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private funcionarioOrgaoService: FuncionarioOrgaoService,

  ) {
    this.onEnviarOcorrencia = new EventEmitter<any>();
  }

  public pagination: Pagination = new Pagination();

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  ngOnInit(): void {
    this.criarForm();
    this.buscarImportancia();
    this.buscarProcedenciaCorrespondencia();
    this.buscarTipoNatureza();
    this.buscarTipoCorrespondencia();
    this.buscarTipoEstruturaOrganica();
  }
  
  public upload(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
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

  todosSelecionados() {
    const numeroUmExiste = this.pessoaJuridicas.every((item: any) => this.agentesSelecionados.some((o: any) => o.id === item.id));

    if (numeroUmExiste) return true;
    return false;

  }

  selecionarTodos(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.pessoaJuridicas.forEach((item: any) => this.selecionarAgenteParaMobilidade(item));
    } else {
      this.agentesSelecionados = []
    }

    console.log('Selecionar Todos - Checkbox Marcado:', isChecked);
    console.log('Agentes Selecionados:', this.agentesSelecionados);
  }



  validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.agentesSelecionados.find(
      (o: any) => o.id == id
    );
    if (numeroUmExiste) return true;
    return false;
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.agentesSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.agentesSelecionados = Array.from(conjuntoUnico);

    console.log(this.agentesSelecionados)
  }

  buscarDirecaoOrgao(opcoes: any) {
    const options = {
      ...opcoes,
      minha_pessoajuridica_id: this.getOrgaoId,
    };
    this.direcaoOuOrgaoService
      .listarTodos(options)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response: any): void => {
        this.pessoaJuridicas = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }



  public handlerDirecaoOrgao($event: any) {
    if (!$event) return;

    this.buscarFuncionario({ pessoajuridicas_id: $event });
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

  recarregarPagina() {
    const opcoes = {
      pessoafisica: this.getOrgaoId,
    };
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.pessoafisica = null;
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

  private buscarImportancia() {
    this.importanciaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.importancias = response.map((item: any) => ({
            id: item.id,
            text: item.nome.toString().toUpperCase(),
          }));
        },
      });
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


  private criarForm() {
    this.simpleForm = this.fb.group({
      assunto: [null],
      id_tipoDoc: ['', Validators.required],
      //anexo: [null, Validators.required],
      remetente_id: [this.getOrgaoId, Validators.required],
      pessoajuridica_id: ['', Validators.required],
      referenciaDoc: [null, Validators.required],
      tipo_orgao: [null],
      procedencia_correspondencia_id: [null],
    });

    this.simpleForm.get('tipo_orgao')?.disable();
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
      this.scanWithoutAspriseDialog(); // Tenta escanear novamente
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
        console.log('Erro de WebSocket interceptado:', event.message);
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
    const doc = new jsPDF();
    this.imagesScanned.forEach((scannedImage, index) => {
      if (index > 0) doc.addPage();
      doc.addImage(scannedImage.src, 'JPEG', 10, 10, 190, 280);
    });
    const pdfBlob = doc.output('blob');

    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);

    callback(pdfBlob);
  }


  public onSubmit(): void {
    this.carregando = true;
  
    if (this.simpleForm.invalid || this.submitted) return;
    console.log('Valor de pessoajuridica_id:', this.simpleForm.value.pessoajuridica_id);
    
    if (!this.simpleForm.value.pessoajuridica_id.length) {
      this.iziToast.alerta('Sem destino da correspondência selecionado.');
      return;
    }
  
    this.carregando = true;
    this.submitted = true;
    this.handleFormData();
  }
  
  // Função para gerar o PDF e adicionar ao FormData
  private handleFormData() {
    this.createPDF((pdfBlob) => {
      // Cria um File a partir do blob do PDF
      const pdfFile = new File([pdfBlob], 'documento.pdf', { type: 'application/pdf' });
  
      // Agora vamos adicionar o File ao FormData
      const formData = this.getFormData();
      formData.append('anexo', pdfFile);  // Adiciona o PDF como anexo
  
      // Realiza a requisição para registrar ou editar os dados
      const type = this.getId
        ? this.correspondenciaService.editar(this.getId, formData)
        : this.correspondenciaService.registar(formData);
  
      type.pipe(
        finalize((): void => {
          this.carregando = false;
          this.submitted = false;
        })
      ).subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onEnviarOcorrencia.emit({ enviar: true });
        },
      });
    });
  }
  
  // Função para pegar os dados do formulário e preparar o FormData
  private getFormData() {
    const formData = new FormData();
    formData.append('assunto', String(this.simpleForm.get('assunto')?.value).trim());
    formData.append('id_tipoDoc', this.simpleForm.get('id_tipoDoc')?.value);
    formData.append('procedencia_correspondencia_id', this.simpleForm.get('procedencia_correspondencia_id')?.value);
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value);
    formData.append('pessoajuridica_id', this.simpleForm.value.pessoajuridica_id);
    formData.append('referenciaDoc', this.simpleForm.get('referenciaDoc')?.value);
    formData.append('anexado', this.simpleForm.get('anexado')?.value);
  
    return formData;
  }
  


  public get getId() {
    return this.id;
  }
  public get getCorrespondenciaId() {
    return this.correspondencia?.id;
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

    this.reiniciarCheckBoxs();

    $('#file-anexo').val('');
    this.adicionaPin = false;

      // Limpa o array de imagens escaneadas
    this.imagesScanned = [];

    // Limpa as imagens exibidas na página
    const imagesContainer = document.getElementById('images');
    if (imagesContainer) {
      imagesContainer.innerHTML = ''; // Remove todo o conteúdo da div
    }
  }

  private reiniciarCheckBoxs() {
    this.agentesSelecionados = [];
    this.pessoaJuridicas = [];
    const checkBoxs: Array<HTMLInputElement> = Array.from(
      document.querySelectorAll('input[type=checkbox]')
    ) as Array<HTMLInputElement>;
    if (!checkBoxs) return;

    checkBoxs.forEach((item: HTMLInputElement) => {
      item.checked = false;
    });
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
      pessoafisica: this.getOrgaoId,
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
    else {
      return;
    }
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}

