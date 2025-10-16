import { Component, OnInit, OnDestroy } from '@angular/core';
import { RawEditorOptions } from 'tinymce';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CriarDocumentoService } from '@resources/modules/sigdoc/core/service/criar-documento.service';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-criar-documento',
  templateUrl: './criar-documento.component.html',
  styleUrls: ['./criar-documento.component.css'],
})
export class CriarDocumentoComponent implements OnInit, OnDestroy {
  content: string = '';

  editorConfig: RawEditorOptions = {
    height: 650,
    language: 'pt_PT',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'wordcount',
      'paste', 'textpattern', 'formatpainter',
      'importcss', 'codesample', 'nonbreaking', 'pagebreak',
      'quickbars', 'emoticons', 'hr',
      'template',
    ],
    toolbar: [
      'undo redo | styles | fontfamily fontsizeinput | bold italic underline strikethrough | forecolor backcolor | formatpainter removeformat',
      'alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | link unlink anchor image media | table tabledelete | template',
      'cut copy paste pastetext | searchreplace | insertdatetime charmap emoticons hr | codesample | preview fullscreen code',
    ].join(' '),
    menubar: 'file edit insert view format table tools help',
    menu: {
      file: { title: 'Ficheiro', items: 'newdocument preview print | savedocument' },
      edit: { title: 'Editar', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
      insert: { title: 'Inserir', items: 'link image media table insertdatetime hr anchor codesample template' },
      view: { title: 'Visualizar', items: 'visualblocks fullscreen preview' },
      format: { title: 'Formatar', items: 'bold italic underline strikethrough | fontfamily fontsize formats | forecolor backcolor | removeformat' },
      table: { title: 'Tabela', items: 'inserttable tableprops deletetable | cell row column' },
      tools: { title: 'Ferramentas', items: 'wordcount code' },
      help: { title: 'Ajuda', items: 'help' },
    },
    style_formats: [
      { title: 'Heading 1', block: 'h1' },
      { title: 'Heading 2', block: 'h2' },
      { title: 'Heading 3', block: 'h3' },
      { title: 'Normal', block: 'p' },
      { title: 'Quote', block: 'blockquote' },
    ],
    font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace; Calibri=calibri,sans-serif',
    font_size_formats: '8pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt',
    content_style: 'body { font-family: Cambria, serif; font-size: 13pt; line-height: 1.0; margin: 0; } p, h1, h2, h3 { margin-bottom: 8pt; text-align: justify; }',
    paste_as_text: false,
    quickbars_selection_toolbar: 'bold italic underline | quicklink h2 h3 blockquote',
    toolbar_mode: 'sliding',
    resize: 'both' as const,
    statusbar: true,
    wordcount_countcharacters: true,
    templates: [
      {
        title: 'Policia Nacional de Angola',
        description: 'Modelo de documento da Policia Nacional de Angola',
        content: `
<div style="text-align: center; margin-bottom: 12mm;">
  <img src="/assets/dashboard/Vector 51.png" alt="Insígnia" style="width: 100px; height: auto; margin-bottom: 10px;" onerror="this.style.display='none'">
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">POLÍCIA NACIONAL DE ANGOLA</p>
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">DIRECÇÃO DE TELECOMUNICAÇÃO E TECNOLOGIA DE INFORMAÇÃO</p>
</div>
<div style="text-align: justify; font-family: Cambria, serif; font-size: 13pt; line-height: 1.0;">
  <h1 style="margin-bottom: 8pt;">Contrato Simples</h1>
  <p style="margin-bottom: 8pt;">Este é um contrato entre <strong>[Nome da Parte 1]</strong> e <strong>[Nome da Parte 2]</strong>.</p>
  <p style="margin-bottom: 8pt;"><strong>Objeto:</strong> [Descreva o objeto do contrato aqui]</p>
  <p style="margin-bottom: 8pt;"><strong>Validade:</strong> Este contrato entra em vigor em [Data] e termina em [Data].</p>
  <p style="margin-bottom: 8pt;"><strong>Assinaturas:</strong></p>
  <p style="margin-bottom: 8pt;">___________________________<br>[Nome da Parte 1]</p>
  <p style="margin-bottom: 8pt;">___________________________<br>[Nome da Parte 2]</p>
</div>
<div style="position: absolute; bottom: 14.6mm; width: 175mm; text-align: center; font-family: Cambria, serif; font-size: 13pt;">
  Página <span class="page-number"></span>
</div>
        `,
      },
      {
        title: 'Ministério do Interior',
        description: 'Modelo de documento do Ministério do Interior',
        content: `
<div style="text-align: center; margin-bottom: 12mm;">
  <img src="/assets/img/insignia.png" style="width: 100px; height: auto; margin-bottom: 10px;" onerror="this.style.display='none'">
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">REPÚBLICA DE ANGOLA</p>
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">MINISTÉRIO DO INTERIOR</p>
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">POLÍCIA NACIONAL DE ANGOLA</p>
  <p style="margin: 0; font-family: Cambria, serif; font-size: 13pt; font-weight: bold;">DIRECÇÃO DE TELECOMUNICAÇÃO E TECNOLOGIA DE INFORMAÇÃO</p>
</div>
<div style="text-align: justify; font-family: Cambria, serif; font-size: 13pt; line-height: 1.0;">
  <h1 style="margin-bottom: 8pt;">Relatório Mensal - [Mês/Ano]</h1>
  <h2 style="margin-bottom: 8pt;">Resumo</h2>
  <p style="margin-bottom: 8pt;">[Resumo das atividades do mês]</p>
  <h2 style="margin-bottom: 8pt;">Resultados</h2>
  <ul style="margin-bottom: 8pt;">
    <li>[Item 1]</li>
    <li>[Item 2]</li>
    <li>[Item 3]</li>
  </ul>
  <h2 style="margin-bottom: 8pt;">Conclusão</h2>
  <p style="margin-bottom: 8pt;">[Conclusão ou recomendações]</p>
</div>
        `,
      },
    ],
    language_url: '/tinymce/langs/pt_PT.js',
    setup: (editor) => {
      editor.ui.registry.addMenuItem('savedocument', {
        text: 'Salvar',
        icon: 'save',
        onAction: () => {
          this.content = editor.getContent();
          this.saveDocument();
        },
      });
    },
  };

