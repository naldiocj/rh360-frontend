import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IziToastService } from '@core/services/IziToastService.service';
import { SecureService } from '@core/authentication/secure.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TipoDocumentoService } from '@resources/modules/sigdoc/core/service/config/tipo-documento.service';
import { Select2OptionData } from 'ng-select2';
import { CriarDocumentoService } from '@resources/modules/sigdoc/core/service/criar-documento.service';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { PerfilService } from '@core/services/config/Perfil.service';
import { Perfil } from '@resources/modules/pa/shared/models/agente-perfil.model';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  
  public perfil!: Perfil;
  user: any;
  public simpleForm: any;
  agentesSelecionados: any = [];
  tipo_documento: Array<Select2OptionData> = [];
  public pessoaJuridicas: any = [];

  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public criardocumento: any = [];

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
  };

  public id: any;


  public options = {
    placeholder: 'Selecione uma opcão',
    width: '100%',
  };

    // override simpleForm: FormGroup<any> | undefined;
  //override simpleForm: any;

  public carregando: boolean = false;
  public submitted: boolean = false;
  onRegistardocumento: EventEmitter<any>;

  constructor(public tipoDocumentoService: TipoDocumentoService,
    public criardocumentoService: CriarDocumentoService,
    private fb: FormBuilder,
    private iziToast: IziToastService,
    private secureService: SecureService,
    private perfilServive: PerfilService,
    private agenteService: AgenteService,) {
    this.onRegistardocumento = new EventEmitter<any>();
    //this.htmlContent = this.editorTemplate;
    
    /*this.perfilServive.listar().subscribe((response) => {
        this.perfil = response;
      });*/
  }

  ngOnInit(): void {
    this.criarForm();
    this.ListarDocumentosCriados()
    //this.verPerfil();
    throw new Error('Metódo não implementado.');
  }

  imagePath = '/assets/img/insignia.png';
  imageRpa = '/assets/img/GovAO.png';


  cabecalho: string = `
  <h5 style='color: black; text-align: center; font-size: 12pt'>
  <img src="${this.imagePath}" style="text-align: center;" alt="Imagem do cabeçalho" width="50px" height="50px"> <br>
  ---**--- <br>
  REPÚBLICA DE ANGOLA <br>
  MINISTÉRIO DO INTERIOR <br>
  POLÍCIA NACIONAL DE ANGOLA <br>
  DIRECÇÃO DE TELECOMUNICAÇÕES E TECNOLOGIA DE INFORMAÇÃO <br>
  DEPARTAMENTO DE TECNOLOGIA DE INFORMAÇÃO <br>
  </h5>`;

  //editorTemplate: string = ``;
  htmlContent = '';
  //editorTemplate: string = `${this.perfil.patente_nome ? `Usuário: ${this.perfil.patente_nome}` : ''}`;
  //pdf.text(`Nome do Remetente: ${correspondencias.nomeRemetente}`, x + 40, y + 10);

  rodape: string = `
  <div class="row">


    <div style=' position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f5f5;
    padding: 20px;
    border-top: 1px solid #ddd; text-align: left; display: flex; justify-content: space-between;' class="container">
    <div style='text-align: left;' class="texto-esquerda">Av. 4 de Fevereiro <br>
    Marginal Edifício Sede -R/C <br>
    Telef: 222 33 94 61/ 222 33 54 20 <br>
    Email:dti.dti@pn.gov.ao <br>
    Facebook: Policia Nacional de Angola</div>
    <div style='text-align: right;' class="texto-direita"><img src="${this.imageRpa}" style="text-align: right;" alt="Imagem do cabeçalho" width="350px" height="110px"></div>
    </div>



  <\div>
  `;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '500px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Escreva a documentação aqui...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };

  async getContent() {
    const printWindow = window.open('', '_blank');

    printWindow?.document.write('<html><head><title>SIGDOC</title>');
    printWindow?.document.write("</head><body style='color: black;'>");
    printWindow?.document.write(this.cabecalho + this.htmlContent + this.rodape);
    printWindow?.document.write('</body></html>');

    printWindow?.document.close();

    printWindow?.document.head.insertAdjacentHTML(
      'beforeend',
      '<style media="print">body { font-size: 12pt; }</style>'
    );

    printWindow?.print();

    /*const pdfContent = this.cabecalho + this.htmlContent + this.rodape;

    const options = {
      filename: 'documento.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Convertendo o HTML para PDF
    const pdf = await html2pdf().from(pdfContent).set(options).toPdf().output('blob');*/
  }


  public upload(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    // this.simpleForm.get(campo)?.updateValueAndValidity();
  }


  private criarForm() {
    this.simpleForm = this.fb.group({
      assunto: ['', [Validators.required]],
      id_tipoDoc: ['', [Validators.required]],
      referenciaDoc: ['', [Validators.required]],
      remetente_id: [this.getOrgaoId, Validators.required],
      //anexo: [null, Validators.required],
    });

  }

  public onSubmit(): void {
    this.carregando = true;

    if (this.simpleForm.invalid || this.submitted) return;
    console.log('Valor de id_tipoDoc:', this.simpleForm.value.id_tipoDoc);
    if (!this.simpleForm.value.id_tipoDoc.length) {
      this.iziToast.alerta('Sem destino do expediente selecionado.');
      return;
    }

    this.carregando = true;
    this.submitted = true;

    const data = this.getFormData;

    const type = this.getId
      ? this.criardocumentoService.editar(this.getId, data)
      : this.criardocumentoService.registar(data);

    type
      .pipe(
        finalize((): void => {
          this.carregando = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.removerModal();
          this.onRegistardocumento.emit({ enviar: true });
        },
      });

    // console.log(this.getFormData.get('pessoajuridicas_id'))
  }

  private  async getFormData(): Promise<FormData> {

    const pdfContent = this.cabecalho + this.htmlContent + this.rodape;

    const div = document.createElement('div');
    div.innerHTML = pdfContent;
    document.body.appendChild(div);

    const canvas = await html2canvas(div);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output('blob');
    const formData = new FormData();
    formData.append('anexo', pdfBlob, 'documento.pdf');
    document.body.removeChild(div);

    formData.append(
      'assunto',
      String(this.simpleForm.get('assunto')?.value).trim()
    );
    formData.append(
      'id_tipoDoc',
      this.simpleForm.get('id_tipoDoc')?.value
    );
    formData.append(
      'referenciaDoc',
      String(this.simpleForm.get('referenciaDoc')?.value).trim()
    );
    //formData.append('anexo', pdfBlob, 'documento.pdf');

    //formData.append('anexo', this.simpleForm.get('anexo')?.value);
    formData.append('remetente_id', this.simpleForm.get('remetente_id')?.value);

    return formData; //conteudoHtml
  }

  public get getId() {
    return this.id;
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      remetente_id: this.getOrgaoId,
    });

  }



  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user?.nome_completo;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  private ListarDocumentosCriados(): void {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    }
    this.criardocumentoService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        //console.log('Valor de pessoajuridica_id:', response.data);
        this.criardocumento = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }
    })
  }



  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.ListarDocumentosCriados()

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.ListarDocumentosCriados()
  }
}
