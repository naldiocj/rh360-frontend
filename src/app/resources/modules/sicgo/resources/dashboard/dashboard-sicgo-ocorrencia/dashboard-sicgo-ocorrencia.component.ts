import { AfterViewInit, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ProvinciaService } from '@core/services/Provincia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { DashboardOcorrenciaService } from '@resources/modules/sicgo/core/service/dashboard/dashboard_ocorrencia/dashboard-ocorrencia.service';
import { Chart } from 'chart.js';
import { Select2OptionData } from 'ng-select2';
import { debounceTime, finalize, Subject } from 'rxjs';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import * as XLSX from 'xlsx';

export interface SubTotal {
  total: number;
  percentual: string;
}

export interface DashboardData {
  totalGeral: number;
  porDistrito: Array<{ distrito_id: number; nome: string; total: number; percentual: string }>;
  porMunicipio: Array<{ municipio_id: number; nome: string; total: number; percentual: string }>;
  porProvincia: Array<{ provincia_id: number; nome: string; total: number; percentual: string }>;
  porFamiliaCrime: Array<{ sicgo_familia_crime_id: number; nome: string; total: number; percentual: string }>;
  porTipoCrime: Array<{ sicgo_tipo_crime_id: number; nome: string; total: number; percentual: string }>;
  porTipicidadeCrime: Array<{ sicgo_tipicidade_crime_id: number; nome: string; total: number; percentual: string }>;
  subTotais: {
    [key in SubTotalKey]?: SubTotal;
  };
}