  constructor(
    private criarDocumentoService: CriarDocumentoService,
    private secureService: SecureService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  saveDocument() {
    const contentElement = document.createElement('div');
    contentElement.innerHTML = this.content;
    contentElement.style.width = '662px'; // 175 mm ≈ 662 pixels (175 * 3.78)
    contentElement.style.padding = '0mm';
    contentElement.style.boxSizing = 'border-box';
    contentElement.style.position = 'absolute';
    contentElement.style.left = '-9999px';
    contentElement.style.fontFamily = 'Cambria, serif';
    contentElement.style.fontSize = '13pt';
    contentElement.style.lineHeight = '1.0';
    document.body.appendChild(contentElement);

    // Garantir que imagens sejam carregadas antes do html2canvas
    const images = contentElement.getElementsByTagName('img');
    const promises = Array.from(images).map((img): Promise<void> => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => {
          img.style.display = 'none';
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      html2canvas(contentElement, {
        scale: 2,
        width: 662,
        windowWidth: 662,
        height: contentElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = doc.internal.pageSize.getWidth(); // 210 mm
        const pdfPageHeight = doc.internal.pageSize.getHeight(); // 297 mm
        const contentWidth = 175; // 210 mm - 20 mm (esq) - 15 mm (dir)
        const contentHeight = (canvas.height * contentWidth) / canvas.width;
        const headerHeight = 25; // Estimativa do cabeçalho (12 mm margem + ~13 mm conteúdo)
        const footerHeight = 14.6; // Altura do rodapé
        const firstPageHeight = pdfPageHeight - headerHeight - footerHeight; // Altura útil da primeira página
        let heightLeft = contentHeight;
        let position = 12; // Margem superior: 12 mm (cabeçalho)

        const addFooter = () => {
          doc.setFont('Times', 'normal');
          doc.setFontSize(11);

          // Definir margens
          const marginLeft = 10; // 10 mm
          const marginRight = 10; // 10 mm
          const contentAreaWidth = pdfWidth - marginLeft - marginRight; // 190 mm

          // Logotipo centralizado dentro da área de conteúdo
          const logoWidth = 15; // 15 mm
          const logoHeight = 10; // 10 mm
          const logoX = marginLeft + (contentAreaWidth - logoWidth) / 2; // Centralizado entre margens
          const logoY = pdfPageHeight - 14.6 - logoHeight; // Ajustado para base a 14,6 mm
          doc.addImage('/assets/dashboard/rdplogo.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

          // Texto centralizado dentro da área de conteúdo
          const centerText = [
            'Av. 4 de Fevereiro, n.º 206, Marginal de Luanda, 1.º andar, edificio sede da PNA',
            'Tel: +(244) 222 339 962  E-mail: dpq@pn.gov.ao'
          ];
          const lineHeight = 3.5; // Ajustado para caber
          const textY = pdfPageHeight - 14.6 + 3; // 3 mm acima da base
          centerText.forEach((line, index) => {
            doc.text(line, marginLeft + contentAreaWidth / 2, textY + (index * lineHeight), { align: 'center' });
          });

          // Texto institucional alinhado à direita
          const rightTextY = textY + 7; // Ajustado para caber dentro de 14,6 mm
          doc.text('POLÍCIA NACIONAL DE ANGOLA', pdfWidth - marginRight, rightTextY, { align: 'right' });
        };

        // Adiciona a primeira página com cabeçalho
        const firstPageContentHeight = Math.min(firstPageHeight, contentHeight);
        doc.addImage(imgData, 'PNG', 20, position, contentWidth, firstPageContentHeight);
        addFooter();
        heightLeft -= firstPageContentHeight;

        // Adiciona páginas adicionais sem cabeçalho
        position = 12; // Nova página começa a 12 mm
        while (heightLeft > 0) {
          doc.addPage();
          const remainingHeight = Math.min(pdfPageHeight - footerHeight - position, heightLeft);
          const yOffset = (contentHeight - heightLeft) / (contentWidth / 662) * 2; // Calcular deslocamento
          doc.addImage(imgData, 'PNG', 20, position + yOffset, contentWidth, remainingHeight);
          addFooter();
          heightLeft -= remainingHeight;
        }

        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('anexo', pdfBlob, `${Date.now()}-documento.pdf`);
        formData.append('remetente_id', this.getOrgaoId);

        this.criarDocumentoService.registar(formData).subscribe({
          next: (response: any) => {
            console.log('Documento salvo com sucesso:', response);
            document.body.removeChild(contentElement);
          },
          error: (err: any) => {
            console.error('Erro ao salvar o documento:', err);
            alert('Erro ao salvar o documento: ' + (err.message || 'Erro desconhecido'));
            document.body.removeChild(contentElement);
          },
        });
      }).catch((err) => {
        console.error('Erro no html2canvas:', err);
        alert('Erro ao gerar o PDF');
        document.body.removeChild(contentElement);
      });
    });
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }
}