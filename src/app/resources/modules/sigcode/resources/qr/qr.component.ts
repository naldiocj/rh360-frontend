import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { QrService } from '../../core/service/qr.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { SafeUrl } from '@angular/platform-browser';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { EncriptarFraseService } from '../../core/service/encriptar-frase.service';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css'],
})
export class QrComponent implements OnInit {
  public img: any;
  public img_caminho: any;
  public pesquisar: any;
  public orgao: Array<Select2OptionData> = [];
  public direcao: Array<Select2OptionData> = [];
  public formQr!: FormGroup;
  public pegarQr: any;
  public valor: any;
  public options = {
    placeholder: 'seleccione uma opçao',
    width: '100%',
  };
  public objects: any;
  public data: Array<Select2OptionData> = [];
  public typeCartao: Array<Select2OptionData> = [
    { id: '', text: '--Selecione uma opçao--' },
    { id: 'Interno', text: 'Interno' },
    { id: 'Profissional', text: 'Profissional' },
  ];
  public fotoGerada: boolean = false;
  public direcoes: Array<Select2OptionData> = [
    { id: '', text: '--Selecione uma opçao--' },
    { id: 'Orgao', text: 'Orgao Central' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
  ];
  public Iagente: any;
  public stateTipo!: string;
  constructor(
    private fb: FormBuilder,
    private fotoservice: FicheiroService,
    private agentes: AgentesService,
    private orgaoservice: DirecaoService,
    private qrcodeservice: QrService,
    private toast: IziToastService,
    private enc: EncriptarFraseService
  ) {}
  ngOnInit(): void {
    this.forms();
  }

  public forms(): void {
    this.formQr = this.fb.group({
      orgao_id: [''],
      pessoa_id: [''],
      tipoPaase: [''],
      qr_codes: [''],
    });
    this.img = 'Bem vindo ao Sigcod';
  }

  public start() {
    var time: any = new Date();
    time = time.getHours();
    console.log(this.valor);
    if (this.valor != null) {
      //pdfContent= this.fotoservice.gerarPdfContent(this.stateTipo);
      this.printar(this.stateTipo);
      //    this.submit();
    } else {
      this.toast.alerta('Preencha o formulário para gerar passe!');
    }
  }

  public getQr(event: SafeUrl) {
    console.log(this.valor);
    this.pegarQr = event;
    console.log(this.pegarQr);
    this.formQr.value.qr_codes = event;
  }

  public fotoProcesso(): void {
    if (this.valor != null) {
      // this.alertas.done();
      this.img =
        'titulo:' +
        'PNA' +
        '-' +
        'Nome_Completo:' +
        this.valor?.nome +
        '-' +
        'Função_do_Agente:' +
        this.valor?.funcao +
        '-' +
        'patente_do_Agente:' +
        this.valor?.patente +
        '-' +
        'Locação:' +
        this.valor?.sigla +
        '-' +
        'Nº Nip:' +
        this.valor?.nip;
      this.fotoGerada = true;
    }
  }

  public incriptar() {}
  public EscTipo($event: any) {
    this.formQr.value.tipoPaase = $event;
    this.img_caminho = this.verFoto(this.objects?.foto_efectivo);
    this.img =
      'PNA' +
      '-' +
      +this.objects.nome +
      '-' +
      this.objects.apelido +
      '-' +
      this.objects?.orgao +
      '-' +
      this.objects?.sigla +
      '-' +
      this.objects?.patente +
      '-' +
      this.objects?.funcao +
      '-' +
      this.objects?.nip;
    var textCod = this.enc.CodificarTexto(this.img);
    this.img = textCod;
    console.log(this.img);
    console.log(this.objects);
    if ($event == 'Interno') {
      this.stateTipo = `<style>
      :root{
  --primary-color:#041b43;
  --opacidade-color: rgba(255, 255, 255, 0.1);
      }
      .coluna {
        height: 650px;
        min-height:620px;
        min-width:420px;
    margin-left:5%;
    margin-left:3%;
        border-radius: 5px;
      }

      *{
        font-family:arial;
      }

      .sidebar,.header{
        width:0px;
      }

  .view{
        gap:30px;
        height: 100%;
        width:100%;
       }
@media print{
   .view{
    margin-left24%;
   }
}

      .section_menu{
         display: grid;
          justify-content: center;
          align-items: center;
      }

      button:active{
         display: none;
      }

      .btn-left {
        margin-left: 2.1%;
        margin-top: 20px;
        padding-top: 15px;
        text-align: center;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        font-family: arial;
        height: 50px;
        border-radius: 5px;
        width: 350px;
      }

      .primary {
        background-color: var(--primary-color);
      }

      ol{
         list-style: none;
         align-items: left;
         font-weight: 700;
         font-size: 18px;
         text-align: left;
         margin-top:-15px;
      }

      ol li{
         margin-top: 3px;
      }

      .text-2 {
        width: 60%;
        word-spacing: 2px;
        font-size: 14px;
        text-align: left;
        text-indent: 10px;
        align-items: center;
        padding-top: -3%;
      }


      div .mts{
            margin-top:-0%;
      }
      .text-t-s {
        margin-top: 1%;
        margin-left: 4%;
      }

      .foto {
        margin-top:-3%;
        width: 100%;
        display: flex;
        justify-content: center;


      }

.front{
  background-image:url('./../../../../../../assets/sigcod/back.jpeg');
  height:auto;
    background-position:center;
    background-size:99.9% 99.9%;
  background-repeat: no-repeat;
}

.back{
  background-image:url('./../../../../../../assets/sigcod/front.jpeg');
  height:auto;
    background-position:center;
    background-size:99.9% 99.9%;
  background-repeat: no-repeat;
}
@media print{
  .front{
    background-image:url('./../../../../../../assets/sigcod/back.jpeg');
    height:auto;
    background-size:99.5% 99.5%;
    background-position:center;

    background-repeat: no-repeat;
  }

  .back{
    background-image:url('./../../../../../../assets/sigcod/front.jpeg');
    height:auto;
    background-size:99.5% 99.5%;
    background-position:center;
    background-repeat: no-repeat;
  }


}
.text-1-t {
        font-weight: 600 !important;

      }


      .text-1-t-t {
        font-weight: 600 !important;
      }

      .text-1-b {
        font-weight: 700 !important;
        font-size: 14px;
      }


      .text-b {
        font-weight: 600 !important;
        font-size: 14px;
      }

      </style>
      <div class="section_main" id="gerardocumento2" style="display:flex;margin-left:-37%;margin-top:9%;width:100%;">
      <div class="w-100">
        <h4 class="col text-dark fs-2 fw-semibold fw-medium text-t-s">
        </h4>
      </div>
      <div class="row-10  gap-lg-5 view" id="imprimir" style="display:flex;width:auto;">

      <div class="col-4 bg-light coluna shadow front">
        <div style="display:grid">
          <span style="width:100%; display:flex; justify-content:center; align-content:center;" style="margin-top: 3%;">
            <img src=" ./../../../../../../assets/logopolice.png" alt="icon" height="60" width="60">
          </span>
          <div style="align-text:center; width:100%;color:white;text-align: center;margin-top: 5px;">
            <h3 class="fw-bold" style="font-size: 13px;text-align: center;">DIRECÇÃO DE <br/> TELECOMUNIÇÕES E <br/>
              TECNOLOGIAS DE INFORMAÇÃO </h3>
           </div>


          <br>
          <div class="texts text-center">
           <div class="qr_code" style="display:flex;justify-content:center;align-item:center;">

           <div class="fs-5 fw-bold primary rounded-3"
           style="height:200px;width:60%;background-color:navy;background-image:url(${this.img_caminho});background-repeat:no-repeat;background-position:center;">
           </div>

       </div>
      </div>
      <br>
          </div>
          <div class="info" style="margin-top:-5px;">
          <span>
          <h2 class="text-center text-dark" style="font-family:arial;text-align:center;">
          ${this.objects?.nome}
          </h2>
        </span>
            <ol>
              <li>Patente:${this.objects?.patente} </li>
              <li>Função:${this.objects?.funcao} </li>
              <li>Colocação: ${this.objects?.sigla} </li>
              <li>Nip nº:0${this.objects?.nip} </li>
            </ol>
        </div>
      </div>

        <div class="col-4 bg-light shadow back coluna" style="height:100hv;">
          <div style="display:grid">
            <span style="width:100%;display:flex; justify-content:center; align-content:center;" style="margin-top: 2%;">
              <img src=" ./../../../../../../assets/logopolice.png" alt="icon" height="60" width="60">
            </span>
            <div style="align-text:center;width:100%;color:white;text-align: center;margin-top: 5px;">
              <h3 class="fw-bold" style="font-size: 13px;text-align: center;">DIRECÇÃO DE TELECOMUNIÇÕES E <br/>
                TECNOLOGIAS DE INFORMAÇÃO </h3>

             </div>


            <br>
            <div class="texts text-center" style="margin-top:2%!important;height:100%;">
              <h4  style="text-align:center;color:black;margin-top:15px;font-weight:700" title="texto principal">Prerrogativas</h4>
             <div style="text-align:center; width:100%; margin-left:19.9%;text-align:center;" >
                <h3 class="text-2">Este documento tem por finalidade ,indetificar o portador na sua qualidade de Membro da
                policia Nacional e de Agente de Autoridade nos termos da lei e ,é de uso exclusivo da Direcçao de
                Telecomunicaçoes e Tecnologia de Informaçao. <br> </h3>
 
             </div>
              <div class="qr_code" style="display:flex;justify-content:center;align-item:center;height:100%;">

                <h4 class="fs-5 fw-bold  primary rounded-3"
                  style="height:130px;width:140px;margin-bottom:5%;margin-left:-3%!important;background-color:navy;"> 
                  <img src="${this.pegarQr.changingThisBreaksApplicationSecurity}" height="100%" width="100%" alt="qrcode do agente ${this.objects.nome}" > </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    <br>
    </div>
    `;
    } else {
      this.stateTipo = `<style>
      :root{

--primary-color:#041b43;
--opacidade-color: rgba(255, 255, 255, 0.1);
      }
      *{
        font-family:arial;
      }

      .bg{
  background:#041b43;
      }

      .row-12 {
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
      }

      .row-12 > * {
        padding-right: 15px;
        padding-left: 15px;
        flex-shrink: 0;
        width: 100%;
        max-width: 100%;
      }


        .section_main {
          width: 100%;
          display: grid;
        }

        .template{
          display:flex;
          width:100%;
          margin-left:24%;
        }

        .lista{
          width:50%;margin-top:51%;margin-left:-5%;
        }

        .view {
          gap: 1rem;
          row-gap: 2rem;
        }

        .coluna {
          background-color: #f8f9fa;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.13);
          padding: 1rem;
          min-width:850px;
          min-height:200px!important;
          margin-top:5%;
          margin-left:50%;
        }

        .doc{
          width:51.5%;
          font-size:15px;
        }
        .lay-doc{
          align-text:center; 
          width:100%;
          margin-left:25.5%;
          font-weight: 600;
        }

        @media print{
          .coluna {
            background-color: #f8f9fa;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.13);
            padding: 1rem;
            width:90%;
            height:200px;
            margin-top:5%;
          }

          .template{
              margin-left:0%;
          }
          .doc{
              width:90%;
              height:100px;
              font-size:12px;
          }

          .lista{
             margin-top:40%;
             font-size:12px;
          }

          .lay-doc{
          margin-left:10%;
          }

        }

        .coluna .d-flex.justify-content-center {
          height: 70px;
          background-color: var(--primary-color);
          align-items: center;
        }

        .coluna .col-6.w-50 {
          margin-top: 25%;
        }

        .coluna .info h2 {
          color: var(--primary-color);
          font-weight: 600;
          font-family: Arial;
        }

      /* Importe suas variáveis CSS aqui */

      .section_main {
        width: 100%;
        display: grid;
      }

      .w-100 {
        width: 100%;
      }

      .col {
        display: flex;
        flex-direction: column;
      }

      .text-dark {
        color: #343a40;
      }

      .fs-2 {
        font-size: 1.5rem;
      }

      .fw-semibold {
        font-weight: 600;
      }

      .fw-medium {
        font-weight: 500;
      }

      .text-t-s {
        text-align: start;
      }

      .row-12 {
        grid-row: 1 / span 12;
      }

      .gap-lg-1 {
        gap: 1rem;
      }

      .view {
        gap: 1rem;
        row-gap: 2rem;
      }



      .texts {
        text-align: center;
      }

      .text-1-t {
        text-align: start;
      }

      .text-1-b {
        text-align: start;
      }

      .text-b {
  margin-top:-10px;
      }

      .fw-bolder {
        font-weight: 700;
      }



      .foto {
        height: 250px;
        width: 65%;
        margin: 0 auto;
      }

      .fs-4 {
        font-size: 1.25rem;
      }

      .primary {
        color: var(--primary-color);
      }

      .rounded-0 {
        border-radius: 0;
      }

      .info {
        margin-left: -8%;
      }

      .d-grid {
        display: grid;
      }

      .text-2 {
        font-size: 1.25rem;
      }

      .fw-light {
        font-weight: 300;
      }

      .mt-4 {
        margin-top: 1rem;
      }

      .rounded-3 {
        border-radius: 0.25rem;
      }

      .btn-left {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
      }

      .invisible {
        visibility: hidden;
      }


      </style>



<div class="d-grid section_main template" id="gerardocumento1" background="C:/Users/HP/Pictures/1.png">
<div class="view">
<div class="col-10 bg-light coluna shadow mt-4">
  <div style="display:flex; width:100%">
    <div style="display:flex;text-align:center; margin-top:-21%;margin-left:1%;">
      <div class="texts col-6 w-50 text-center" style="display:grid;gap-row:20px;">
        <span style="width:100%; display:flex;padding:0px;margin:0px; justify-content:center; align-content:center;margin-top:9.9%;">
          <img src="./../../../../../../assets/logopolice.png" alt="icon" height="60" width="60">
        </span>
        <div style="text-align:center;height:150pxx">
          <h4 class="text-1-t text-b text-center w-light text-dark" style="text-align:center; font-size:14px;;margin-top:9px" title="texto principal">REPÚBLICA DE ANGOLA</h4>
          <h4 class="text-1-t text-b text-center fw-light text-dark" style="text-align:center; font-size:14px;" title="texto principal">MINISTÉRIO DE INTERIOR</h4>
          <h4 class="text-1-b text-center fw-bolder text-dark" style="text-align:center;margin-top:-15px;font-size:14px;" title="texto principal">COMANDO GERAL DA POLÍCIA NACIONAL</h4>
        </div>
        <div class="texts text-center">
          <div class="qr_code" style="display:flex;margin-top:-4%;justify-content:center;width:99.9%">
            <div class="fs-5 fw-bold primary rounded-3 mt-xl-2 mt-lg-2 mt-sm-2" style="height:200px;width:199;background-color:navy;"></div>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
      <div class="lista">
        <ol style="list-style-type: none;text-align:left;margin-left:4%;font-weight:700;font-size:18px;">
          <li>
            <h2 style="align-text:center; color:dark" style="font-family:arial;text-align:left;margin-left:3%;color:var(--primary-color);font-weight: 600;">
              ${this.objects?.nome}
            </h2>
          </li>
          <li>PATENTE:${this.objects?.patente}</li>
          <li>FUNÇAO:${this.objects?.funcao}</li>
          <li>COLOCAÇAO: ${this.objects?.sigla}</li>
          <li>DATA DE EMISSAO:${this.objects?.createdAt}</li>
          <li>Nip nº:0${this.objects?.nip}</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="row-12 invisible" style=" display:flex; justify-content:center; align-text:center; align-items:center; height:39.5px;background:var(--primary-color);margin-top:1.5%; ">
    <h4 style="color:white; font-weight:600; text-align:center; font-size:12px;"></h4>
  </div>
</div>
<br/>
<div class="col-10 bg-light coluna shadow mt-4">
  <div style="display:grid">
    <div class="texts text-center" style="text-align:center">
      <h4 class="text-1-t-t text-center fs-2 fw-bolder text-dark" style="text-align:center;margin-top:3%;" title="texto principal">Prerrogativas</h4>
      <div class="lay-doc">
        <h3 class="doc" style="text-align:left;">Este documento tem por finalidade ,indetificar o portador na sua qualidade de Membro da policia Nacional e de Agente de Autoridade nos termos da lei e ,é de uso exclusivo da Direcção de Telecomunicações e Tecnologia de Informação.</h3>
      </div>
      <div style="display:grid">
        <h4 class="text-center fw-bold fs-6 mt-4" style="text-align:center;font-size:13px;">COMANDO GERAL DA POLICIA NACIONAL</h4>
        <h5 class="fw-light mt-4" style="font-size:10px; text-align:center">_________________________________________________________________</h5>
      </div>
    </div>
    <div class="texts col-6 w-50 text-center" style="display:grid;gap-row:20px;">
      <span style="width:100%; display:flex;padding:0px;margin:0px; justify-content:center; align-content:center;margin-top:-25%;">
          <h4 class="fs-5 fw-bold  primary rounded-3"
                  style="height:130px;width:140px;margin-bottom:5%;margin-left:-3%!important;background-color:navy;"> 
                  <img src="${this.pegarQr.changingThisBreaksApplicationSecurity}" height="100%" width="100%" alt="qrcode do agente ${this.objects.nome}" > </h4>
        <div id="qrcode"></div>
      </span>
    </div>
  </div>
</div>
</div>
<br>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrcode@latest/qrcode.min.js"></script>
<style>
/* CSS styles */
</style>
`;
    }
  }

  public evento($event: any) {
    console.log($event);
    this.agentes
      .listar({ pessoafisica_id: $event })
      .subscribe((response: any): void => {
        response.map((item: any) => {
          if (item.pessoafisica_id == $event) {
            this.objects = item;
            this.valor = item;
            console.log(this.objects);
          }
        });
        $event != null;
      });
  }
  selecionarOrgaoOuComandoProvincial($event: any): void {
    console.log($event);
    if ($event != null) {
      this.orgaoservice
        .listar({ tipo_orgao: $event })
        .subscribe((response: any): void => {
          this.direcao = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome_completo,
          }));
          console.log(this.direcao);
          $event != null;
        });
    }
  }
  selecionarAgente($event: any) {
    //  this.objects=Orgaos;
    // this.variaveis.setString($event.target.value);
    if ($event != null || $event != undefined) {
      this.agentes
        .listar({ pessoajuridica_id: $event })
        .subscribe((res: any) => {
          if ($event != null) {
            this.orgao = res.map((item: any) => ({
              id: item.pessoafisica_id,
              text: item.nip + '-' + item.nome,
            }));
          }
          console.log(this.orgao);
          $event = null;
        });
    }
  }

  public submit() {
    //adicionando passe no no elemento do formulario qrcode
    //   this.formQr.value.qrcode=this.formQr.value.orgao_id+"_"+this.formQr.value.pessoa_id;
    console.log(this.formQr.value);
    this.qrcodeservice
      .registar(this.formQr.value)
      .pipe()
      .subscribe((e: any) => console.log('sucesso ao inserir dados'));
  }

  public printar(data: any) {
    var conteudo: any = document.querySelector('body');
    var vazio = conteudo.innerHTML;
    this.generatePDF(data);
  }

  generatePDF(data: string) {
    console.log(this.objects.nip);
    // Selecionar o elemento que contém o conteúdo a ser convertido
    var conteudo: any = document.querySelector('body');
    conteudo.innerHTML = data;

    let PDF = new jsPDF('landscape', 'px', [2200, 2200]);
    html2canvas(conteudo, { scale: 3 }).then((canvas) => {
      const fileWidth = conteudo.innerWidth;
      const fileHeight = (canvas.height * fileWidth) / fileWidth;
      // Create PDF with custom size (twice the height of the image)
      // Add first image to the first page
      PDF.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        -5,
        0,
        fileWidth,
        fileHeight,
        'FAST'
      );
      // Add a new page for the HTML content
      PDF.addPage();
      PDF.setFontSize(11);
      // Add HTML content to the second page
      PDF.html(data);

      // Save the PDF
      PDF.save(`passe_de_agente_${this.objects.nip}.pdf`);
    });
  }

  verFoto(urlAgente: any): any {
    if (urlAgente && this.formQr.value.pessoa_id) {
      const opcoes = {
        pessoaId: this.formQr.value.pessoa_id,
        url: urlAgente,
      };
      this.fotoservice
        .getFile(opcoes)
        .pipe()
        .subscribe((file) => {
          return this.fotoservice.createImageBlob(file);
        });
    } else {
      this.toast.alerta('Não foi possivel gerar a foto do passe!');
    }
  }
}
