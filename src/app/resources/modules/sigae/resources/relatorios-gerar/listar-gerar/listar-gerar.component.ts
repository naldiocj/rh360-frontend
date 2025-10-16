import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaisService } from '@core/services/Pais.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { ArmaService } from '@resources/modules/sigae/core/service/arma.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RelatorioService } from '@resources/modules/sigae/core/service/relatorio.service';
import { AuthService } from '@core/authentication/auth.service';
@Component({
  selector: 'app-listar-gerar',
  templateUrl: './listar-gerar.component.html',
  styleUrls: ['./listar-gerar.component.css'],
})
export class ListarGerarComponent implements OnInit {
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };

  public validar = {
    tipoOgao: true,
    serie: true,
    tipo: true,
    marca: true,
    modelo: true,
    classe: true,
    calibre: true,
    pais: true,
    btn: true,
    ano: true,
    direcao: true,
    quanto: {
      todos: 'all',
      num: ['Nenhum', 'Todos', 5, 15, 25, 35, 45, 50, 65, 75, 85, 95, 100],
    },
  };
  public object: any;
  public serieSelect: Array<Select2OptionData> = [];
  public tipoSelect: Array<Select2OptionData> = [];
  public marcaSelect: Array<Select2OptionData> = [];
  public modeloSelect: Array<Select2OptionData> = [];
  public classeSelect: Array<Select2OptionData> = [];
  public calibreSelect: Array<Select2OptionData> = [];
  public paisSelect: Array<Select2OptionData> = [];
  public btnSelect: Array<Select2OptionData> = [];
  public anoSelect: Array<Select2OptionData> = [];
  public direcaoSelect: Array<Select2OptionData> = [];
  public quantos: Array<Select2OptionData> = [];

  public tipoOrgao: any = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  public datas: any = [];
  public colunaList: any = [];

  public options: any = {
    width: '100%',
    placeholder: 'Selecione uma Opcao',
  };

  public optionsColunas: any = {
    width: '100%',
    placeholder: 'Selecione as colunas que preencheu',
    multiple: true,
  };
  public DataActual: any = this.util.dataActual;
  public isBtn: number = 0;
  public colunas: any = [
    { id: 'classificacao_arma_id', text: 'Classificacao' },
    { id: 'serie', text: 'Serie da Armas' },
    { id: 'tipo_armas_id', text: 'Tipo de Arma' },
    { id: 'marca_arma_id', text: 'Marca da Arma' },
    { id: 'modelo_id', text: 'Modelo da Arma' },
    { id: 'calibre_arma_id', text: 'Calibre da Arma' },
    { id: 'pai_id', text: 'Pais de Origem da Arma' },
    { id: 'ano_fabrico', text: 'Fabrico' },
    // { id: 'livrete', text: 'Livrete da Arma' },
    // { id: 'estado_entrega', text: 'Estado de Entrega' },
    // { id: 'processo', text: 'Processo da Arma' },
    // { id: 'createdAt', text: 'Data de Registro' },
  ];

  public form!: FormGroup;
  protected is!: number;
  constructor(
    private relatorio: RelatorioService,
    private util: UtilService,
    private help: HelpingService,
    private armas: ArmaService,
    private marcas: MarcasArmasService,
    private tipos: TiposArmasService,
    private classes: ClassificacaoArmasService,
    private modelos: ModeloService,
    private Calibre: CalibreService,
    private pais: PaisService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.center();
    this.setClasse();
    this.is = this.help.isUser;
    this.setQuantos();
    console.log(this.isBtn);
  }

  public actualizarPagina() {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  private center() {

    this.setClasse();
    this.setCalibre();
    this.setTipo();
    this.setMarca();
    this.setCalibre();
    //this.setfabrico();
    this.setModelo();
    this.setPais();
    this.setTipo();
    this.setSerie();

    this.form = this.fb.group({
      orgao_id: [' '],
      classe: [' '],
      serie: [' '],
      tipo: [' '],
      marca: [' '],
      modelo: [' '],
      calibre: [' '],
      fabrico: [' '],
      pais: [' '],
      quanto: [' '],
      coluna: [' '],
    });
  }

  public setClasse() {
    this.classes.listar([]).subscribe((res: any) => {
      this.classeSelect = res.map((p: any) => ({ id: p.id, text: p.nome }));
    });
    this.isBtn++;
  }

  public setSerie() {
    this.armas.listar([]).subscribe((res: any) => {
      this.serieSelect = res.map((p: any) => ({ id: p.id, text: p.serie }));
    });
    this.isBtn++;
  }
  public setMarca() {
    this.marcas.listar([]).subscribe((res: any) => {
      this.marcaSelect = res.map((p: any) => ({
        id: p.id,
        text: p.nome,
      }));
    });
    this.isBtn++;
  }
  public setModelo() {
    this.modelos.listar([]).subscribe((res: any) => {
      this.modeloSelect = res.map((p: any) => ({ id: p.id, text: p.nome }));
    });
    this.isBtn++;
  }
  public setTipo() {
    this.tipos.listar([]).subscribe((res: any) => {
      this.tipoSelect = res.map((p: any) => ({ id: p.id, text: p.nome }));
    });
    this.isBtn++;
  }
  public setCalibre() {
    this.Calibre.listar([]).subscribe((res: any) => {
      this.calibreSelect = res.map((p: any) => ({
        id: p.id,
        text: p.nome,
      }));
    });
    this.isBtn++;
  }
  public setfabrico($event: any) {
    if ($event) this.datas.push($event.target.value);
    this.form.value.fabrico = this.datas;
  }

  public setColunas($event: any) {
    if ($event) {
      this.colunaList.push($event);
      this.colunaList.flatMap((arr: any) => arr.map(String));
      this.form.value.coluna = this.colunaList;
    }
  }

  public setPais() {
    this.pais.listar([]).subscribe((res: any) => {
      this.paisSelect = res.map((p: any) => ({ id: p.id, text: p.nome }));
    });
    this.isBtn++;
  }
  public setQuantos() {
    let list: any = this.validar.quanto.num;
    this.quantos = list.map((i: number) => {
      return { id: i, text: i };
    });
    // console.log(this.quantos);
  }
  public gerarRelatorios() {
    if (this.isBtn >= 3) {
      this.setData(this.form.value);
      this.validar.btn = true;
    }
  }

  public setData(formulario: any) {
    
    if (formulario != null) {
      this.relatorio
        .gerarRelatorio({
          classe: formulario?.classe,
          serie: formulario?.serie,
          tipo: formulario?.tipo,
          marca: formulario?.marca,
          modelo: formulario?.modelo,
          calibre: formulario?.calibre,
          pais: formulario?.pais,
          fabrico: formulario?.fabrico,
          quanto: formulario?.quanto,
          coluna: formulario?.coluna,
        })
        .subscribe({
          next: (data) => {
            console.log(data[0]);
            this.pdf(data);
            data.map((res: any) => {
              this.object = res;
              this.recarregar();
            
            });
          },
          error: (er) => {
            console.error(er);
          },
        });
    }
  }

  public recarregar(){
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  public pdf(data: any = null) {
    var doc = new jsPDF('portrait', 'px', [794, 1122]);
    // Define the table body
    doc.text('Relatorio de Armas:' + this.DataActual, 330, 30);

    var ob1: any = [
      'Classificação',
      'Nº da Arma',
      'Serie',
      'Tipo',
      'Marca',
      'Modelo',
      'Calibre',
      'Pais de Origem',
      'Fabrico',
      'Registo',
    ];

    // Create the table
    autoTable(doc, {
      head: [ob1],
      theme: 'grid',
      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
      },
      body: data.map((res: any) => [
        res.classificacao,
        res.livrete,
        res.serie,
        res.tipo_arma,
        res.marca,
        res.modelo,
        res.calibre_arma,
        res.pais,
        res.ano_fabrico,
        res.createdAt,
        // res.categoria, //orga
        // res.descricao,//descricao da arma
        // res.processo,
      ]),
      tableWidth: 'wrap',
      styles: {
        halign: 'center', // alinhamento horizontal padrão para todas as colunas
        fillColor: [245, 245, 245], // cor de fundo padrão para todas as colunas
        textColor: [0, 0, 0], // cor do texto padrão para todas as colunas
        fontStyle: 'normal', // estilo de fonte padrão para todas as colunas
        fontSize: 12, // tamanho da fonte padrão para todas as colunas,
        cellWidth: 80,
        cellPadding: { top: 5 },
      },
      bodyStyles: {
        fillColor: [245, 245, 245], // cor de fundo das células do corpo da tabela
        textColor: [0, 0, 0], // cor do texto das células do corpo da tabela
        fontStyle: 'normal', // estilo de fonte das células do corpo da tabela
        fontSize: 12, // ta
      },
      margin: { left: 0, top: 50 },

      // columns:
    });

    doc.save('relatorio-de-arma-' + this.getRandomData + '.pdf');
  }

  public get getRandomData() {
    var data = new Date();
    var cloneData = null;
    cloneData =
      data.getDate() +
      '-' +
      data.getMinutes() +
      '-' +
      data.getMilliseconds() +
      Math.random();
    return cloneData;
  }
}
