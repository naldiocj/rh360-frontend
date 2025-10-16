import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControlName, FormGroup } from "@angular/forms";
import { Pagination } from "@shared/models/pagination";
import { Select2OptionData } from "ng-select2";
import { ArmaService } from "../../core/service/arma.service";
import { CalibreService } from "../../core/service/calibre.service";
import { PaisService } from "@core/services/Pais.service";
import { ModeloService } from "../../core/service/modelo.service";
import { TiposArmasService } from "../../core/service/tipos-armas.service";
import { ClassificacaoArmasService } from "../../core/service/classificacao-armas.service";
import { MarcasArmasService } from "../../core/service/marcas-armas.service";
import { DirecaoOuOrgaoService } from "@shared/services/config/DirecaoOuOrgao.service";
import { AgenteOrgaoService } from "../../core/service/agente-orgao.service";
import { AtribuicaoArmasService } from "../../core/service/atribuicao-armas.service";
import { finalize } from "rxjs";
import { Validators } from "ngx-editor";
import { SolicitacaoService } from "../../core/solicitacao.service";
import { EntregadasService } from "../../core/entregadas.service";
import { SolicitacaoDirecaoService } from "../../core/solicitacao-direcao.service";
import { AuthService } from "@core/authentication/auth.service";

@Component({
  selector: "app-modais",
  templateUrl: "./modais.component.html",
  styleUrls: ["./modais.component.css"],
})
export class ModaisComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  onSucess: any;
  public form!: FormGroup;
  public formRepair!: FormGroup;
  public formAtribuir!: FormGroup;
  public formRepairDir!: FormGroup;
  public formEntregarDir!: FormGroup;
  public formEntregar!: FormGroup;
  @Input() infoE: any;
  auxiliar: any;
  public formAt!: FormGroup;
  formulario!: FormGroup;
  classe: string = "classes";
  menu_escolha!: FormControlName;
  aux: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  id: any;
  position!: number;
  num!: number;
  cloneAtribuicao: any;
  mostra: boolean = false;

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    orgao_id:""
  };


  public tipoSolicitcao:Array<Select2OptionData>=[]
  options: any = {
    placeholder: "Selecione uma opção",
    width: "100%",
  };
  atDir!: FormGroup;
  pos: boolean = false;
  desc!: any;
  lista: any;
  public calibres: Array<Select2OptionData> = [];
  public armass: Array<Select2OptionData> = [];
  public armass2: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> | any = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: "", text: "Selecione uma opção" },
    { id: "Comando Provincial", text: "Comando Provincial" },
    { id: "Orgão", text: "Orgão Central" },
  ];

  constructor(
    private fb: FormBuilder,
    private armasService: ArmaService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private tipoService: TiposArmasService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private at: AtribuicaoArmasService,
    private solicitarArma: SolicitacaoService,
    private solicitacoesDirecao:SolicitacaoDirecaoService,
    private entregada:EntregadasService,
    private agenteOrgaoService: AgenteOrgaoService,
    private users:AuthService

  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;

    this.StartForms();
    this.CriarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarArma()
    if (this.filtro.search == "") {
      //   location.reload()
      this.mostrar_organicas("empresa");
    } else {
      this.mostrar_organicas(this.filtro.search);
    }
  }

  editar() {
    this.armasService
      .actualizar(this.position, this.form.value)
      .subscribe((e) => null);
    setInterval(() => {
    this.recarregarPagina()
    }, 1000);
  }

  private buscarPais() {
    this.paiService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.pais = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });

    this.crime ? true : false;
  }
  private buscarModelo() {
    this.modeloService
      .listar("")
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }


  private buscarArma() {
    this.armasService.filtrar()
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.armass = res.map((p: any) => ({ id: p.id, text: p.tipo_arma+" - "+p.livrete }));
      
          console.log(res)
        },
      });
  }

  private buscarTipo() {
    this.tipoService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.tipos = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  private buscarMarca() {
    this.marcaService
      .listar("")
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.marcas = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  private buscarClassificacao() {
    this.classService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.aux = res;
          this.classes = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  private buscarCalibre() {
    this.calibreService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";
    this.mostrar_organicas("crime");
    this.nullCalibre();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }
    this.mostrar_organicas(this.filtro.search);
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.calibreService
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina();
        },
      });
  }

  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  mostrar_organicas(code: any) {
    const valor = {
      page: 1,
      perPage: 10,
      search: code,
    };

    const options = { ...valor };
    this.armasService
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.armas = response.data;
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  CriarForm() {
    this.form = this.fb.group({
      processo: ["", Validators.required],
      marca_marca_id: ["", Validators.required],
      tipo_arma_id: ["", Validators.required],
      calibre_arma_id: ["", Validators.required],
      pai_id: ["", Validators.required],
      ano_fabrico: ["", Validators.required],
      categoria: ["", Validators.required],
      serie: ["", Validators.required],
      descricao: ["", Validators.required,Validators.maxLength(15)],
      sigae_atribuicao_id: ["", Validators.required],
    });
  }

  desvendar(dot: any) {
    if (dot == "Orgânca") {
      this.mostra == true;
    }
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
          text: item.sigla + " - " + item.nome_completo,
        }));
      });
  }


  public selecionarAgente(event: any) {
  if(event!=null || event!=undefined){  
    this.num=event
    this.agenteOrgaoService
      .verAgenteOrgao({ pessoajuridica_id: event})
      .subscribe((res:any) => {
        this.func = res.map((item: any) => ({
          id: item.id,
          text: item.nip + ' - ' + item.nome,
        }));
      });}
      event==null
      }

  selecionarOrgao(event: any) {
    this.num=event
  this.formRepair.value.orgao_id=event
  console.log(this.num)
    this.at.listar({}).subscribe((response: any): void => {
      this.armass = response.map((item: any) => ({
        id: item.id,
        text: item.livrete + "-" + item.tipo,
      }));

  if(response!=undefined){
    this.verId(response)
  }
    });
  }

  selecionarOrgao1(event: any) {
    this.entregada.listar({ direcao_nome:event }).subscribe((response: any): void => {
      this.cloneAtribuicao = response;

      var db= response.map((t:any)=>{
    console.log(t)
   if(event==t.direcao_nome){
    this.fill2(t)
    this.armass2 = response.map((item: any) => ({
      id: item.id,
      text: item.livrete + "-" + item.tipo_arma,
    }));
   }
   if(event!=t.direcao_nome){
   
   this.armass2=[];
   
   
   }
   


      })

    });

  }

  verId(data: any) {
 var db=data.map((p:any)=>{
    this.auxiliar=p.nome_alocado;
this.fill1(p)

 })
    console.log(this.formEntregar.value);
  }

  StartForms() {
    this.formRepair = this.fb.group({
      orgao_id: ["", Validators.required],
      pessoa_id:this.auxiliar,
      arma_id: [""],
      descricao: [""],
      assunto: ["reparação de arma"],
    });

    this.formAtribuir = this.fb.group({
      orgao_id: [""],
      pessoa_id: [this.auxiliar],
      arma_id: [""],
      descricao: [""],
      assunto: ["atribuição de arma"],
    });

    this.formEntregar = this.fb.group({
      orgao_id: [""],
      pessoa_id: [this.auxiliar],
      arma_id: [""],
      descricao: [""],
      assunto: ["Entrega de arma"],
    });


    this.formRepairDir = this.fb.group({
      orgao_id: [""],
      pessoa_id: 60,
      arma_id: [""],
      descricao: [""],
      assunto: ["atribuição de arma Dir"],
    });

    this.formEntregarDir = this.fb.group({
      orgao_id: [""],
      pessoa_id: 60,
      arma_id: [""],
      descricao: [""],
      assunto: ["Entrega de arma Dir"],
    });
  }
  public resetForm = (): void => {
    this.form.reset();
  };

  fillForm(data: any) {
    this.form.patchValue({
      processo: data.processo,
      marca_arma_id: data.marca_id,
      modelo_id: data.tipo_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      categoria: data.categoria,
      serie: data.serie,
      descricao: data.descricao,
    });
  }

  destructuraObject(event: any) {
    const atribuicao_id = this.cloneAtribuicao.filter(
      (item: any) => (item.arma_id = event)
    );

    this.form.patchValue({
      sigae_atribuicao_id: atribuicao_id[0].id,
    });
  }

  fill2(data: any) {
    this.formEntregar.patchValue({
      orgao_id:data.orgao,
      pessoa_id: data.pessoa_id,
      arma_id:data.arma_id,
      descricao:[''],
      assunto: ["Entrega de arma"],
    });

  }

  fill1(data: any) {
    this.formRepair.patchValue({
      orgao_id:data.orgao,
      pessoa_id: data.pessoa_id,
      arma_id:data.arma_id,
      descricao:[''],
      assunto: ["reparação de arma"],
    });


  }

  fill3(data: any) {
    this.formEntregarDir.patchValue({
      orgao_id:data.orgao,
      pessoa_id: data.pessoa_id,
      arma_id:data.arma_id,
      descricao:[''],
      assunto: ["Entrega de arma"],
    });

  }

  fill4(data: any) {
    this.formRepairDir.patchValue({
      orgao_id:data.orgao,
      pessoa_id: data.pessoa_id,
      arma_id:data.arma_id,
      descricao:[''],
      assunto: ["reparação de arma"],
    });

}
  get(item: any) {
    this.fillForm(item);
  }

  public reparacao() {
    this.formRepair.value.orgao_id=this.num;
    this.solicitarArma
      .registar(this.formRepair.value)
      .subscribe((e) => console.log(e));   
    console.log(this.formRepair.value);
  }

  public atribuicao() {
    this.formAtribuir.value.orgao_id=this.num;

    this.solicitarArma
      .registar(this.formAtribuir.value)
      .subscribe((e) => console.log(e));
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  public entregar() {
    this.formEntregar.value.orgao_id=this.num;
    this.solicitarArma
      .registar(this.formEntregar.value)
      .subscribe((e) => console.log(e));

    setTimeout(() => {
      window.location.reload();
    }, 5000);

    console.log(this.formEntregar.value)
  }




  
  public atribuicaoDir() {
    this.solicitacoesDirecao
      .registar(this.formRepairDir.value)
      .subscribe((e) => console.log(e));

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  public entregarDir() {
    this.solicitacoesDirecao
      .registar(this.formEntregarDir.value)
      .subscribe((e) => console.log(e));

    setTimeout(() => {
      window.location.reload();
    }, 5000);

    console.log(this.formEntregar.value)
  }
}
