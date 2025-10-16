import { RelatorioService } from './../../core/service/relatorio.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Validators } from 'ngx-editor';
import { ArmaService } from '../../core/service/arma.service';
import { LoteArmasService } from '../../core/lote-armas.service';
import { AtribuicaoArmasService } from '../../core/service/atribuicao-armas.service';
import { EntregadasService } from '../../core/entregadas.service';
import { Select2OptionData } from 'ng-select2';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { AuthService } from '@core/authentication/auth.service';
@Component({
  selector: 'app-relatorios-gerar',
  templateUrl: './relatorios-gerar.component.html',
  styleUrls: ['./relatorios-gerar.component.css'],
})
export class RelatoriosGerarComponent implements OnInit {
  contexto!: any;
  forma!: FormGroup;
  form!: FormGroup;
  relatorios!: FormGroup;
  formEstiva!: FormGroup;
  formAextravio!: FormGroup;
  formMsemanal!: FormGroup;
  content!: string;
  //get value of table
  private totalArmas: number = 0;
  private totalnome: string = 'N/S';
  private DiaSemana: number = 7;
  private totalA: number = 0;
  private totalB: number = 0;
  private totalEntrada: number = 0;
  private totalAtribuidos: number = 0;
  private totalSaida: number = 0;

  //listing
  public armas_nome: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public entidades: Array<Select2OptionData> = [];
  public orgao: Array<Select2OptionData> = [];
  public agentes: Array<Select2OptionData> = [];
  public options: any = {
    width: '100%',
    placeholder: 'selecione uma opção',
  };

  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };

  constructor(
    private mb: FormBuilder,
    private relatorio: RelatorioService,
    private armas: ArmaService,
    private lote_armas: LoteArmasService,
    private armas_atribuidas: AtribuicaoArmasService,
    private entregues: EntregadasService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private trabalhadores: FuncionarioService,
    private agenteOrgaoService: AgenteOrgaoService,
    private toast: IziToastService,
    private users:AuthService
  ) {}
  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
  }
  select(event: any) {
    var marca = event?.target.value;
    this.forma.patchValue({
      marca: marca,
    });
  }
  select1(event: any) {
    var modelo = event?.target.value;
    this.forma.patchValue({
      modelo: modelo,
    });
  }
  mostra() {
    console.table(this.forma.value);
  }
  sub() {
    this.forma = this.mb.group({
      fabrico: ['', Validators.required],
      pais: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
    });

    this.relatorios = this.mb.group({
      relatorio_corpo: ['', Validators.required],
      criador: ['Gerado no sistema'],
      assunto: ['Relatório de Arma'],
      descricao: ['É um relatorio de arma'],
    });
  }
  public op: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '400px',
    minHeight: '600px',
    maxHeight: 'auto',
    width: '100%',
    minWidth: '100%',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Já pode começar a escrever o seu relatório!',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'roboto', name: 'roboto' },
      { class: 'bold', name: 'bold' },
      { class: 'poppins', name: 'poppins' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    //upload: (file: File) => { }
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic', 'normal'], ['fontSize']],
  };
  gerar() {
    var img = '../../../../../../../../assets/img/icons do sigae/icon.png';
    this.contexto = `
<title>_</title>
 

<section>
         <div style='font-style:bold;font-size:18px;font-weight:500;text-align:center;  width:100%; color:black;height:100%;font-family:'poppins''>
                  <img src="${img}" style="backhground:url(${img})" width='100px' height='60px' /><br>
    
                             REPÚBLICA DE ANGOLA<br>
    
                              MINISTÉRIO DO INTERIOR<br>
                             <h4 style="width:100%;font-weight:500;color:black;font-family:'Broadway';height:28px;font-size:28px;">POLÍCIA NACIONAL DE ANGOLA </h4>
                             <h3 style="font-size:30px;font-variant:small-caps;"> DIRECÇÃO DE LOGÍSTICA</h3>
    
      
                               
    
           
   <div style='width:100%;text-align:center;height:100%;display:flex;justify-content:center;font-size:14px;'>
   <h4 style='width:90%;margin-left:auto;margin-right:auto;font-weight:500;text-align:left;text-indent:20px;'>
                 <br>
                 <br>
                 <br>
                 <br>
                 <br>
    ${this.relatorios.value.relatorio_corpo}

  </h4>
     </div>
    </div>
                              
  <div style='font-style:bold;font-weight:600;text-align:center; font-size:15px; width:100%; height:100%;margin-top:99%'>
 'PELA ORDEM E PELA PAZ AO SERVIÇO DA NAÇÃO'<br>
    
                              Melhores Cumprimentos
                              Em Luanda, <span id='dia'></span>
    
    
   </div>
    
    
  <script>
    
    var  a=new Date();
    var total=['seg','ter','quar','quin' ,'sex','sab','dom'];
    var Mestotal=['jan','fev','mar','abr' ,'maio','jun','jul' ,'ago','set','out' ,'nov','dez'];
       var dia =a.getDay()-1;
    
    
       document.querySelector('#dia').innerHTML=total[dia] +' '+Mestotal[a.getMonth()] +' '+ a.getFullYear();
   </script>
      </section>
`;

    this.imprimir(this.contexto);
  }
  public startForms() {
    this.formEstiva = this.mb.group({
      num_estiva: [''],
      num_doc: [''],
      num_armazen: [''],
      num_seccao: [''],
      num_artigo: [''],
      referencias: [''],
      nome_elaborador: [''],
    });

    this.formAextravio = this.mb.group({
      arma_id: [''],
      tipo_arma: [''],
      comando_actual: [''],
      local_comando: [''],
      designacao: [''],
      quant: [''],
      aproveitamento: [''],
      descricao: [''],
      elaborador: [''],
    });

    this.formMsemanal = this.mb.group({
      num_ficha: [''],
      num_completo: [''],
      patente: [''],
      num_nip: [''],
      funcao: [''],
      orgao: [''],
      aproveitamento: [''],
      descricao: [''],
      elaborador: [''],
    });
  }
  public subStart() {
    //   this.armas.listar(this.filtro).subscribe(()=>{})

    this.armas.listar(this.filtro).subscribe((e: any) => {
      var item = e.filter((gun: any) => gun);
      this.totalArmas = item.length;
    });
    this.entregues.listar(this.filtro).subscribe((e: any) => {
      var item = e.filter((gun: any) => gun);
      this.totalA = item.length;
    });
    this.armas_atribuidas.listar(this.filtro).subscribe((e: any) => {
      var item = e.filter((gun: any) => gun);
      this.totalA = item.length;
    });

    this.totalSaida = this.totalA + this.totalB;

    this.armas.listar(this.filtro).subscribe((e: any) => {
      var item = e.filter((gun: any) => gun);
      this.totalnome = item.marca + '-' + item.tipo;
    });

    this.armas_atribuidas.listar(this.filtro).subscribe((e: any) => {
      var item = e.filter((gun: any) => gun.id);
      this.totalAtribuidos = item.length;
    });
  }
  private buscarArma() {
    this.armas.listar(this.filtro).subscribe({
      next: (res) => {
        this.armas_nome = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }
  public gerarAutoEstravio() {
    var DocAutoEstravio: any = `<!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Auto de Extravio</title>
        <style>
        body {
      font-family: Calibri, sans-serif;
      margin: 0;
      padding: 0;
    }
    
    .document {
      padding: 20px;
    }
    
    .title {
      font-size: 18px;
      text-align: center;
    }
    
    .subtitle {
      font-size: 16px;
      text-align: center;
    }
    
    .department {
      font-size: 24px;
      font-family: "Bodoni MT Black", serif;
      text-align: center;
    }
    
    .subdepartment {
      font-size: 18px;
      text-align: center;
      text-decoration: underline;
    }
    
    .center-aligned {
      text-align: center;
    }
    
    .empty-line {
      margin-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    table th,
    table td {
      border: 1px solid black;
      padding: 5px;
      text-align: left;
    }
    
    table thead th {
      font-weight: bold;
    }
    
    .signatures {
      text-align: center;
    </style>
    </head>
    <body>
      <div class="document">
        <header>
          <h1 class="title">REPÚBLICA DE ANGOLA</h1>
          <h2 class="subtitle">MINISTÉRIO DO INTERIOR</h2>
          <hr>
          <h3 class="department">POLÍCIA NACIONAL DE ANGOLA</h3>
          <h4 class="subdepartment"><u>DIRECÇÃO DE LOGÍSTICA</u></h4>
        </header>
        <p class="empty-line">&nbsp;</p>
        <p class="center-aligned"><u>AUTO DE EXTRAVIO</u></p>
        <p class="empty-line">&nbsp;</p>
        <p>Aos ___ dias , do mês de ________________ do ano de 20______, neste(a) Comando(Direcção) _________________________, Reuniu-se a Comissão de H-DOC, a fim do extravio de artigos de armamento, do Comando (Orgão)______________, tendo a comissão a tratar por conseguinte que foi extraviado o seguinte:</p>
        <p class="empty-line">&nbsp;</p>
        <table class="extraviation-table">
          <thead>
            <tr>
              <th>N/O</th>
              <th>Designação</th>
              <th>Qtd</th>
              <th>Causas</th>
              <th>Parte Aproveitamento</th>
              <th>Unitário</th>
              <th>OBS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
        <p class="empty-line">&nbsp;</p>
        <p>Não houve mais nada a tratar, a Comissão deu por fim aos trabalhos que eu informatizei _______________________________________, e assim com os demais membros da Comissão </p>
        <p class="empty-line">&nbsp;</p>
        <p class="signatures">
          <b>_________________________ _________________________ _________________________</b><br>
          <b>_________________________ _________________________ _________________________</b>
        </p>
        <p class="empty-line">&nbsp;</p>
        <p><b><span>Informa o de Secção de MGA.</span></b></p>
        <p>- Conferente a informa o , tudo baseia-se no prescrito já informado, tudo depende solução de Sua Excelência.</p>
        <p class="empty-line">&nbsp;</p>
        <p><b>O CHEFE DE SECÇÃO</b></p>
        <p>______/________/20____ __________________</p>
      </div>
    </body>
    </html>
    `;
    this.imprimir(DocAutoEstravio);
  }
  public gerarEstiva() {
    var DocEstiva: any = `<!DOCTYPE html>
    <html lang="PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ficha de Estiva</title>
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
    
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
            }
    
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
    
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
    
            h1, h2 {
                text-align: center;
            }
    
            p {
                text-align: center;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>REPÚBLICA DE ANGOLA</h1>
        <h2>MINISTÉRIO DO INTERIOR</h2>
        <p>***</p>
        <h2>POLÍCIA NACIONAL</h2>
        <h2 style="text-decoration: underline;">DIRECÇÃO NACIONAL DE LOGÍSTICA</h2>
        <h2 style="text-decoration: underline;">BASE CENTRAL DE ABASTECIMENTO</h2>
        <h2>FICHA DE ESTIVA</h2>
        <p>ESTIVA Nº: ___________________</p>
        <table>
            <thead>
                <tr>
                    <th>N/O</th>
                    <th colspan="3">DATA</th>
                    <th>Nº DOC</th>
                    <th>EXIS. ANT.</th>
                    <th>ENTRADA</th>
                    <th>TOTAL</th>
                    <th>SAIDA</th>
                    <th>SALDO</th>
                    <th>BENEFÍARIO</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01</td>
                    <td>D</td>
                    <td>M</td>
                    <td>A</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `;
    this.imprimir(DocEstiva);
  }
  public gerarControloMaterial() {
    var DocControMaterial: any = `<html>

    <head>
    <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
    <meta name=Generator content="Microsoft Word 15 (filtered)">
    <style>
    <!--
     /* Font Definitions */
     @font-face
      {font-family:"Cambria Math";
      panose-1:2 4 5 3 5 4 6 3 2 4;}
    @font-face
      {font-family:Calibri;
      panose-1:2 15 5 2 2 2 4 3 2 4;}
    @font-face
      {font-family:"Bodoni MT Black";
      panose-1:2 7 10 3 8 6 6 2 2 3;}
    @font-face
      {font-family:Bahnschrift;
      panose-1:2 11 5 2 4 2 4 2 2 3;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
      {margin-top:0cm;
      margin-right:0cm;
      margin-bottom:6.0pt;
      margin-left:0cm;
      line-height:110%;
      font-size:10.0pt;
      font-family:"Calibri",sans-serif;}
    .MsoChpDefault
      {font-family:"Calibri",sans-serif;}
    .MsoPapDefault
      {margin-bottom:8.0pt;
      line-height:107%;}
    @page WordSection1
      {size:595.3pt 841.9pt;
      margin:70.85pt 3.0cm 70.85pt 3.0cm;}
    div.WordSection1
      {page:WordSection1;}
    -->
    </style>
    
    </head>
    
    <body lang=PT style='word-wrap:break-word'>
    
    <div class=WordSection1>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:normal'><b><span style='font-size:13.0pt'>REPÚBLICA DE ANGOLA</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:normal'><b><span style='font-size:13.0pt'>MINISTÉRIO DO INTERIOR</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:normal'>&nbsp;</p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:normal'><b><span style='font-size:20.0pt;font-family:"Bodoni MT Black",serif'>POLÍCIA
    NACIONAL DE ANGOLA</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:normal'><u><span style='font-size:18.0pt'>DIRECÇÃO DA LOGÍSTICA </span></u></p>
    
    <p class=MsoNormal align=center style='text-align:center'><u><span
    style='font-size:12.0pt;line-height:110%;font-family:"Bahnschrift",sans-serif'>DEPARTAMENTO
    DE MATERIAL DE GUERRA E EQUIPAMENTO</span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>FICHA Nº   ________                                               
                     VISTO</span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>                                                                                     O
    CHEFE DO ORG O</span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>                                                                                  
    _____________________________</span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>                                                                                  
    ______________________________  </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>FICHA DE CONTROLO DE
    MATERIAL DE GUERRA E EQUIPAMENTO</span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>Nome e Apelido ________________________________________________________________
    </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>Patente
    ________________________________________________________________________ </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>NIP/Agente
    ____________________________________________________________________ </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>Função:
    ________________________________________________________________________ </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'>Orgão:
    __________________________________________________________________________ </span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal style='margin-bottom:0cm'><u><span style='font-size:12.0pt;
    line-height:110%;font-family:"Bahnschrift",sans-serif'><span style='text-decoration:
     none'>&nbsp;</span></span></u></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:150%'><b><u><span style='font-size:13.0pt;line-height:150%;
    font-family:"Bahnschrift",sans-serif'>MEIOS ENTREGUES </span></u></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><u><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>TIPO/ARMA 
       MARCA    MODELO    NÚMERO     CALIBRE     QUANT./MUNIÇÕES</span></u></p>
    
    <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
     style='border-collapse:collapse;border:none'>
     <tr style='height:23.85pt'>
      <td width=113 colspan=3 valign=top style='width:84.8pt;border:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:23.85pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%'>DATA</span></b></p>
      </td>
      <td width=254 valign=top style='width:190.4pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt;height:23.85pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><i><span style='font-size:12.0pt;line-height:150%'>DESIGNAÇÃO</span></i></b></p>
      </td>
      <td width=130 valign=top style='width:97.15pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt;height:23.85pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><i><span
      style='font-size:12.0pt;line-height:150%'>QUANTIDADE</span></i></b></p>
      </td>
      <td width=70 valign=top style='width:52.35pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt;height:23.85pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><i><span
      style='font-size:12.0pt;line-height:150%'>OBS</span></i></b></p>
      </td>
     </tr>
     <tr style='height:24.7pt'>
      <td width=37 valign=top style='width:28.1pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>D</span></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>M</span></i></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>A</span></i></p>
      </td>
      <td width=254 valign=top style='width:190.4pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=130 valign=top style='width:97.15pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=70 valign=top style='width:52.35pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:24.7pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
     </tr>
     <tr style='height:3.5pt'>
      <td width=37 valign=top style='width:28.1pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=254 valign=top style='width:190.4pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=130 valign=top style='width:97.15pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
      <td width=70 valign=top style='width:52.35pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt;height:3.5pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><i><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></i></p>
      </td>
     </tr>
    </table>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>Luanda
    aos _______/de ____________/20___,</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>          
    ENTREGUEI                                                                         RECEBI</span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>__________________________                                                 
    ______________________ </span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>__________________________                                             
        ______________________ </span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;font-family:
    "Bahnschrift",sans-serif'>ESPÓPLIO DE MEIOS</span></b></p>
    
    <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 width=690
     style='width:517.45pt;margin-left:4.25pt;border-collapse:collapse;
     border:none'>
     <tr>
      <td width=690 colspan=2 valign=top style='width:517.45pt;border:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>  MOTIVOS DE ESPÓLIOS</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>REFORMA</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>DEMISÃO</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>INCAPACIDADE
      FISICA</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>LICENÇA
      REG. OU ELIMITADA</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>TRANSFERENCIA</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=577 valign=top style='width:432.4pt;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
      style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>FALECIMENTO</span></b></p>
      </td>
      <td width=113 valign=top style='width:3.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
    </table>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;font-family:
    "Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 width=690
     style='width:517.45pt;margin-left:4.25pt;border-collapse:collapse;
     border:none'>
     <tr>
      <td width=113 colspan=3 valign=top style='width:85.1pt;border:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>DATA</span></b></p>
      </td>
      <td width=331 valign=top style='width:248.35pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>DESIGNA  O DOS MEIOS</span></b></p>
      </td>
      <td width=58 valign=top style='width:43.55pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>Nº  DA ARMA</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.25pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>QTD</span></b></p>
      </td>
      <td width=140 colspan=3 valign=top style='width:105.2pt;border:solid windowtext 1.0pt;
      border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>ESCT.TECNICO</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=38 valign=top style='width:1.0cm;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>D</span></b></p>
      </td>
      <td width=38 valign=top style='width:28.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>M</span></b></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>A</span></b></p>
      </td>
      <td width=331 valign=top style='width:248.35pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=58 valign=top style='width:43.55pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.25pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.05pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=46 valign=top style='width:34.75pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=38 valign=top style='width:1.0cm;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=38 valign=top style='width:28.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=331 valign=top style='width:248.35pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=58 valign=top style='width:43.55pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.25pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.05pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=46 valign=top style='width:34.75pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
     <tr>
      <td width=38 valign=top style='width:1.0cm;border:solid windowtext 1.0pt;
      border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=38 valign=top style='width:28.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=38 valign=top style='width:1.0cm;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=331 valign=top style='width:248.35pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=58 valign=top style='width:43.55pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.25pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.4pt;border-top:none;border-left:none;
      border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=47 valign=top style='width:35.05pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
      <td width=46 valign=top style='width:34.75pt;border-top:none;border-left:
      none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
      padding:0cm 5.4pt 0cm 5.4pt'>
      <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
      line-height:150%'><b><span style='font-size:12.0pt;line-height:150%;
      font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
      </td>
     </tr>
    </table>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:150%'><b><span
    style='font-size:12.0pt;line-height:150%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>ASSINATURA
    GRAU  PARENTESTO _____________________________________________ </span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>ASSINATURA
    DA COMIISSÃO </span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    DIR.LOG __________________________________________________________________ </span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    INSPEC  O______________________________________________________________</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    SA DE ___________________________________________________________________</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    EDUCA  O PATRIÓTICA__________________________________________________</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    DIR.FINAN AS____________________________________________________________</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>PELA
    DIR.DPQ__________________________________________________________________</span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>OBS:INFORMAÇÃO
    SOBRE O ESTADO TECNICO DA ARMA<b> : _____________________ </b></span></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>__________________________________________________________________________________________________________________________________________________________________
    </span></b></p>
    
    <p class=MsoNormal style='margin-bottom:0cm;line-height:115%'><b><span
    style='font-size:12.0pt;line-height:115%;font-family:"Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'> PELA ORDEM E PELA PAZ AO SERVI O DA NA  O  </span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:12.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>DEPARTAMENTO De MAT RIAL DE GUERRA E AQUARTELAMENTO 
    /DL/PNA/ ,Em</span></b><b><span style='font-size:13.0pt;line-height:115%;
    font-family:"Bahnschrift",sans-serif'> </span></b><b><span style='font-size:
    13.0pt;line-height:115%'>Luanda</span></b><b><span style='font-size:13.0pt;
    line-height:115%;font-family:"Bahnschrift",sans-serif'>  aos _______/de
    ______________/ 2023.  </span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>&nbsp;</span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>O CHEFE DO ARMAZ N </span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>_______________________________________ </span></b></p>
    
    <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;
    line-height:115%'><b><span style='font-size:13.0pt;line-height:115%;font-family:
    "Bahnschrift",sans-serif'>___________________________ </span></b></p>
    
    </div>
    
    </body>
    
    </html>
    `;
    this.imprimir(DocControMaterial);
  }
  public gerarMovimentoSemanal() {
    var DocMovimentoSemanal: any = `<!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8">
      <title>Police Report - Material Control Department</title>
      <style>
        /* Font definitions can be removed as they are inline styles  */
    
        /* Table styles */
        table {
          border-collapse: collapse; /* Ensures borders collapse into single border */
          width: 100%; /* Set the table width */
          margin-left: 6.95pt; /* Set the left margin */
        }
        th, td {
          border: 1px solid black; /* Set border for all cells */
          padding: 0.5cm; /* Set cell padding */
          text-align: center; /* Center align content by default */
        }
        th {
          font-weight: bold; /* Make headers bold */
        }
      </style>
    </head>
    <body lang="pt">
      <div class="WordSection1">
        <p class="MsoNormal" style="text-align: center;">
          <b><span style="font-size: 13.0pt;">REPÚBLICA DE ANGOLA</span></b>
        </p>
        <p class="MsoNormal" style="text-align: center;">
          <b><span style="font-size: 13.0pt;">MINISTÉRIO DO INTERIOR</span></b>
        </p>
        <p class="MsoNormal" style="text-align: center;">&nbsp;</p>
        <p class="MsoNormal" style="text-align: center;">
          <b><span style="font-size: 20.0pt; font-family: &quot;Bodoni MT Black&quot;, serif;">POLÍCIA NACIONAL DE ANGOLA</span></b>
        </p>
        <p class="MsoNormal" style="text-align: center;">
          <u><span style="font-size: 18.0pt;">DIRECÇÃO DE LOGÍSTICA </span></u>
        </p>
        <p class="MsoNormal" style="text-align: center;">
          <u><span style="font-size: 15.0pt;">SECÇÃO DE ARMAMENTO DE MUNIÇÕES EQUIPAMENTO</span></u>
        </p>
        <p class="MsoNormal" style="text-align: center;"><b><span style="font-size: 14.0pt;"> </span></b></p>
        <p class="MsoNormal" style="text-align: center;"><b><span style="font-size: 14.0pt; line-height: 110%;">INFORME DE MOVIMENTOS DE EXISTÊNCIA SEMANAL </span></b></p>
        <p class="MsoNormal" style="text-align: center;"><b><span style="font-size: 14.0pt; line-height: 110%">&nbsp;</span></b></p>
        <table>
          <thead>
            <tr>
              <th width="101">N/O</th>
              <th width="239">DESIGNAÇÃO DE MEIOS</th>
              <th width="48">U/M</th>
              <th width="95">
                EXIST.<br>
                ANTERIOR
              </th>
              <th width="84">
                AUME.<br>
                CARGA
              </th>
              <th width="66">SAIDA</th>
              <th width="85">
                EXIST.<br>
                ACTUAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr>
            </tbody>
        </table>
        <p class="MsoNormal" style="text-align: center;"><b><span style="font-size: 14.0pt; line-height: 110%">&nbsp;</span></b></p>
      </div>
    </body>
    </html
    `;
    this.imprimir(DocMovimentoSemanal);
  }


  /*
guardar_estiva(){}
guardar_autoEstiva(){}
guardar_contrloMaterial(){}
guardar_movimentoSemanl(){}
guardar_

*/

  public imprimir(data: any) {
    var conteudo: any = document.querySelector('body');
    var vazio = conteudo.innerHTML;
    setTimeout(() => {
      document.write(data);
      window.print();
      window.close();
    }, 2000);
  }
  public guardar() {
    this.relatorio.registar(this.relatorios.value).subscribe((e) => null);
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }
  selecionarAgente(event: any) {
    this.agenteOrgaoService.verAgenteOrgao(event).subscribe({
      next: (res: any) => {
        this.agentes = res.map((p: any) => ({
          id: p.id,
          text: p.nome_completo,
        }));
      },
    });
  }

  public guardar_estiva() {
    //this.relatorio.registar(this.formEstiva.value).subscribe((e) => null);
    console.log(this.formEstiva.value);
  }
  public guardar_autoEstiva() {
    //this.relatorio.registar(this.formAextravio.value).subscribe((e) => null);
    console.log(this.formAextravio.value);
  }
  public guardar_contrloMaterial() {
    //this.relatorio.registar(this.relatorios.value).subscribe((e) => null);
    console.log(this.relatorios.value);
  }
  public guardar_movimentoSemanl() {
    //this.relatorio.registar(this.formMsemanal.value).subscribe((e) => null);
    console.log(this.formMsemanal.value);
  }

  public get curtido() {
    return 'Cadastrado com sucesso!';
  }
}
