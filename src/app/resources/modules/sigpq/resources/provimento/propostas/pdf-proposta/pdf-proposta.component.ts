import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { environment } from '@environments/environment';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { finalize } from 'rxjs';
import { AppConfig } from '../../../../../../../config/app.config'

@Component({
  selector: 'app-pdf-proposta',
  templateUrl: './pdf-proposta.component.html',
  styleUrls: ['./pdf-proposta.component.css'],
})
export class PdfPropostaComponent implements OnChanges {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  public funcionarios: any;
  public isLoading: boolean = false;

  @Input() listarPDF: any = null;

  fileUrl: any;
  baixarDocumento: boolean = false;

   tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
    introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
    siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
    logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
    logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
    useColor = AppConfig.useColor; /* Ex: COR DO TEMA */

  constructor(
    private formatarDataHelper: FormatarDataHelper,
    private propostaProvimento: PropostaProvimentoService,
    private ficheiroService: FicheiroService,
    private secureService: SecureService
  ) {}

  // ngOnChanges(): void {

  //   console.log(this.listarPDF, 'lista');
  //   console.log(this.umAgente);
  //   console.log(this.dataActual);
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['listarPDF'].currentValue != changes['listarPDF'].previousValue
    ) {
      this.buscarFuncionario();
    }
  }

  private buscarFuncionario() {
    this.isLoading = true;
    const options = {
      numero_guia: this.listarPDF?.numero,
    };
    this.propostaProvimento
      .listarPorGuia(options)
      .pipe(
        finalize((): void => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.funcionarios = response;
        },
      });
  }

  get umAgente(): boolean {
    return this.listarPDF.length > 1;
  }

  generatePDFx() {
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then(
      (canvas) => {
        const fileWidth = 200;
        const fileHeight = (canvas.height * fileWidth) / canvas.width;

        // Create PDF with custom size (twice the height of the image)
        let PDF = new jsPDF('p', 'mm', [fileWidth, fileHeight * 2]);

        // Add first image to the first page
        PDF.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          fileWidth,
          fileHeight
        );

        // Add a new page for the HTML content
        PDF.addPage();
        PDF.setFontSize(12);

        // Extract HTML content from the second page
        const htmlContent = this.invoiceElement.nativeElement.innerHTML;

        // Add HTML content to the second page
        PDF.html(htmlContent);

        // Save the PDF
        PDF.save(`Mobilidade - ${this.formatarDataHelper.formatDate()}.pdf`);
      }
    );
  }

  generatePDF(item: any) {
    const PDF = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    PDF.setFontSize(14);
    const imagemPath = 'assets/img/insignia.png';
    const imagemPathRodape = 'assets/img/rodape.jpg';
    const dataAtual = this.formatarDataHelper.formatDate();

    // const centralizarX = 80//(PDF.internal.pageSize.width / 2) - (PDF.getStringUnitWidth(`Mobilidade - ${dataAtual}`) * PDF.getFontSize() / 2);

    let y = 10;

    PDF.addImage(imagemPath, 'PNG', 100, y, 15, 15);

    y += 24;
    PDF.text('REPÚBLICA DE ANGOLA', 75, y);

    y += 7;
    PDF.text('MINISTÉRIO DO INTERIOR', 72, y);

    y += 7;
    PDF.text('------ << >> ------', 88, y);

    y += 7;
    PDF.text('POLÍCIA NACIONAL DE ANGOLA', 68, y);

    y += 7;
    PDF.text('DIRECÇÃO DE PESSOAL E Quadros', 62, y);

    y += 12;
    PDF.text('GUIA DE MARCHA N.º __________ /' + this.guiaMarcha, 58, y);

    PDF.setFontSize(12);
    y += 12;
    // Texto com quebra de linha automática
    const texto1 = `Havendo a necessidade de retomar ao seu órgão de colocação, após cessar a sua missão na comissão de recolha de dados biométricos para emissão do novo cartão de identidade, marcha desta Direcção, para a ${
      item.orgao?.nome
    }/PNA, ${item.genero == 'M' ? 'o Senhor' : 'a Senhora'} ${
      item.patente_nome
    } ${item.nip ? ', Nip I ' + item.nip : ''}, ${item.nome_completo} ${
      item.apelido
    }`;
    const textoQuebrado1 = PDF.splitTextToSize(
      texto1,
      PDF.internal.pageSize.width - 20
    );
    PDF.text(textoQuebrado1, 10, y);

    y += textoQuebrado1.length * 5; // Ajuste de posição vertical com base no número de linhas

    y += 7;
    // Texto com quebra de linha automática
    const texto2 = `Para que se não lhe ponham impedimentos, mandei passar a presente guia que vai, por mim, assinada e devidamente autenticada com selo branco em uso neste Órgão.`;
    const textoQuebrado2 = PDF.splitTextToSize(
      texto2,
      PDF.internal.pageSize.width - 20
    );
    PDF.text(textoQuebrado2, 10, y);

    y += textoQuebrado2.length * 5; // Ajuste de posição vertical com base no número de linhas

    y += 7;
    PDF.text(`"Pela ordem e pela paz, ao serviço da Nação."`, 67, y);

    y += 7;
    PDF.text(`Luanda, aos ${this.dataActual}.`, 10, y);

    y += 11;
    PDF.text(`O DIRECTOR NACIONAL`, 79, y);

    y += 14;
    PDF.text(`Gil Famoso Sebastião Da Silva`, 72, y);

    y += 10;
    PDF.text(`**COMISSÁRIO**`, 85, y);

    PDF.setFontSize(8);
    y = 282;
    PDF.text(
      `Av. 4 de Fevereiro, nº. 206, Marginal de Luanda, 1º andar, edificio sede da PNA`,
      10,
      y
    );
    y += 4;
    PDF.text(`Telefone: +(244) 222 339 962 E-mail: dpq@pn.gov.ao`, 10, y);
    y += 4;
    PDF.text(`ELAB; AO`, 10, y);

    PDF.addImage(imagemPathRodape, 'jpg', 120, 278, 16, 16);
    PDF.text(`POLÍCIA NACIONAL DE ANGOLA`, 140, 282);

    PDF.save(`Mobilidade - ${dataAtual}.pdf`);

    return;
    html2canvas(this.invoiceElement.nativeElement, { scale: 1 }).then(
      (canvas) => {
        const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
        // const fileWidth = 200;
        // const fileHeight = (canvas.height * fileWidth) / canvas.width;

        // Create PDF with custom size (twice the height of the image)
        // let PDF = new jsPDF('p', 'mm', [fileWidth, fileHeight * 2]);

        // Add first image to the first page
        // PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 0, fileWidth, fileHeight);

        // PDF.html(this.invoiceElement.nativeElement.innerHTML, {
        //   x: 0,
        //   y: -fileHeight, // Adjust this value based on your needs
        // });

        PDF.save(`Mobilidade - ${this.formatarDataHelper.formatDate()}.pdf`);
      }
    );

    // const pdf = new jsPDF();
    // pdf.text('Hello, this is a sample PDF generated using jsPDF in Angular!', 10, 10);
    // pdf.save('sample.pdf');
    // pdf.output('save', 'filename.pdf');
  }

  get dataActual() {
    return this.formatarDataHelper.formatDate(null, 'dd/MM/yyyy');
  }

  get guiaMarcha() {
    return this.formatarDataHelper.formatDate(null, 'yyyy');
  }

  ngOnDestroy(): void {}

  // urlPdfMobilidade(chave: any) {

  //   this.propostaProvimento.pdfEmGrupo({}).pipe(
  //     finalize(() => {
  //       // this.isLoading = false;
  //     })
  //   ).subscribe((response) => {
  //     // this.funcionarios = response.data;
  //     console.log(response);

  //     // this.totalBase = response.meta.current_page ?
  //     //   response.meta.current_page === 1 ? 1
  //     //     : (response.meta.current_page - 1) * response.meta.per_page + 1
  //     //   : this.totalBase;

  //     // this.pagination = this.pagination.deserialize(response.meta);
  //   });
  //   return
  //   // console.log(environment.app_url+environment.api_url_by_version+'/sigpq/mobilidade/pdf/'+chave+'');

  //   const url = environment.app_url + environment.api_url_by_version + '/sigpq/mobilidade/pdf/' + chave
  //   // this.fileUrl = this.ficheiroService.createImageBlob(url);
  //   this.fileUrl = environment.app_url + environment.api_url_by_version + '/sigpq/mobilidade/pdf/' + chave
  //   console.log(this.fileUrl);

  // }

  get isArray(): boolean {
    return Array.isArray(this.listarPDF);
  }

  public async imprimir(idElement: any) {
    await this.ficheiroService.imprimir(idElement);
  }
  public async download(idElement: any) {
    await this.ficheiroService.download_(idElement);
  }

  public get getSomenteUm() {
    return this.funcionarios?.length == 1;
  }

  public getAgente() {}
}