type SubTotalKey = 'testemunhas' | 'evidencias' | 'tipobens' | 'delituosos' | 'grupos' | 'status' | 'objectoCrimes' | 'veiculos' | 'vitimas'
type ChartDataType = 'provincia' | 'municipio' | 'distrito' | 'familia' | 'tipo de crime' | 'tipicidade';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard-sicgo-ocorrencia',
  templateUrl: './dashboard-sicgo-ocorrencia.component.html',
  styleUrls: ['./dashboard-sicgo-ocorrencia.component.css']
})
export class DashboardSicgoOcorrenciaComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef;
  @ViewChild('chartCanvasPie') chartCanvasPieRef!: ElementRef;
  @ViewChild('chartCanvasLine') chartCanvasLineRef!: ElementRef;

  chart: Chart | null = null;
  pieChart: Chart | null = null;
  lineChart: Chart | null = null;
  loading: boolean = false;
  hoje: Date = new Date();

  // Filtros
  options = { width: '100%', placeholder: 'Selecione uma opção', allowClear: true };
  provincias: Array<Select2OptionData> = [];
  municipios: Array<Select2OptionData> = [];
  distritos: Array<Select2OptionData> = [];
  selectedProvincia: any | null = null; // Província selecionada
  selectedMunicipio: any | null = null; // Município selecionado
  selectedDistrito: any | null = null; // Distrito selecionado
  selectedData: any | null = null; // Município selecionado


  // Dados
  dashboardData: DashboardData = {
    totalGeral: 0,
    porDistrito: [],
    porMunicipio: [],
    porProvincia: [],
    porFamiliaCrime: [],
    porTipoCrime: [],
    porTipicidadeCrime: [],
    subTotais: {}
  };

  currentChartType: 'bar' | 'pie' | 'line' = 'bar';
  // Nova propriedade tipada
  dataTypes: ChartDataType[] = ['provincia', 'municipio', 'distrito', 'familia', 'tipo de crime', 'tipicidade'];
  currentDataType: ChartDataType = 'provincia';
  displayedCards: number = 6; // Número inicial de cards a serem exibidos
  private filterSubject = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dashboardOcorrenciaService: DashboardOcorrenciaService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.filterSubject.pipe(
      debounceTime(500) // Ajuste o tempo conforme necessário
    ).subscribe(() => this.carregarDashboard());
    this.carregarProvincias();
  }

  ngAfterViewInit(): void {
    this.inicializarGraficoPadrao();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['view'] && changes['view'].currentValue) {
      const tipoGrafico: 'bar' | 'pie' | 'line' = changes['view'].currentValue.tipo || 'bar';
      this.mudarTipoGrafico(tipoGrafico);
    }
  }


  // Obter chaves válidas do objeto subTotais
  getSubTotalKeys(): SubTotalKey[] {
    return Object.keys(this.dashboardData.subTotais) as SubTotalKey[];
  }

  // Formatar nome das chaves para exibição
  formatKeyName(key: string): string {
    const names: { [key: string]: string } = {
      'testemunhas': 'Testemunhas',
      'evidencias': 'Evidências',
      'tipobens': 'Tipo de Bens',
      'vitimas': 'Vítimas',
      'veiculos': 'Veículos',
      'status': 'Status',
      'objectoCrimes': 'Objetos de Crime',
      'delituosos': 'Delituosos',
      'grupos': 'Grupos'
    };
    return names[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  // Adicione esta propriedade
  exportLoading = false;

  // Modifique os métodos de exportação
  exportarExcel(): void {
    this.exportLoading = true;
    setTimeout(() => { // Simula o processamento
      const data = this.getCurrentDataForExport();

      if (!data || data.length === 0) {
        alert('Nenhum dado disponível para exportação');
        return;
      }

      // const worksheet = XLSX.utils.json_to_sheet(data);
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
      // XLSX.writeFile(workbook, `relatorio_${new Date().toISOString()}.xlsx`);
      this.exportLoading = false;
    }, 500);
  }



  pdfUrl: SafeResourceUrl | null = null;

  async exportarPDF(): Promise<void> {
    this.exportLoading = true;

    const doc = new jsPDF();
    const data = this.dashboardData;

    // Configuração da borda azul escuro
    doc.setDrawColor(0, 0, 139); // Cor azul escuro (RGB: 0,0,139)
    doc.setLineWidth(2); // Espessura da borda de 4px

    if (!data) {
      alert('Nenhum dado disponível para exportação');
      this.exportLoading = false;
      return;
    }


    const dataOcorrencia = this.selectedData
      ? new Date(this.selectedData).toLocaleDateString('pt-PT')
      : this.hoje.toLocaleDateString('pt-PT');

    const provinciaSelecionada = this.provincias.find(p => +p.id === this.selectedProvincia)?.text || '';
    const municipioSelecionado = this.municipios.find(m => +m.id === this.selectedMunicipio)?.text || '';

    const title = `RELATÓRIO DIÁRIO – ${dataOcorrencia}`;
    const subTitle = `POLÍCIA NACIONAL DE ANGOLA\n${provinciaSelecionada ? `COMANDO PROVINCIAL DE  ${provinciaSelecionada}\n` : ''}${municipioSelecionado ? `COMANDO MUNICIPAL DE ${municipioSelecionado}\n` : ''}SUB-POSTO DE COMANDO OPERACIONAL`;

    let y = 20;

    try {
      const logoBase64 = await this.carregarImagemBase64('assets/img/logopolice.png');
      doc.addImage(logoBase64, 'PNG', 90, y, 25, 25);
      y += 35;
    } catch (e) {
      console.error('❌ Erro ao carregar imagem do logotipo:', e);
    }

    doc.setFontSize(14);
    doc.text(title, 105, y, { align: 'center' });
    y += 8;

    doc.setFontSize(10);
    doc.text(subTitle, 105, y, { align: 'center' });
    y += 12;

    const addSection = (title: string, body: string) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 10, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(body, 190);
      doc.text(lines, 10, y);
      y += lines.length * 6;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    };
  

    addSection("APRECIAÇÃO GERAL", `No dia ${dataOcorrencia}, registaram-se várias ações ${municipioSelecionado ? `no Município de ${municipioSelecionado},` : ''}${provinciaSelecionada ? `na Província de ${provinciaSelecionada}` : ''}, focadas em policiamento ostensivo, fiscalização e proximidade.`);
    addSection("FORÇAS E MEIOS", `Efectivos: 108\nMeios: viaturas, motos, armas, rádios, algemas, cones.`);

    const formatEntries = (entries: any[]) => {
      if (!entries || entries.length === 0) return 'Sem dados.';
      return entries.map(e => `• ${e.nome}: ${e.total} (${e.percentual || '0%'})`).join('\n');
    };

    addSection("POR PROVÍNCIA", formatEntries(data.porProvincia));
    addSection("POR MUNICÍPIO", formatEntries(data.porMunicipio));
    addSection("POR DISTRITO", formatEntries(data.porDistrito));
    addSection("POR FAMÍLIA DE CRIME", formatEntries(data.porFamiliaCrime));
    addSection("POR TIPO DE CRIME", formatEntries(data.porTipoCrime));
    addSection("POR TIPICIDADE", formatEntries(data.porTipicidadeCrime));

    const subTotalKeys = this.getSubTotalKeys();
    if (subTotalKeys.length > 0) {
      const subtotais = subTotalKeys.map(key => {
        const val = data.subTotais[key];
        return `• ${this.formatKeyName(key)}: ${val?.total} (${val?.percentual})`;
      }).join('\n');
      addSection("SUBTOTAIS", subtotais);
    }

    const resultados: string[] = [];
    const addIfExists = (key: SubTotalKey, label: string) => {
      const val = data.subTotais[key];
      if (val && val.total && val.total > 0) {
        resultados.push(`• ${label}: ${val.total} (${val.percentual})`);
      }
    };

    addIfExists('objectoCrimes', 'Objetos de crime');
    addIfExists('delituosos', 'Delituosos detidos');
    addIfExists('grupos', 'Grupos desmantelados');

    if (resultados.length > 0) {
      addSection("DETENÇÕES E APREENSÕES", resultados.join('\n'));
    }

    addSection("CONCLUSÃO", `A operação alcançou os objetivos estabelecidos com eficácia policial.`);

    // Rodapé
    doc.setFontSize(10);
    doc.text('"PELA ORDEM E PELA PAZ, AO SERVIÇO DA NAÇÃO"', 105, y + 10, { align: 'center' });
    doc.text(`SUB-POSTO COMANDO OPERACIONAL / ${municipioSelecionado ? ` CM${municipioSelecionado}` : ''}, ${dataOcorrencia}`, 10, y + 20);
    doc.text("A COORDENADORA: NA", 10, y + 30);
    doc.text("Gerado pelo sistema sicgo", 10, y + 36);
 

    // Marca d'água
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(150);
      doc.setFontSize(40);
      doc.text("CONFIDENCIAL", 105, 150, { align: 'center', angle: 45 });
      doc.setTextColor(0);

      // Adiciona borda azul escura em cada página
      doc.setDrawColor(0, 0, 139);
      doc.setLineWidth(2);
      doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10);
    }

    // Numeração
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Página ${i} de ${totalPages}`, 190, 290, { align: 'right' });
    }

    // ➤ Criação de blob
    console.log('📄 Gerando blob do PDF...');
    const blob = doc.output('blob');

    console.log('🔗 Criando URL para visualização do PDF...');
    const pdfBlobUrl = URL.createObjectURL(blob);

    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBlobUrl);
    console.log('✅ URL do PDF gerada e atribuída:', this.pdfUrl);

    this.cdr.detectChanges();

    const modalEl = document.getElementById('pdfModal');
    if (modalEl) {
      modalEl.style.display = 'block';
      console.log('🪟 Modal exibido com sucesso.');
    } else {
      console.warn('⚠️ Modal PDF não encontrado no DOM.');
    }

    this.exportLoading = false;
    console.log('✅ Exportação do PDF concluída.');
  }
 




  private async carregarImagemBase64(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }


  private getCurrentDataForExport(): any[] {
    switch (this.currentDataType) {
      case 'provincia':
        return this.dashboardData.porProvincia || [];
      case 'municipio':
        return this.dashboardData.porMunicipio || [];
      case 'distrito':
        return this.dashboardData.porDistrito || [];
      case 'familia':
        return this.dashboardData.porFamiliaCrime || [];
      case 'tipo de crime':
        return this.dashboardData.porTipoCrime || [];
      case 'tipicidade':
        return this.dashboardData.porTipicidadeCrime || [];
      default:
        return [];
    }
  }

  private getExportColumns(): { header: string; key: string }[] {
    const baseColumns = [
      { header: 'Nome', key: 'nome' },
      { header: 'Total', key: 'total' }
    ];

    if (this.currentDataType === 'tipo de crime') {
      return [
        { header: 'Tipo de Crime', key: 'nome' },
        { header: 'Total Ocorrências', key: 'total' }
      ];
    }

    return baseColumns;
  }

  carregarProvincias(): void {
    this.provinciaService.listarTodos({ page: 1, perPage: 18 })
      .subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.provincias = response.data.map((item: any) => ({
              id: item.id,
              text: item.nome,
            }));
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Erro ao carregar províncias:', err)
      });
  }

  handlerProvincias(event: any): void {
    this.selectedProvincia = Number(event) || null;
    this.selectedMunicipio = null;
    this.carregarDashboard();
    this.carregarMunicipios();
    this.filterSubject.next();
  }

  carregarMunicipios(): void {
    if (!this.selectedProvincia) return;

    this.municipioService.listar({ provincia_id: this.selectedProvincia })
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: (response: any) => {
          this.municipios = response.map((item: any) => ({
            id: item.id,
            text: item.nome
          }));
        },
        error: (err) => console.error('Erro ao carregar municípios:', err)
      });
  }

  carregarDistritos(): void {
    if (!this.selectedProvincia) return;

    this.distritoService.listar({ provincia_id: this.selectedProvincia })
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: (response: any) => {
          this.distritos = response.map((item: any) => ({
            id: item.id,
            text: item.nome
          }));
        },
        error: (err) => console.error('Erro ao carregar municípios:', err)
      });
  }


  // Adicione este trackBy para otimizar a renderização
  trackByKey(index: number, key: string): string {
    return key;
  }
  selecionarMunicipio(event: any): void {
    this.selectedMunicipio = Number(event) || null;
    this.selectedDistrito = null;
    this.carregarDashboard();
    this.carregarDistritos();
    this.filterSubject.next();
  }

  selecionarDistrito(event: any): void {
    this.selectedDistrito = Number(event) || null;
    this.carregarDashboard();
    this.filterSubject.next();
  }
  // Adicione estas variáveis para controle de paginação
  currentPage: number = 1;
  itemsPerPage: number = 12; // Ajuste conforme necessidade
  carregarDashboard(): void {
    this.loading = true;
    this.dashboardOcorrenciaService.getDashboardData({
      provinciaId: this.selectedProvincia,
      municipioId: this.selectedMunicipio,
      dataOcorrido: this.selectedData,
      page: this.currentPage,       // Novo parâmetro
      perPage: this.itemsPerPage    // Novo parâmetro
    }).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.atualizarGraficos();
        this.criarGraficosSubTotais(); // Adicione esta linha
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.loading = false;
      }
    });
  }


  loadMore(): void {
    this.displayedCards += 1; // Incrementa o número de cards exibidos
  }

  inicializarGraficoPadrao(): void {
    const labels = ['Carregando...'];
    const data = [1];
    this.criarGraficoBarras(labels, data);
    this.criarGraficoPizza(labels, data);
    this.criarGraficoLinha(labels, data);
  }

  atualizarGraficos(): void {
    const { porProvincia, porMunicipio, porDistrito, porFamiliaCrime, porTipoCrime, porTipicidadeCrime } = this.dashboardData;

    switch (this.currentDataType) {
      case 'provincia':
        this.atualizarChart(porProvincia, 'Províncias');
        break;
      case 'municipio':
        this.atualizarChart(porMunicipio, 'Municipio');
        break;
      case 'distrito':
        this.atualizarChart(porDistrito, 'Distrito');
        break;
      case 'familia':
        this.atualizarChart(porFamiliaCrime, 'Famílias de Crime');
        break;
      case 'tipo de crime':
        this.atualizarChart(porTipoCrime, 'Tipo de crime');
        break;
      case 'tipicidade':
        this.atualizarChart(porTipicidadeCrime, 'Tipicidade de Crimes');
        break;
    }
  }

  atualizarChart(data: any[], label: string): void {
    if (!data) return;

    const dadosAgrupados = this.agruparDadosMenores(data);

    const labels = data.map((item: any) => item.nome);
    const values = data.map((item: any) => item.total);

    if (this.currentChartType === 'bar') {
      this.criarGraficoBarras(labels, values, label);
    } else if (this.currentChartType === 'pie') {
      this.criarGraficoPizza(labels, values, label);
    } else if (this.currentChartType === 'line') {
      this.criarGraficoLinha(labels, values, label);
    }
  }

  private criarGraficosSubTotais(): void {
    this.getSubTotalKeys().forEach(key => {
      const subtotal = this.dashboardData.subTotais[key];
      if (!subtotal) return;

      const canvasId = `subtotalChart-${key}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) return;

      // Destruir gráfico existente se houver
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar dados do gráfico (exemplo com valor e complemento)
      const total = subtotal.total;
      const totalGeral = this.dashboardData.totalGeral;
      const complemento = totalGeral - total;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [this.formatKeyName(key), 'Outros'],
          datasets: [{
            data: [total, complemento],
            backgroundColor: ['#D1D1D1FF', '#09015DFF'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          }
        }
      });
    });
  }

  criarGraficoBarrasss(labels: string[], data: number[], label: string = 'Ocorrências'): void {
    this.destruirGrafico();

    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: '#36A2EB',
          borderColor: '#1E88E5',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quantidade' }
          },
          x: {
            title: { display: true, text: label }
          }
        }
      }
    });
  }
  criarGraficoBarras(labels: string[], data: number[], label: string = 'Ocorrências'): void {
    this.destruirGrafico();
    // Limite o número de itens exibidos
    const MAX_ITEMS = 15;
    const slicedLabels = labels.slice(0, MAX_ITEMS);
    const slicedData = data.slice(0, MAX_ITEMS);
    // Verifique se o gráfico já existe e destrua-o
    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Função para gerar cores baseadas na quantidade
    const getGradientColors = (values: number[]) => {
      const maxValue = Math.max(...values);
      const minColor = [54, 162, 235]; // RGB azul claro (#01436EFF)
      const maxColor = [255, 99, 132]; // RGB vermelho (#070262FF)

      return values.map(value => {
        if (maxValue === 0) return `rgb(${minColor.join(',')})`; // Caso todos valores sejam zero

        const ratio = value / maxValue;
        const r = Math.round(minColor[0] + (maxColor[0] - minColor[0]) * ratio);
        const g = Math.round(minColor[1] + (maxColor[1] - minColor[1]) * ratio);
        const b = Math.round(minColor[2] + (maxColor[2] - minColor[2]) * ratio);

        return `#070262FF`;
      });
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: getGradientColors(data), // Aplica as cores graduais
          borderColor: '#070262FF',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quantidade' }
          },
          x: {
            title: { display: true, text: label }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const total = this.dashboardData.totalGeral;
                const percentual = total > 0
                  ? ((value / total) * 100).toFixed(2) + '%'
                  : '0%';
                return `${label}: ${value} (${percentual})`;
              }
            }
          }
        }
      }
    });
  }

  criarGraficoLinha(labels: string[], data: number[], label: string = 'Ocorrências'): void {
    this.destruirGraficoLinha();

    const ctx = this.chartCanvasLineRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: '#09015DFF',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quantidade' }
          },
          x: {
            title: { display: true, text: label }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const total = this.dashboardData.totalGeral;
                const percentual = total > 0
                  ? ((value / total) * 100).toFixed(2) + '%'
                  : '0%';
                return `${label}: ${value} (${percentual})`;
              }
            }
          }
        }
      }
    });
  }
  criarGraficoPizza(labels: string[], data: number[], label: string = 'Distribuição'): void {
    this.destruirGraficoPizza();

    const ctx = this.chartCanvasPieRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: [
            '#09015DFF', '#36A2EB', '#FFFFFFFF', '#4BC0C0'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  private destruirGraficoLinha(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
  }
  mudarTipoGrafico(tipo: 'bar' | 'pie' | 'line'): void {
    this.currentChartType = tipo;
    this.atualizarGraficos();
    this.cdr.detectChanges();
  }

  // função para agrupar dados menores
  private agruparDadosMenores(data: any[]): any[] {
    const LIMITE = 5;
    if (data.length <= LIMITE) return data;

    const principais = data.slice(0, LIMITE - 1);
    const outros = data.slice(LIMITE - 1);
    const totalOutros = outros.reduce((sum, item) => sum + item.total, 0);

    return [
      ...principais,
      { nome: 'Outros', total: totalOutros }
    ];
  }

  // Método auxiliar para garantir o tipo correto
  selecionarTipoDados(tipo: string): void {
    if (this.isChartDataType(tipo)) {
      this.mudarTipoDados(tipo as ChartDataType);
    } else {
      console.warn(`Tipo de dados inválido: ${tipo}`);
    }
  }

  // Verifica se o tipo é válido
  private isChartDataType(tipo: string): tipo is ChartDataType {
    return this.dataTypes.includes(tipo as ChartDataType);
  }

  mudarTipoDados(tipo: ChartDataType): void {
    this.currentDataType = tipo;
    this.atualizarGraficos();
  }





  resetarFiltros(): void {
    this.selectedProvincia = null;
    this.selectedMunicipio = null;
    this.selectedData = null;
    this.carregarDashboard();
  }

  private destruirGrafico(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private destruirGraficoPizza(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
  }
}