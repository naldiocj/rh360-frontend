import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { ProvinciaService } from '@core/services/Provincia.service';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { ZonaLocalidadeService } from '@resources/modules/sicgo/core/config/ZonaLocalidade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { jsPDF } from 'jspdf';
import * as mammoth from 'mammoth';
import { HttpClient } from '@angular/common/http';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

// Defina html2pdf como tipo any
declare var html2pdf: any;

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css']
})
export class GeralComponent implements OnInit {

  public tipicidade: Array<Select2OptionData> = []
  public tipodecrime: Array<Select2OptionData> = []
  public crime: Array<Select2OptionData> = []
  public importancia: Array<Select2OptionData> = []
  public local: Array<Select2OptionData> = []
  public dataocorrencia: Array<Select2OptionData> = []
  public provincia: Array<Select2OptionData> = []
  public familiaCrimes: Array<Select2OptionData> = [];
  public distritos: any[] = []; municipios: any;
  municipio: any;
  public ocorrenciasFiltradas: any[] = [];
  carregando: boolean = false
  submited: boolean = false
  public ocorrencias: any[] = [];
  @Input() isDisabled: boolean = false; // Valor padrão inicial é `false`
  public isLoading: boolean = false

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
  }

  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }

  filtroAplicado: boolean = false; // Variável para verificar se o filtro foi aplicado
  opcoesDoSelector: any = []
  relatorioArr: any = []
  valoresSelecionados: string[] = [];
  valoresSelecionadosMultiplo: string[] = [];
  provincias: any;
  objectoCrimes: any;
  pagination: any;
  tipoOcorrencias: any;
  importancias: any;
  tipoCategorias: any;
  totalBase: number = 0;
  municipioService = inject(MunicipioService);
  tipoCategoriaService = inject(TipoCategoriaService);
  distritoService = inject(DistritoService);


  constructor(
    private importanciaService: ImportanciaService,
    private tipoCrimesService: TipoCrimesService,
    private objectoCrimeService: ObjectoCrimeService,
    private provinciaService: ProvinciaService,
    private cdr: ChangeDetectorRef,
    private secureService: SecureService,
    private ocorrenciaService: OcorrenciaService,
    private familiaCrimesService: FamiliaCrimesService,
    private http: HttpClient


  ) { }

  ngOnInit(): void {
    this.buscarObjectoCrime();
    this.buscarTipoOcorrencias();
    this.buscarImportancias();
    this.buscarProvincia();
    this.buscarOcorrencias();
    this.buscarFamiliaCrimes()
  }

  // Filtro que armazena os dados do formulário de filtros
  filtro: any = {
    page: 1,
    perPage: 50,
    search: '',
    familiaCrime: null,
    tipoOcorrencia: null,
    tipoCategoria: null,
    importancia: null,
    provincias: null,
    municipios: null,
    distritos: null,
    data: null,
  };

  filtrarPagina(key: string, $e: any, reiniciar: boolean = true): void {
    console.log(`Aplicando filtro para ${key}:`, $e);

    // Atualiza o filtro para a chave e valor correspondentes
    if (key === 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else {
      this.filtro[key] = $e;
    }

    // Se for reiniciar, a página será resetada para 1
    if (reiniciar) {
      this.filtro.page = 1;
    }

    console.log('Filtros aplicados ##########################:', this.filtro);
  }

  aplicarFiltro_(): void {
    console.log('Filtros aplicados ##########################:', this.filtro);

    // Chama a função para buscar as ocorrências com os filtros aplicados
    this.buscarOcorrencias();
  }

  buscarOcorrencias(): void {
    const page = 1;  // Página inicial, sempre começa da primeira página
    const perPage = 50;  // Número de itens por página

    // Monta o objeto de filtros com paginação
    const options = {
      familiaCrime: this.filtro.familiaCrime || null,
      tipoOcorrencia: this.filtro.tipoOcorrencia || null,
      tipoCategoria: this.filtro.tipoCategoria || null,
      importancia: this.filtro.importancia || null,
      provincias: this.filtro.provincias || null,
      municipios: this.filtro.municipios || null,
      distritos: this.filtro.distritos || null,
      data: this.filtro.data ? this.convertToApiFormat(this.filtro.data) : null,
      user_id: this.user,
      page: page,
      perPage: perPage
    };

    this.isLoading = true;

    // Chama o serviço de API para listar as ocorrências com os filtros e paginação
    this.ocorrenciaService.listar(options).subscribe({
      next: (response: any) => {
        let ocorrencias = response.data; // Armazena as ocorrências filtradas no frontend
        console.log('Ocorrências antes de aplicar filtros no frontend:', ocorrencias);

        // Aplica os filtros no frontend, dinamicamente, para os campos que o usuário preencheu
        if (this.filtro.provincias) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.provincia_id.toString() === this.filtro.provincias
          );
          console.log('Ocorrências filtradas pela província:', ocorrencias);
        }

        if (this.filtro.tipoOcorrencia) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.sicgo_tipo_crime_id.toString() === this.filtro.tipoOcorrencia
          );
          console.log('Ocorrências filtradas pelo tipo de ocorrência:', ocorrencias);
        }

        if (this.filtro.importancia) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.sicg_importancia_id.toString() === this.filtro.importancia
          );
          console.log('Ocorrências filtradas pela importância:', ocorrencias);
        }

        if (this.filtro.municipios) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.municipio_id.toString() === this.filtro.municipios
          );
          console.log('Ocorrências filtradas pelo município:', ocorrencias);
        }

        if (this.filtro.distritos) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.distrito_id.toString() === this.filtro.distritos
          );
          console.log('Ocorrências filtradas pelo distrito:', ocorrencias);
        }

        if (this.filtro.tipoCategoria) {
          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.sicgo_tipicidade_crime_id.toString() === this.filtro.tipoCategoria
          );
          console.log('Ocorrências filtradas pela tipicidade:', ocorrencias);
        }

        if (this.filtro.data) {
          // Converte a data para o formato esperado pelo backend (dd/MM/yyyy HH)
          const selectedDate = this.convertToApiFormat(this.filtro.data);
          console.log('Data selecionada para filtro e convertida:', selectedDate)

          ocorrencias = ocorrencias.filter((ocorrencia: any) =>
            ocorrencia.data_ocorrido === selectedDate
          );
          console.log('Ocorrências filtradas pela data:', ocorrencias);
        }

        // Armazena as ocorrências filtradas no estado
        this.ocorrencias = ocorrencias;
        console.log('------------------------------------------------------------------------------------');
        console.log('============ Ocorrências filtradas no frontend ============:', this.ocorrencias);
        console.log('------------------------------------------------------------------------------------');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao buscar ocorrências:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }



  buscarOcorrencias_old(): void {
    const page = this.filtro.page || 1;  // Página inicial
    const perPage = this.filtro.perPage || 50;  // Número de itens por página

    // Monta o objeto de filtros com a possibilidade de ignorar filtros nulos
    const options = {
      familiaCrime: this.filtro.familiaCrime || null,
      tipoOcorrencia: this.filtro.tipoOcorrencia || null,
      tipoCategoria: this.filtro.tipoCategoria || null,
      importancia: this.filtro.importancia || null,
      provincias: this.filtro.provincias ? parseInt(this.filtro.provincias, 10) : null,
      municipios: this.filtro.municipios || null,
      distritos: this.filtro.distritos || null,
      data: this.filtro.data ? this.convertToApiFormat(this.filtro.data) : null,
      user_id: this.user,
      page: page,
      perPage: perPage
    };

    this.isLoading = true;

    // Chama o serviço de API para listar as ocorrências com os filtros e paginação
    this.ocorrenciaService.listar(options).subscribe({
      next: (response: any) => {
        this.ocorrencias = response.data; // Armazena as ocorrências filtradas
        console.log('Ocorrências filtradas:', this.ocorrencias);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao buscar ocorrências:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  limparFiltro(): void {
    this.filtro = {
      familiaCrime: null,
      tipoOcorrencia: null,
      tipoCategoria: null,
      importancia: null,
      provincias: null,
      municipios: null,
      distritos: null,
      data: null,
      page: 1,  // Resetando a página para 1
      perPage: 50  // Número de itens por página
    };

    // Chama a função para carregar as ocorrências sem filtros
    this.buscarOcorrencias();
  }


  selecionarCategoriaCrime(evento: any): void {
    if (!evento) return;

    const sicgo_tipo_crime_id = evento;

    // Chama o serviço para buscar as tipicidades baseadas no tipo de crime
    this.tipoCategoriaService.listarum(sicgo_tipo_crime_id).subscribe({
      next: (response: any) => {
        this.tipoCategorias = response.map(({ id, nome }: any) => ({ id, text: nome }));

        // Resetar o valor do campo de tipicidade, pois as opções podem ter mudado
        this.filtro.tipoCategoria = null;  // Reseta a tipicidade

        // Força o Angular a detectar a mudança
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao buscar categorias de crime:', error);
      }
    });
  }

  buscarProvincia(): void {
    this.provinciaService.listarTodos({ page: 1, perPage: 18 })
      .subscribe({
        next: (response: any) => {
          console.log('provincias ##########', response);
          if (response && Array.isArray(response.data)) {
            this.provincias = response.data.map((item: any) => ({
              id: item.id,
              text: item.nome,
            }));

            const selectedProvincia = this.provincias.find((provincia: any) => provincia);
            this.provincia = selectedProvincia ? selectedProvincia.text : '';

            this.cdr.detectChanges();
          }
        },
      });
  }

  public handlerProvincias($event: any): void {
    if (!$event) {
      // Limpa os municípios e o campo se nenhuma província for selecionada
      this.municipios = [];
      this.filtro.municipioId = null;
      return;
    }

    // Reset selecionado de município
    this.municipio = null;
    this.municipios = [];

    // Carrega os municípios para a província selecionada
    this.municipioService.listar({ provincia_id: $event })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.municipios = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
        error: (err) => {
          console.error('Erro ao carregar municípios:', err);
          this.municipios = [];
        },
      });
  }

  public selecionarMunicipio($event: any) {
    if (!$event) return;

    const filtro = { municipio_id: $event };
    this.distritoService.listarTodos(filtro)
      .pipe(finalize(() => { }))
      .subscribe((response: any): void => {
        this.distritos = response.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
      });
  }


  private buscarObjectoCrime() {
    this.objectoCrimeService
      .listarTodos(this.filtro)
      .pipe()
      .subscribe({
        next: (response: any) => {
          //console.log('objecto de crime ##########', response);
          this.objectoCrimes = response.data;
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  private buscarTipoOcorrencias() {
    this.tipoCrimesService
      .listarTodos({ page: 1, perPage: 5 })
      .pipe()
      .subscribe({
        next: (response: any) => {
          //console.log('tipo de ocorrencias todas ##########', response);
          this.tipoOcorrencias = response.data.map((item: any) => ({
            id: item.id,
            text: item.nome,
            additional: {
              icon: 'fa fa-icon1' // Classe do ícone para a opção 1
            }
          }));
        },
      });
  }

  private buscarImportancias() {
    this.importanciaService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.importancias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  public selecionarCategoriaOcorrencia($event: any) {
    if (!$event) return;
    this.buscarTipoOcorrencias();
    this.tipodecrime = this.tipoOcorrencias.filter(
      (item: any) => item.id == $event
    );
    this.tipoCrimesService
      .listarTodos({ sicgo_tipo_ocorrencia_id: $event })
      .pipe()
      .subscribe({
        next: (response: any) => {
          //console.log('tipo de ocorrencias por ocorrencia id ##########', response);
          this.tipoCategorias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  // Função para converter a data do formato de entrada para o formato esperado pelo backend
  convertToApiFormat(date: string): string {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');

    // Retorna a data no formato esperado pelo backend: "dd/MM/yyyy HH", ignorando os minutos
    return `${day}/${month}/${year} ${hours}`;
  }

  /*/ Função para converter a data "yyyy-MM-ddTHH:mm" para "dd/MM/yyyy HH"
  convertToApiFormat(userDate: string): string {
    // Separa a data e hora
    const [date, time] = userDate.split('T');
    const [year, month, day] = date.split('-');

    // Aqui estamos pegando somente a hora (sem os minutos)
    const formattedDate = `${day}/${month}/${year} ${time.substring(0, 2)}`;

    return formattedDate;
  }*/

  // Função para comparar a data de ocorrência (data_ocorrido) com a data do filtro (filtro.data)
  compareDate(dataOcorrido: string, filtroData: string): boolean {

    // Comparar as datas sem os minutos, apenas data e hora
    const [day1, month1, year1, hour1] = this.splitDate(dataOcorrido);
    const [day2, month2, year2, hour2] = this.splitDate(filtroData);

    // Comparação apenas com data e hora
    if (day1 === day2 && month1 === month2 && year1 === year2 && hour1 === hour2) {
      return true;
    } else {
      return false;
    }
  }

  // Função para separar a data e hora
  splitDate(date: string): string[] {
    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour] = timePart.split(':');
    return [day, month, year, hour];
  }

  // Função para verificar se a data de ocorrência está dentro do intervalo de datas
  isWithinDateRange(dataOcorrido: string, dataInicial: string, dataFinal: string): boolean {

    // Caso o intervalo de datas não tenha sido definido, retornamos true (sem filtro)
    if (!dataInicial && !dataFinal) return true;

    // Convertendo as datas para o formato esperado pela API
    const [dayOcorrido, monthOcorrido, yearOcorrido, hourOcorrido] = this.splitDate(dataOcorrido);
    const [dayInicial, monthInicial, yearInicial, hourInicial] = this.splitDate(dataInicial);
    const [dayFinal, monthFinal, yearFinal, hourFinal] = this.splitDate(dataFinal);

    // Verificar se a data de ocorrência está dentro do intervalo
    const isAfterStart = dataInicial ? (yearOcorrido > yearInicial || (yearOcorrido === yearInicial && monthOcorrido > monthInicial) || (yearOcorrido === yearInicial && monthOcorrido === monthInicial && dayOcorrido >= dayInicial) || (yearOcorrido === yearInicial && monthOcorrido === monthInicial && dayOcorrido === dayInicial && hourOcorrido >= hourInicial)) : true;
    const isBeforeEnd = dataFinal ? (yearOcorrido < yearFinal || (yearOcorrido === yearFinal && monthOcorrido < monthFinal) || (yearOcorrido === yearFinal && monthOcorrido === monthFinal && dayOcorrido <= dayFinal) || (yearOcorrido === yearFinal && monthOcorrido === monthFinal && dayOcorrido === dayFinal && hourOcorrido <= hourFinal)) : true;

    return isAfterStart && isBeforeEnd;
  }

  get user() {
    return this.secureService.getTokenValueDecode().user.id;
  }

  get orgao_id() {
    return this.secureService.getTokenValueDecode().orgao.id;
  }
  // Método para buscar as famílias de crimes
  buscarFamiliaCrimes(): void {
    this.familiaCrimesService.listarTodos({ page: 1, perPage: 7 })
      .pipe(finalize(() => console.log('Finalizada a busca por famílias de crimes.')))
      .subscribe({
        next: (response: any) => {
          this.familiaCrimes = response.data
            .filter((item: any) => item.orgaoId === this.orgao_id)
            .map(({ id, nome }: any) => ({ id, text: nome }));

          console.log('Erro ao buscar famílias de crimes:', this.familiaCrimes);
        },
        error: (error: any) => {
          console.error('Erro ao buscar famílias de crimes:', error);
        },
      });
  }

  /*gerarRelatorioPDFComDados(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const provNome = this.ocorrencias.length > 0 ? this.ocorrencias[0].provincia : 'Província Desconhecida';
    const orgaoNome = this.ocorrencias.length > 0 ? this.ocorrencias[0].orgao : 'Órgão Desconhecido';

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('RELATÓRIO DE OCORRÊNCIAS FILTRADAS', 14, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Comando Provincial de ${provNome}`, 14, 30);
    doc.text(`Orgão: ${orgaoNome}`, 14, 40);

    // Texto introdutório
    const texto = `Este relatório apresenta o conjunto de ocorrências filtradas com base nos critérios definidos pelo utilizador. As informações incluem descrição, tipologia, localização e importância de cada ocorrência registrada.`;
    doc.text(doc.splitTextToSize(texto, 180), 14, 50);

    // Inicialização da posição para as tabelas
    let startY = 70; // Posição inicial para a primeira tabela

    // 1ª Tabela - Dados Gerais (ID, Código Sistema, Descrição, Tipo de Ocorrência)
    const tableData1 = this.ocorrencias.map((o: any) => [
      o.id,
      o.codigo_sistema,
      o.descricao?.replace(/<[^>]+>/g, ''),
      o.tipo_ocorrencia
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['ID', 'Código Sistema', 'Descrição', 'Tipo de Ocorrência']],
      body: tableData1,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Atualiza a posição para a próxima tabela
    startY += 50; // Incrementa o valor conforme a necessidade, ajustando a distância entre tabelas

    // 2ª Tabela - Detalhes do Crime (Família Crime ID, Tipo Crime ID, Tipicidade Crime ID, Categoria)
    const tableData2 = this.ocorrencias.map((o: any) => [
      o.sicgo_familia_crime_id,
      o.sicgo_tipo_crime_id,
      o.sicgo_tipicidade_crime_id,
      o.categoria
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Família Crime ID', 'Tipo Crime ID', 'Tipicidade Crime ID', 'Categoria']],
      body: tableData2,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Atualiza a posição para a próxima tabela
    startY += 50; // Ajuste a distância conforme necessário

    // 3ª Tabela - Localização (Província, Município, Distrito, Tipo Local)
    const tableData3 = this.ocorrencias.map((o: any) => [
      o.provincia,
      o.municipio,
      o.distrito,
      o.tipo_local
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Província', 'Município', 'Distrito', 'Tipo Local']],
      body: tableData3,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Atualiza a posição para a próxima tabela
    startY += 50; // Ajuste a distância conforme necessário

    // 4ª Tabela - Informações de Status e Importância (Estado, Importância, Status, Coordenadas)
    const tableData4 = this.ocorrencias.map((o: any) => [
      o.estado,
      o.importancia,
      o.status,
      o.coordinates_circle
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Estado', 'Importância', 'Status', 'Coordenadas']],
      body: tableData4,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Atualiza a posição para a próxima tabela
    startY += 50; // Ajuste a distância conforme necessário

    // 5ª Tabela - Contagem de Itens Relacionados (Arquivos, Testemunhas, Evidências, Bens)
    const tableData5 = this.ocorrencias.map((o: any) => [
      o.arquivos.length,
      o.testemunhas.length,
      o.evidencias.length,
      o.tipobens.length
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Arquivos', 'Testemunhas', 'Evidências', 'Bens']],
      body: tableData5,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Gerar o PDF
    const pdfOutput = doc.output('bloburl') as unknown as string; // Conversão para string (não 'URL')

    // Exibe o PDF no modal
    const iframe = document.querySelector("#modalGerarRelarorio iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = pdfOutput;
    }

    // Também permite o download
    doc.save('relatorio_ocorrencias.pdf');
}


  // Função para extrair texto do modelo DOCX via HTTP
  /*extractTextoDoModelo(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Usando HttpClient para buscar o arquivo da pasta 'assets'
      this.http.get('assets/MODELO.docx', { responseType: 'arraybuffer' }).subscribe({
        next: (data: ArrayBuffer) => {
          // Convertemos o conteúdo binário em texto usando Mammoth
          mammoth.extractRawText({ arrayBuffer: data }).then(result => {
            resolve(result.value);  // Retorna o texto extraído
          }).catch(err => {
            console.error("Erro ao extrair texto do modelo:", err);
            reject(err);
          });
        },
        error: (err) => {
          console.error('Erro ao carregar o arquivo DOCX:', err);
          reject(err);
        }
      });
    });
  }*/


  gerarRelatorioPDFComDados(): void {
    const doc = new jsPDF('p', 'mm', 'a4');

    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;
    let startY = 60;

    const ocorrencia = this.ocorrencias[0] || {};
    const provNome = ocorrencia.provincia || 'Província Desconhecida';
    const dataOcorrido = ocorrencia.data_ocorrido || 'Data Desconhecida';

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const logo = new Image();
    logo.src = 'assets/logopolice.png';

    // Substituição de placeholders do texto
    function substituirPlaceholders(texto: string, dados: any): string {
      const placeholders = {
        provincia: dados.provincia || 'Província Desconhecida',
        data_ocorrido: dados.data_ocorrido || 'Data Desconhecida',
        municipio: dados.municipio || 'Município Desconhecido',
        tipicidade_ocorrencia: dados.tipicidade_ocorrencia || 'Tipo de Ocorrência Desconhecido',
        tipo_interveniente: dados.tipo_interveniente || 'Tipo de Interveniente Desconhecido',
        distrito_id: dados.distrito_id || 'Distrito Desconhecido',
      };
      return texto.replace(/\{(\w+)\}/g, (_, chave: keyof typeof placeholders) => `{${placeholders[chave]}}`);
    }

    logo.onload = () => {
      const logoWidth = 30;
      const logoHeight = 30;
      const xPosition = (pageWidth - logoWidth) / 2;
      doc.addImage(logo, 'PNG', xPosition, 10, logoWidth, logoHeight);

      // Cabeçalho
      startY = 50;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('POLÍCIA NACIONAL DE ANGOLA', pageWidth / 2, startY, { align: 'center' });
      startY += 12;
      doc.text(`COMANDO PROVINCIAL DE ${provNome}`, pageWidth / 2, startY, { align: 'center' });
      startY += 12;
      doc.text(`RELATÓRIO POLICIAL DE SEGURANÇA PÚBLICA Nº 82 REFERENTE AO DIA ${dataOcorrido}`, pageWidth / 2, startY, { align: 'center' });
      startY += 15;

      // Conteúdo principal
      const textoIntroducao = `Este relatório apresenta o conjunto de ocorrências filtradas com base nos critérios definidos pelo utilizador. As informações incluem descrição, tipologia, localização e importância de cada ocorrência registrada.`;

      const textoCorpo = `
    I-INTRODUÇÃO
    a)-Durante o período em análise, 43 objectivos, sendo 24 Órgãos de Direcção do Comando Provincial, 9 Unidades de Classe de Guarda e Guarnição do Comando Provincial de {provincia} da Policia Nacional e 10 Comandos Municipais previstos no âmbito de serviço de 24 horas (Guarda das instalações e partida para os demais serviços ordinários e eventuais), com 1.574 efectivos.

    II-AVALIAÇÃO DO MEIO AMBIENTE
    a)-Calamidade Natural
    - Nada consta.

    b)-Situação Externa
    - Situação operativa ao longo da fronteira caracterizou-se estável.

    c)-Controlo dos Refugiados
    - Desde o início da operação no dia 18 de Julho de 2022, até este momento saíram um total de 820 Cidadãos da RDC, dos quais 735 Refugiados no Campo de Assentamento do Lóvua, destes 151 homens, 133 mulheres e 451 crianças, bem como 85 cidadãos da RDC não refugiados, pessoal do outro interesse do ACNUR;

    - No período de 05 de Junho á 05 de Julho de 2024, procedeu-se o registo de nascimento de 42 crianças e 6 refugiados deixaram as zonas urbanas e instalaram-se no Assentamento do Lóvua, bem como a redução de (-2) refugiados por falecimento.

    - Actualmente o Campo de assentamento do Lóvua 6.252 refugiados da RDC (=), sendo 1.148 masculinos, 1.301 femininas e 3.803 crianças. A alteração deveu-se ao nascimento de 15 crianças e a saída por repatriamento voluntário de 55 refugiados e 3 falecidos no período de 05 de Setembro ao 05 de Outubro de 2024.
    `;

      const textoDetalhes = `
    III-SITUAÇÃO DE SEGURANÇA PÚBLICA
    - O Comando Provincial da {provincia} da Polícia Nacional, registo de {tipicidade_ocorrencia} (+5) crimes, comparando ao período anterior, sendo 9 esclarecidos na ordem de 90% de operatividade, com 10 (+4) {tipo_interveniente}, ocorridos nos Municípios de {municipio} com {tipicidade_ocorrencia} crimes, {municipio} com {tipicidade_ocorrencia}, {municipio} {tipicidade_ocorrencia} e {municipio} com {tipicidade_ocorrencia} crime cada.
    `;

      const textoDetalhes2 = `
  - Descrições dos crimes:
  a)- Crime contra pessoa
  -Ofensa grave à integridade fisica, com recurso objectos cortantes “catana, faca” (apreendida), ocorrido aos, {data_ocorrido} na via pública, no destrito {distrito_id}, MUNICÍPIO DE {municipio}, com 2 presumíveis autores detidos identificados por Ilunga Ilunga, de 23 anos de idade, desocupado e Nelo Ilunga, de 20 anos de idade, desocupado, sendo ofendido Domingas Armando Kitamba, de 32 anos de idade, desocupado, Circunstâncias dos factos: Os factos sucederam quando ofendido no intuito de encerrar o estabelecimento com a venda diária, os acusados já em estado émbrios, estes não aceitavam a decisão do ofendido em que minutos depois começaram o mesmo desferindo os objectos acima mencionados causando-lhe ferimento graves na região da cabeça. Móbil do crime: Desavenças motivadas por fúteis.

  -Ofensa à integridade física, com recurso a um objecto contundente (apreendido), ocorrido aos {data_ocorrido}, no interior do quintal de uma residência, no destrito {distrito_id}, MUNICÍPIO DE {municipio}, com 1 presumivel autor detido identificado por Castro Txhissola, de 30 anos de idade, sendo ofendido Joel Cláudio Ismael,  de 25 anos de idade, desocupado,. Circunstâncias dos factos: Tudo ocorreu, numa altura em que o ofendido acabava de chegar da mata, e este posto no interior do quintal encontrou uma confusão onde o mesmo reside, e sem saber de nada foi surpreendido por 3 facada na região das costas e na testa por um elemento que esteve envolvido na briga com os seus familiares, pelo facto de um dos seus familiares ir urinar na parede destes, onde hora depois foi socorrido numa unidade hospitalar onde foi socorrido, tendo mesmo , sido suturado com 16 pontos. Móbil do crime; Justiça por mãos próprias.

  b)- Crimes contra património
  -Furto, consubstanciado na subtracção de 1 pasta, (12) calças de senhoras, (2) fatos de panos, (1) lenço, (1) vestido de senhoras, (2) pares de chinelos e (5) pastas de mulher, (apreendidos 6 Calças, 2 lenços e 2 pares de chinelos), ocorrido aos {data_ocorrido}, no interior de uma residência, no bairro {distrito_id}, MUNICÍPIO DE {municipio}, com 1 presumivel autora detida identificada por Cristiana Alexandre, de 25 anos de idade, desocupada, sendo lesada Sara João Francisco, de 23 anos de idade, desocupada, Circunstâncias dos factos: Os factos remontam no passado do dia dezasseis do mês e ano em curso, quando a lesada não se encontrava na sua residência acusada na companhia de outros indivíduos outros introduziram na residência da mesma de onde subtraíram os meios acima mencionados. Denunciado o facto e diligências realizadas no dia de hoje foi possível localizar alguns meios furtados na posse da prevaricadora.

  -Furto, consubstanciado na subtracção de 35.000,00kz, (1) Colchão, (2) Tapetes, (1) placa solar, (1) Pasta onde continha kz 35.000.00, (1) rádio, (1) Mochila e (1) Lençol, ocorrido aos {data_ocorrido}, no interior de uma residência, no bairro {distrito_id}, MUNICÍPIO DE {municipio}, 1 presumivel autor detido identificado por Victor Muatxissengue, de 23 anos de idade, desocupado, sendo lesada Neusa José,  de 26 anos de idade, doméstica. Circunstâncias dos factos: Tudo aconteceu na calada da noite quando a lesada se encontrava na casa do seu amigo, os meliantes aproveitando-se da ausência da mesma introduziram-se na residência os meios em referência. Diligências em curso foi possível procederem a detenção de um dos autores. Móbil do crime: Apetência em subtracção de bens de esfera patrimonial de outrem.

  c)- Crime contra narcotráfico
  -Tráfico e outras actividades ilícitas, consubstanciado na apreensão de 60.12kg, de estupefaciente vulgo liamba camuflados em 4 sacos de 50kg/cada, bem como 65.5000kz, ocorrido aos {data_ocorrido}, na via pública, no troço rodoviário que liga os bairros {distrito_id} a {distrito_id} que dista 4 km da sede municipal, MUNICIPIO DE {municipio}, com 1 presumivel autor detido identificado por Lucas Alfredo Pedro, tcp Lucas, de 37 anos de idade, desocupado, Circunstâncias dos factos Mediante o trabalho operativo levado acabo pelos efectivos deste Departamento em coordenação com as forças da Ordem Publica, foi possível flagrar o suspeito com a matéria de crime a serem transportados nenhuma motorizada de tipo LINGKEN cor vermelha, matrícula AMC-296-2022 "apreendida". Móbil do crime; Apetência ao lucro fácil sem justa causa.

  -Tráfico e outras actividades ilícitas, consubstanciado na apreensão de 43.20kg, de estupefaciente vulgo liamba camuflados em 3 sacos de 50kg/cada, bem como 221.000kz, ocorrido aos {data_ocorrido}, na via pública, no troço rodoviário que liga os bairros {distrito_id} a {distrito_id} que dista 4 km da sede municipal,  MUNICIPIO DE {municipio}, com 1 presumivel autor detido identificado por Corinto Manuel Quixindo,  de 36 anos de idade, camponês, Circunstâncias dos factos; Mediante o trabalho operativo levado acabo pelos efectivos deste Departamento em coordenação com as forças da Ordem Pública, foi possível flagrar o suspeito com a matéria de crime a serem transportados nenhuma motorizada de tipo LINGKEN cor preta, matrícula sem chapa de matrícula "apreendida". Móbil do crime; Apetência ao lucro fácil sem justa causa.

  -Tráfico e outras actividades ilícitas, consubstanciado na apreensão de 59.4kg, de estupefaciente vulgo liamba camuflados em 4 sacos de 50kg/cada, bem como 50.000kz, ocorrido aos {data_ocorrido}, na via pública, no troço rodoviário que liga os bairros {distrito_id} a {distrito_id} que dista 4 km da sede municipal, MUNICIPIO DE {municipio}, com 1 presumivel autor detido identificado por Agostinho Mateus Francisco, de 48 anos de idade, camponês, Circunstâncias dos factos; Mediante o trabalho operativo levado acabo pelos efectivos deste Departamento em coordenação com as forças da Ordem Pública, foi possível flagrar o suspeito com a matéria de crime a serem transportados nenhuma motorizada de tipo LINGKEN cor preta, com chapa de matrícula, ADMX. 28-2022 "apreendida". Móbil do crime; Apetência ao lucro fácil sem justa causa.

  -Tráfico e outras actividades ilícitas, consubstanciado na apreensão de 42.7kg, de estupefaciente vulgo liamba camuflados em 3 sacos de 50kg/cada, bem como 52.000kz, ocorrido aos {data_ocorrido}, na via pública, no troço rodoviário que liga os bairros {distrito_id} a {distrito_id} que dista 4 km da sede municipal, MUNICIPIO DE {municipio}, com 1 presumivel autor detido identificado por Marco Tiago Sabalo, de 21 anos de idade, camponês, Circunstâncias dos factos; Mediante o trabalho operativo levado acabo pelos efectivos deste Departamento em coordenação com as forças da Ordem Pública, foi possível flagrar o suspeito com a matéria de crime a serem transportados nenhuma motorizada de tipo LINGKEN cor vermelha, matrícula ACI- 112-2023 "apreendida". Móbil do crime; Apetência ao lucro fácil sem justa causa.

  d)- Crime contra produtos petrolífero
  -Circulação de produtos petrolíferos para contrabando, consubstanciado na apreensão de 1.075 litros de combustível, sendo 75lts do tipo gasolina armazenados em 3 bidões, com a capacidade de 1/25 litros e 1.000lts do gasóleo, armazenado em 40 bidões com capacidade de 1/25 cada, ocorrido aos {data_ocorrido}, no lugar ermo, MUNICIPIO DE {municipio}, com 1 presumivel autor prófugo, Circunstâncias dos factos: Mediante trabalho de inteligência criminal levado a cabo pelos operacionais da PGF, foi possível, flagrar os acusados com o referido produto, com fito de levá-los a comercializar em Fronteirado Furtuna, tendo os autores colocaram-se a monte. Sendo participante PGF. Móbil do crime: Ânsia na obtenção de lucro fácil.

  b)- Crimes contra economia
  -Posse ilícita de minerais estratégicos, de 25 SPD (apreendidas), ocorrido aos {data_ocorrido}, no interior de residência, no bairro {distrito_id}, MUNICÍPIO DE {municipio}, com 1 presumivel autor detido identificado por Djavan Marcelo de Contreiras Segundo, de 29 anos de idade, vigilante afecto a empresa de segurança privada denominada Tele-Service, Circunstâncias dos factos: No âmbito do trabalho de inteligência criminal, substanciado no combate aos crimes económicos, o Departamento Municipal, procedeu apreensão em flagrante delito, das supostas pedras acima referidas. Móbil do crime; Apetência ao enriquecimento fácil.

  ACIDENTE DE VIAÇÃO
  - Durante período registou-se 4 (+1) casos, comparado ao período anterior, que resultou em 1 morto e 7 feridos sendo 5 graves e 2 ligeiros, bem como danos materiais por se avaliar, ocorridos nos Municípios do {municipio}, {municipio} e {municipio}.
  Descrições dos acidentes:

  -Colisão, ocorreu aos {data_ocorrido}, nas imediações do bairro {distrito_id}, concretamente defronte ao {distrito_id}, dentro das localidades, MUNICIPIO DE {municipio}, Meio interveniente Trata-se de dois ciclomotor em circulação cujo (A) de marca K.T.M de cor descaracterizada sem a chapa de matrícula ignora-se a sua propriedade por não apresentar a documentação, o condutor é tido como prófugo. Tendo colidido com ciclomotor (B) de marca lingken de cor preta com a chapa de matrícula A.C.L. 519/2024 ignora -se sua propriedade por não apresentar a documentação, conduzido pelo cidadão que atende pelo nome de Carlos Samafo, de 50 anos de idade, não habilitado com a licença de condução. Tendo apresentado fractura na clavícula direita na região external n° 16. O mesmo transportava um passageiro que atende pelo nome de Filipe Alfredo, de 22 anos de idade, Tendo apresentado fractura dos maxilares direito, conforme a anatómica da face anterior do corpo humano. Do acidente resultou ferimentos aos dois passageiros acima referenciados, bem como danos materiais por se avaliar, As causas do acidente: causa primária presume-se excesso de velocidade, Causa segundaria a imprudência do condutor do ciclomotor (A).

  -Atropelamento, ocorreu aos {data_ocorrido}, no troço que liga entroncamento dos Diversos a Igreja Católica, concretamente nas mediações do Governo Provincial de {provincia}. Dentro das Localidades, MUNICIPIO DE {municipio}, Meio interveniente Trata-se de um Ciclomotor de marca Lifan-50cc modelo Lf-50-7A cor Preta com a chapa de matrícula Admch-1379/2024, conduzido pelo Senhor António Lubadi Calala Zacarias, de 23 anos de idade, circulava no sentido de marcha Norte/Sul, através da velocidade excessiva não lhe foi possível fazer parar o seu Ciclomotor no espaço livre e visível a sua frente, tendo atropelado o peão, ignora-se os dados, que pretendia atravessar a estrada, Do acidente resultou em 2 feridos destes: 1° Peã com contusão forte e ferimentos grave na região fácil e suturado com 6 pontos e 2° Condutor do Ciclomotor, com contusão forte e escoriações. Socorridos no Hospital Geral do Dr. David Bernardino Kamanga na Centralidade do Mussungue, onde recebem o tratamento médio, bem como danos materiais por se avaliar. As causas do acidente: A causa Primária presume-se velocidade excessiva. A causa Secundária o desrespeito ao regulamento do código da estrada ao Condutor.

  -Colisão frontal com traseira entre Ciclomotor e motociclo, ocorreu aos {data_ocorrido}, no troço que liga bairro {distrito_id} ao bairro {distrito_id}, concretamente nas mediações da {distrito_id}, Dentro das Localidades, MUNICIPIO DE {municipio}, Meio interveniente envolvendo um ciclomotor de marca Lingknen 50cc cor Preta, registado sob matrícula ADML-2072/024 conduzido pelo Senhor Ambrósio Sozinho José Miúdo, de 34 anos de idade, desocupado, não habilitado, circulava no sentido de marcha Norte/Sul, através da velocidade excessiva que imprimia, não conseguiu dominar o se meio no espaço livre e visível a sua frente, tendo colidido com motociclo de marca Lingken 150cc, cor preta, registado sob matrícula LD-32-67-HHI conduzido pelo Senhor Cassange Gumiga Joaquim, de 46 anos de idade, não habilitado, circulava no sentido de marcha Norte/Sul. Do acidente resultou em ferimentos graves ao condutor n° 2 e socorrido através dos seus familiares para Hospital Geral Dr. David Bernardino Kamanga. Causas do acidente: A causa Primária, presume-se velocidade excessiva. Causa Secundária Ultrapassagem irregular ao Condutor A.

  -Atropelamento em seguida colisão entre veículo e ciclomotor, ocorreu aos {data_ocorrido}, no bairro {distrito_id}, concretamente defronte a {distrito_id}, dentro das localidades, MUNICIPIO DE {municipio}, Meio interveniente onde envolve um veículo automóvel de marca Toyota modelo Land-Cruiser, cor branca, registado sob matrícula LD-75-55-IH, pertencente a Nors Construction Equipamento Angola Lda e conduzido pelo cidadão que atende pelo nome de Bernardino Chilombo Puca, de 57 anos de idade, motorista, habilitado, que circulava no sentido de marcha Norte/Sul, através da velocidade excessiva não conseguiu dominar o seu veículo no espaço livre e visível a sua frente, tendo atropelado o peão que em vida chamou-se Henriques Mulucano Cristina Muamufia, de 18 anos de idade, desocupado, Na tentetiva de se meter em fuga na estrada que liga bairro Camutue aproximadamente a 8 km, e com o excesso excessiva tendo colidido com ciclomotor de marca Lingknen 50cc, cor preta registado sob matrícula ADML-94/024, conduzido pelo cidadão que atende pelo nome de José Webo, de 22 anos de idade, não habilitado. Do acidente resultou a morte ao peão e ferimentos leves ao condutor de ciclomotor e ao seu ocupante cujo os seus dados ignora se e danos materiais por avaliar. Causas do acidente: presume-se velocidade excessiva ao condutor do veículo automóvel.
`;

      const textoDetalhes3 = `
  ACTIVIDADES DE ENFRENTAMENTO
  -As Forças de manutenção da Ordem e Tranquilidade Pública, durante o período em análise realizaram um total de 952 serviços operativos, distribuídos em 3 Permanências, 549 Postos fixos, 262 Patrulhamentos apeados, 99 Patrulhamentos Autos, 19 Patrulhamentos Motorizados, 20 Fiscalizações, empregue de 1.574 efectivos, destes: 131 Oficiais, 365 Subchefes e 1.078 Agentes, que consumiram 22.848 Horas de serviço. Em termos de resultados as forças garantiram a Ordem e tranquilidade públicas em todas as áreas sujeitas a actuação policial. No prosseguimento do trabalho do reforço do patrulhamento aos Comandos Municipais do Chitato, Cambulo e Cuango, estão desdobrados 41 efectivos da 8ª Unidade Territorial da Polícia de Intervenção Rápida, apoiados com diversos meios orgânicos, com destaque, 6 viaturas ligeiras e 1 motorizada; Em termos de resultados, garantiu-se a ordem e tranquilidade públicas em todos os aglomerados populacionais. Vide tabela abaixo.
`;

      const textoDetalhes4 = `
a)-Factos Relevantes
- Nada consta.

b)-Asseguramento de eventos
- Nada consta.

c)-Operações Policiais.
- Nada consta.

- Repatriamento Administrativo

- Nada consta

d)-Repatriamento Judicial
- Nada consta.

e)-Saída Voluntária
- Nada consta

f)-Apreensões
-1 Pasta, 12 calças de senhoras, 2 fatos de panos, 1 vestido de senhora, 2 pares de chinelos, 5 pastas de mulher, 6 Calças, 3 lenços, 205.42 kg, de estupefaciente vulgo liamba, bem como 388.500kz, 1.075 litros de combustível, sendo 75lts do tipo gasolina, 1.000lts do gasóleo, 25 SPD, 1 Colchão, 2 Tapetes, 1 placa solar, 1 Pasta onde continha kz 35.000.00, 1 rádio, 1 Mochila e 1 Lençol.

- Fiscalização do Trânsito: 1 viatura e 2 motorizadas.

-Infracções ao código de estrada.

- Foram registadas 3 multas, avaliadas Akz. 25.344.00, destas nenhuma paga.

g)-Regularização e fiscalização do trânsito
-As forças de regularização e fiscalização do trânsito, durante o período em análise, foram montados 20 postos fixos, 19 patrulhamento apeado, 4 patrulhamento auto e 7 patrulhamento moto, totalizando 50 serviços, empregue de 93 efectivos que consumiram 1.200 horas de serviços, que resultaram na apreensão de 1 viatura e 2 motorizadas, foram registados 3 multas, avaliadas Akz. 25.344.00, destas nenhuma paga, factos ocorridos nos Municípios de {municipio}.

- Realizou actividades de sensibilização, que teve como objectivo sensibilizarem os condutores da necessidade legal e obrigatória, sobre o uso de acessórios de segurança tais como; cinto de segurança, uso correcto do capacete de protecção, ajuda de travessia de infantis, cadeiras de retenção e testagem com bafómetro.
`;

      const textoDetalhes5 = `
IV) - INVESTIGAÇÂO CRIMINAL
-Participações foram lavradas de acordo os casos registados nos capítulos da Situação delituosa e de acidentes de viação.

Movimento Processual e detidos
- Nada consta

a)-Sequência investigativa
- Nada consta

b)-Controla-se a nível da Província um total de 424 (+2) detidos em regime de prisão preventiva, implicados em crimes de natureza diversa, comparativamente ao período anterior.
`;

      const secoes = [
        substituirPlaceholders(textoIntroducao, ocorrencia),
        substituirPlaceholders(textoCorpo, ocorrencia),
        substituirPlaceholders(textoDetalhes, ocorrencia),
      ];

      for (const texto of secoes) {
        const linhas = texto.split('\n');
        for (let linha of linhas) {
          linha = linha.trim();
          if (!linha) continue;

          const isTitulo = /^[IVXLCDM]+[-\s]/.test(linha) || (linha === linha.toUpperCase() && linha.length < 80);
          const sublinhas = doc.splitTextToSize(linha, pageWidth - 2 * margin);

          for (const sublinha of sublinhas) {
            if (startY + lineHeight > pageHeight - margin) {
              doc.addPage();
              startY = margin;
            }

            const partes = sublinha.split(/(\{.*?\})/); // divide pelos placeholders

            let x = margin;
            for (const parte of partes) {
              const isPlaceholder = /^\{.*\}$/.test(parte);
              const textoLimpo = parte.replace(/[\{\}]/g, '');

              doc.setFont('helvetica', isPlaceholder ? 'bold' : isTitulo ? 'bold' : 'normal');
              const largura = doc.getTextWidth(textoLimpo);
              doc.text(textoLimpo, x, startY, { baseline: 'top' });
              x += largura;
            }

            startY += lineHeight;
          }
        }
      }

      startY += 5; // Espaço entre o texto e a tabela

      // TABELA 1 - CRIMES POR FAMÍLIAS DELITUOSAS, ÁREAS DE REGISTO E DETIDOS **************************************** Table start here *********************************
      const marginX = 8;
      // Largura da coluna de crimes ligeiramente menor
      const columnStyles = {
        0: { cellWidth: 40, halign: 'left' as const },
        1: { cellWidth: 11 }, 2: { cellWidth: 11 }, 3: { cellWidth: 11, halign: 'center' as const },
        4: { cellWidth: 11 }, 5: { cellWidth: 11 }, 6: { cellWidth: 11 },
        7: { cellWidth: 11 }, 8: { cellWidth: 11 },
        9: { cellWidth: 13 }, 10: { cellWidth: 13 }, 11: { cellWidth: 13 },
        12: { cellWidth: 13 }, 13: { cellWidth: 13 }
      };

      const title = "Tabela nº 1 – Crimes por famílias delituosas, áreas de registo e detidos.";
      const textWidth = doc.getTextWidth(title);

      // Centraliza a legenda da tabela no topo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(title, (pageWidth - textWidth) / 2, startY);

      autoTable(doc, {
        startY: startY + 5,
        head: [
          [
            { content: 'CRIMES', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
            { content: 'AREAS ADMINISTRATIVAS (POR MUNICÍPIOS/COMANDOS MUNICIPAIS)', colSpan: 13, styles: { halign: 'center' } }
          ],
          [
            { content: 'MUSSUN', styles: { fontSize: 4 } },
            { content: 'CAMBUL', styles: { fontSize: 4 } },
            { content: 'DUNDO', styles: { fontSize: 4 } },
            { content: 'CANZAR', styles: { fontSize: 4 } },
            { content: 'CAUNGUL', styles: { fontSize: 4 } },
            { content: 'LOUVA', styles: { fontSize: 4 } },
            { content: 'LUCAPA', styles: { fontSize: 4 } },
            { content: 'CAPENDA', styles: { fontSize: 4 } },
            { content: 'ACTUAL', styles: { fontSize: 4 } },
            { content: 'ANTERIOR', styles: { fontSize: 4 } },
            { content: 'DIFERENÇA', styles: { fontSize: 4 } },
            { content: 'ESCLARECIDOS', styles: { fontSize: 4 } },
            { content: 'DETIDOS', styles: { fontSize: 4 } }
          ]
        ],
        body: [
          ['Ofensa grave à integridade física', '', '', '1', '1', '', '', '', '', '2', '', '+2', '2', '3'],
          ['Homicídio qualificado motivos', '', '', '', '', '', '', '', '', '1', '', '-1', '-', '-'],
          ['Furto', '', '', '', '2', '', '', '', '', '2', '', '+2', '2', '2'],
          ['Furto qualificado', '', '', '', '', '', '', '', '', '1', '', '-1', '-', '-'],
          ['Roubo', '', '', '', '', '', '', '', '', '1', '', '-1', '-', '-'],
          ['Tráfico e outras actividades ilícitas', '', '', '', '', '', '', '', '', '4', '', '+4', '4', '4'],
          ['Circulação de produtos petrolíferos', '', '1', '', '', '', '', '', '', '1', '', '+1', '-', '-'],
          ['Posse de 25 SPD', '', '', '', '', '', '', '', '', '1', '', '-', '-', '-'],
          [{ content: 'Total', styles: { fontStyle: 'bold' } }, '', '1', '', '2', '3', '', '', '', '10', '5', '+5', '9', '10']
        ],
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle',
          textColor: 30,
          lineColor: [200, 200, 200],   // cor azul suave
          lineWidth: 0.1                // espessura fina para todas as linhas
        },
        columnStyles,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          halign: 'center',
          fontStyle: 'bold',
          lineColor: [200, 200, 200],   // aplica a mesma cor no cabeçalho
          lineWidth: 0.1
        },
        bodyStyles: {
          halign: 'center',
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        margin: { left: marginX, right: marginX },
      });
      /* *************************************** Table finish here ********************************************************************************************/

      startY += 10;
      startY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(12);
      // Renderizar textoDetalhes2 com mesma formatação das seções anteriores
      const detalhes2Formatado = substituirPlaceholders(textoDetalhes2, ocorrencia);
      const linhas2 = detalhes2Formatado.split('\n');

      for (let linha of linhas2) {
        linha = linha.trim();
        if (!linha) continue;

        const isTitulo = /^[IVXLCDM]+[-\s]/.test(linha) || (linha === linha.toUpperCase() && linha.length < 80);
        const sublinhas = doc.splitTextToSize(linha, pageWidth - 2 * margin);

        for (const sublinha of sublinhas) {
          if (startY + lineHeight > pageHeight - margin) {
            doc.addPage();
            startY = margin;
          }

          const partes = sublinha.split(/(\{.*?\})/);
          let x = margin;
          for (const parte of partes) {
            const isPlaceholder = /^\{.*\}$/.test(parte);
            const textoLimpo = parte.replace(/[\{\}]/g, '');

            doc.setFont('helvetica', isPlaceholder ? 'bold' : isTitulo ? 'bold' : 'normal');
            doc.setFontSize(12);
            const largura = doc.getTextWidth(textoLimpo);
            doc.text(textoLimpo, x, startY, { baseline: 'top' });
            x += largura;
          }
          startY += lineHeight;
        }
      }

      /********************************* 2 Tabela ************************************************************/
      startY += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("Tabela nº 2 – Crimes por famílias delituosas, áreas de registo e detidos.", pageWidth / 2, startY, { align: 'center' });
      startY += 5;

      // Adiciona Tabela Dinâmica com Totais
      const municipios = Array.from(new Set(this.ocorrencias.map((o: any) => o.municipio)));
      const tiposAcidente = [
        'atropelamento', 'capotamento', 'atropelamento seguido colisao',
        'despiste', 'colisao', 'choque contra obstaculo fixo',
        'queda de passageiro', 'despiste seguido capotamento'
      ];

      const tabelaAcidentes = municipios.map((municipio, index) => {
        const ocorrenciasMunicipio = this.ocorrencias.filter((o: any) => o.municipio === municipio);
        const total = ocorrenciasMunicipio.length;
        const mortos = ocorrenciasMunicipio.filter((o: any) => o.tipo === 'morte').length;
        const graves = ocorrenciasMunicipio.filter((o: any) => o.tipo === 'ferido grave').length;
        const ligeiros = ocorrenciasMunicipio.filter((o: any) => o.tipo === 'ferido ligeiro').length;

        const linha = [
          (index + 1).toString(),
          municipio,
          total.toString(),
          ...tiposAcidente.map(tipo => ocorrenciasMunicipio.filter((o: any) => o.descricao?.toLowerCase().includes(tipo)).length.toString()),
          mortos.toString(),
          graves.toString(),
          ligeiros.toString(),
          ''
        ];

        return linha;
      });

      const totais = [
        'TOTAL', '',
        this.ocorrencias.length.toString(),
        ...tiposAcidente.map(tipo => this.ocorrencias.filter((o: any) => o.descricao?.toLowerCase().includes(tipo)).length.toString()),
        this.ocorrencias.filter((o: any) => o.tipo === 'morte').length.toString(),
        this.ocorrencias.filter((o: any) => o.tipo === 'ferido grave').length.toString(),
        this.ocorrencias.filter((o: any) => o.tipo === 'ferido ligeiro').length.toString(),
        ''
      ];

      tabelaAcidentes.push(totais);

      const headRow1 = [
        { content: 'Nº', rowSpan: 2 },
        { content: 'MUNICÍPIOS', rowSpan: 2 },
        { content: 'TOTAL', rowSpan: 2 },
        ...tiposAcidente.map(t => ({ content: t.toUpperCase(), rowSpan: 2 })),
        { content: 'FERIDOS', colSpan: 3 },
        { content: 'Danos materiais por se avaliar', rowSpan: 2 }
      ];

      const headRow2 = [
        { content: 'MORTOS' },
        { content: 'GRAVES' },
        { content: 'LIGEIROS' }
      ];

      (doc as any).autoTable({
        startY: startY,
        head: [headRow1, headRow2],
        body: tabelaAcidentes,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          valign: 'middle',
          halign: 'center',
          textColor: 30,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        margin: { left: 8, right: 8 },
      });

      startY = (doc as any).lastAutoTable.finalY + 5;
      /********************************* 2 Tabela finish here ************************************************************/

      // Renderizar textoDetalhes3 com mesma formatação das seções anteriores ********************************************
      startY += 10;
      startY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(12);
      const detalhes3Formatado = substituirPlaceholders(textoDetalhes3, ocorrencia);
      const linhas3 = detalhes3Formatado.split('\n');

      for (let linha of linhas3) {
        linha = linha.trim();
        if (!linha) continue;

        const isTitulo = /^[IVXLCDM]+[-\s]/.test(linha) || (linha === linha.toUpperCase() && linha.length < 80);
        const sublinhas = doc.splitTextToSize(linha, pageWidth - 2 * margin);

        for (const sublinha of sublinhas) {
          if (startY + lineHeight > pageHeight - margin) {
            doc.addPage();
            startY = margin;
          }

          const partes = sublinha.split(/(\{.*?\})/);
          let x = margin;
          for (const parte of partes) {
            const isPlaceholder = /^\{.*\}$/.test(parte);
            const textoLimpo = parte.replace(/[\{\}]/g, '');

            doc.setFont('helvetica', isPlaceholder ? 'bold' : isTitulo ? 'bold' : 'normal');
            doc.setFontSize(12);
            const largura = doc.getTextWidth(textoLimpo);
            doc.text(textoLimpo, x, startY, { baseline: 'top' });
            x += largura;
          }
          startY += lineHeight;
        }
      }
      /****************************************************************************************************************/

      // Tabela 3 - Serviços de vigilância e patrulhamento *************************************************************
      startY += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("Tabela nº 3 – SERVIÇOS DE VIGILÂNCIA E PATRULHAMENTO", pageWidth / 2, startY, { align: 'center' });
      startY += 5;

      const headTabela3 = [
        [
          { content: 'Nº', rowSpan: 2 },
          { content: 'ÓRGÃOS PROVINCIAIS, UNIDADES E COMANDOS MUNICIPAIS', rowSpan: 2 },
          { content: 'PERMANÊNCIAS', rowSpan: 2 },
          { content: 'POSTOS FIXOS', rowSpan: 2 },
          { content: 'PATRULHAS', colSpan: 5 },
          { content: 'TOTAL DE SERVIÇOS', rowSpan: 2 },
          { content: 'EFECTIVOS EMPREGUES', rowSpan: 2 },
          { content: 'MEIOS EMPREGUES', colSpan: 4 },
          { content: 'ESQUADRAS MÓVEIS', rowSpan: 2 },
          { content: 'TOTAL DE MEIOS', rowSpan: 2 },
          { content: 'HORAS CONSUMIDAS', rowSpan: 2 }
        ],
        [
          { content: 'APEADO' },
          { content: 'AUTOMOTORA' },
          { content: 'MOTORIZADO' },
          { content: 'FISCALIZAÇÃO' },
          { content: 'LOCALIZAÇÃO' },
          { content: 'ARMAS' },
          { content: 'VIATURAS' },
          { content: 'MOTORIZADAS' },
          { content: 'RÁDIOS COMUNICAÇÕES' }
        ]
      ];

      // Corpo da tabela com base no array this.ocorrencias
      const municipiosTabela3 = Array.from(new Set(this.ocorrencias.map((o: any) => o.municipio)));

      const tabela3Body = municipiosTabela3.map((municipio, idx) => {
        const grupo = this.ocorrencias.filter((o: any) => o.municipio === municipio);

        const permanencias = grupo.filter((o: any) => o.local?.toLowerCase().includes('permanência')).length;
        const postosFixos = grupo.filter((o: any) => o.local?.toLowerCase().includes('fixo')).length;

        const patrulhasApeado = grupo.filter((o: any) => o.tipo_local?.toLowerCase().includes('apeado')).length;
        const patrulhasAutomotora = grupo.filter((o: any) => o.tipo_local?.toLowerCase().includes('automotora')).length;
        const patrulhasMotorizado = grupo.filter((o: any) => o.tipo_local?.toLowerCase().includes('motorizado')).length;
        const fiscalizacao = grupo.filter((o: any) => o.tipo_local?.toLowerCase().includes('fiscalização')).length;
        const localizacao = grupo.filter((o: any) => !!o.local).length;

        const totalServicos = permanencias + postosFixos + patrulhasApeado + patrulhasAutomotora + patrulhasMotorizado + fiscalizacao + localizacao;
        const efectivos = grupo.length * 2;
        const armas = grupo.length;
        const viaturas = grupo.filter((o: any) => o.veiculos?.length).length;
        const motorizadas = viaturas;
        const radios = grupo.length > 2 ? 1 : 0;
        const esquadraMovel = grupo.length > 3 ? 1 : 0;
        const totalMeios = armas + viaturas + motorizadas + radios + esquadraMovel;
        const horas = grupo.length * 24;

        return [
          (idx + 1).toString(),
          municipio,
          permanencias.toString(),
          postosFixos.toString(),
          patrulhasApeado.toString(),
          patrulhasAutomotora.toString(),
          patrulhasMotorizado.toString(),
          fiscalizacao.toString(),
          localizacao.toString(),
          totalServicos.toString(),
          efectivos.toString(),
          armas.toString(),
          viaturas.toString(),
          motorizadas.toString(),
          radios.toString(),
          esquadraMovel.toString(),
          totalMeios.toString(),
          horas.toString()
        ];
      });

      // Totais
      const totalLinha = [
        'TOTAL', '',
        ...Array.from({ length: 16 }, (_, i) =>
          tabela3Body.reduce((acc, row) => acc + parseInt(row[i + 2] || '0', 10), 0).toString()
        )
      ];

      tabela3Body.push(totalLinha);

      (doc as any).autoTable({
        startY: startY,
        head: headTabela3,
        body: tabela3Body,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          valign: 'middle',
          halign: 'center',
          textColor: 30,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        columnStyles: {
          1: { cellWidth: 20, halign: 'left', valign: 'middle' },   // Coluna dos ÓRGÃOS
          16: { cellWidth: 20, halign: 'center', valign: 'middle' } // Coluna do TOTAL DE MEIOS
        },
        margin: { left: 8, right: 8 },
      });

      startY = (doc as any).lastAutoTable.finalY + 5;
      /********************************* 3ª Tabela Fim ******************************************************************/

      // Renderizar textoDetalhes4 com mesma formatação das seções anteriores ********************************************
      startY += 10;
      startY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(12);
      const detalhes4Formatado = substituirPlaceholders(textoDetalhes4, ocorrencia);
      const linhas4 = detalhes4Formatado.split('\n');

      for (let linha of linhas4) {
        linha = linha.trim();
        if (!linha) continue;

        const isTitulo = /^[IVXLCDM]+[-\s]/.test(linha) || (linha === linha.toUpperCase() && linha.length < 80);
        const sublinhas = doc.splitTextToSize(linha, pageWidth - 2 * margin);

        for (const sublinha of sublinhas) {
          if (startY + lineHeight > pageHeight - margin) {
            doc.addPage();
            startY = margin;
          }

          const partes = sublinha.split(/(\{.*?\})/);
          let x = margin;
          for (const parte of partes) {
            const isPlaceholder = /^\{.*\}$/.test(parte);
            const textoLimpo = parte.replace(/[\{\}]/g, '');

            doc.setFont('helvetica', isPlaceholder ? 'bold' : isTitulo ? 'bold' : 'normal');
            doc.setFontSize(12);
            const largura = doc.getTextWidth(textoLimpo);
            doc.text(textoLimpo, x, startY, { baseline: 'top' });
            x += largura;
          }
          startY += lineHeight;
        }
      }
      /****************************************************************************************************************/

      // Tabela 4: SERVIÇOS DE REGULARIZAÇÃO DE TRÂNSITO
      startY += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("Tabela nº 4 – SERVIÇOS DE REGULARIZAÇÃO DE TRÂNSITO.", pageWidth / 2, startY, { align: 'center' });
      startY += 5;

      // Cabeçalho da Tabela 4 (3 níveis)
      const headTabela4 = [
        [
          { content: 'Nº', rowSpan: 3, styles: { halign: 'center' } },
          {
            content: 'ÁREAS ADMINISTRATIVAS (POR COMANDOS MUNICIPAIS)',
            rowSpan: 3,
            styles: {
              halign: 'left',
              valign: 'middle',
              fontSize: 7,
              cellPadding: 1.5
            }
          },

          { content: 'SERVIÇOS REALIZADOS', colSpan: 8, styles: { halign: 'center' } },
          { content: 'RESULTADOS', colSpan: 9, styles: { halign: 'center' } },
          { content: 'INFRAÇÕES', colSpan: 3, styles: { halign: 'center' } },
          { content: 'VALORES', rowSpan: 3, styles: { halign: 'center' } },
        ],
        [
          { content: 'POSTOS', colSpan: 2, styles: { halign: 'center', fontSize: 7 } },
          { content: 'PATRULHAMENTO', colSpan: 6, styles: { halign: 'center', fontSize: 7 } },

          { content: 'HORAS CONSUMIDAS', rowSpan: 2, styles: { halign: 'center' } },
          { content: 'APREENSÕES', colSpan: 8, styles: { halign: 'center' } },
          { content: 'OUTROS', rowSpan: 2, styles: { halign: 'center', fontSize: 7 } },

          { content: 'INFRAÇÕES', rowSpan: 2, styles: { halign: 'center', fontSize: 7 } },
          { content: 'PAGAS', rowSpan: 2, styles: { halign: 'center', fontSize: 7 } },
          { content: 'NÃO PAGAS', rowSpan: 2, styles: { halign: 'center', fontSize: 7 } },
        ],
        [
          { content: 'FIXOS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'MÓVEIS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'AUTOMOTORAS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'MOTORIZADAS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'TOTAL DE VIATURAS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'SERVIÇOS EFETIVADOS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'EMPREGO DE EFECTIVOS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'PRESENÇAS', styles: { halign: 'center', fontSize: 7 } },

          { content: 'VIATURAS AUTORIZADAS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'MOTOCICLETAS RETIDAS', styles: { halign: 'center', fontSize: 7 } },
          { content: 'LIVRETE', styles: { halign: 'center', fontSize: 7 } },
          { content: 'TÍTULO DE PROPRIEDADE', styles: { halign: 'center', fontSize: 7 } },
          { content: 'GUÍA DE SUBSTITUIÇÃO', styles: { halign: 'center', fontSize: 7 } },
          { content: 'VERBETE', styles: { halign: 'center', fontSize: 7 } },
          { content: 'FICHA DE REGISTO', styles: { halign: 'center', fontSize: 7 } },
          { content: 'DECLARAÇÃO', styles: { halign: 'center', fontSize: 7 } },
        ]
      ];

      // Corpo da tabela
      const bodyTabela4 = this.ocorrencias.map((ocorrencia: any, index: number) => {
        return [
          index + 1,
          ocorrencia.municipio || 'Desconhecido',
          ocorrencia.fixos || 0,
          ocorrencia.moveis || 0,
          ocorrencia.automotoras || 0,
          ocorrencia.motorizadas || 0,
          ocorrencia.totalViaturas || 0,
          ocorrencia.servicos || 0,
          ocorrencia.efectivos || 0,
          ocorrencia.presencas || 0,

          ocorrencia.horasConsumidas || 0,
          ocorrencia.viaturasAutorizadas || 0,
          ocorrencia.motocicletasRetidas || 0,
          ocorrencia.livrete || 0,
          ocorrencia.tituloPropriedade || 0,
          ocorrencia.guiaSubstituicao || 0,
          ocorrencia.verbete || 0,
          ocorrencia.fichaRegisto || 0,
          ocorrencia.declaracao || 0,
          ocorrencia.outros || 0,

          ocorrencia.infracoes || 0,
          ocorrencia.pagou || 0,
          ocorrencia.naoPagou || 0,
          ocorrencia.valor || 'Akz'
        ];
      });

      // Geração da tabela
      (doc as any).autoTable({
        startY: startY,
        head: headTabela4,
        body: bodyTabela4,
        styles: {
          fontSize: 6.5,
          cellPadding: 1.2,
          valign: 'middle',
          halign: 'center',
          textColor: 30,
          lineColor: [180, 180, 180],
          lineWidth: 0.1
        },
        columnStyles: {
          1: { cellWidth: 20, halign: 'left', valign: 'middle' } // Coluna das ÁREAS ADMINISTRATIVAS
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 6, right: 6 },
      });

      startY = (doc as any).lastAutoTable.finalY + 5;

      /********************************* 4ª Tabela Fim ******************************************************************/

      // Mostrar no modal
      const iframe = document.querySelector("#modalGerarRelarorio iframe") as HTMLIFrameElement;
      if (iframe) iframe.src = doc.output('bloburl').toString();

      // Salvar o PDF
      doc.save('relatorio_ocorrencias.pdf');
    };
  }


}
