import { RelatorioService } from "./../../core/service/relatorio.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { HelpingService } from "../../core/helping.service";

@Component({
  selector: "app-relatorios-gerados",
  templateUrl: "./relatorios-gerados.component.html",
  styleUrls: ["./relatorios-gerados.component.css"],
})
export class RelatoriosGeradosComponent implements OnInit {
  public relatorio!: any;
  relatorios!: FormGroup;
  public pos!: number;
  public contexto!: any;
  protected is!:number
  constructor(private rel: RelatorioService, private fb: FormBuilder,private help:HelpingService) {}
  public i!: number;
  ngOnInit(): void {
    this.inicio();
    this.is=this.help.isUser

  }

  inicio() {
    this.rel.filtrar().subscribe((e) => console.log((this.relatorio = e)));

    this.rel.filtrar().subscribe((e) => console.log((this.relatorio = e)));

    this.relatorios = this.fb.group({
      relatorio_corpo: [""],
    });
  }

  public op: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "400px",
    minHeight: "600px",
    maxHeight: "auto",
    width: "100%",
    minWidth: "100%",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Já pode começar a escrever o seu relatório!",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "roboto", name: "roboto" },
      { class: "bold", name: "bold" },
      { class: "poppins", name: "poppins" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    uploadUrl: "v1/image",
    //upload: (file: File) => { }
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic", "normal"], ["fontSize"]],
  };

  start(data: any) {
    this.relatorios.patchValue({
      relatorio_corpo: data.relatorio_corpo,
    });
  }

  guardar() {
    this.rel.actualizar(this.pos, this.relatorios.value).subscribe((e) => null);


    setInterval(
      ()=>{
   window.location.reload()
      },500
    )
  }

  setId(item: any) {
    this.start(item);
    this.pos = item.id;
  }

  ver() {}

  gerar() {
    var img = "../../../../../../../../assets/img/icons do sigae/icon.png";
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

    this.imprimir();
  }

  imprimir() {
    document.body.innerHTML = this.contexto;
    setTimeout(() => {
      window.print();
      window.stop();
    }, 50);
  }
}
