import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Pagination } from "@shared/models/pagination";
import { Select2OptionData } from "ng-select2";
import { Validators } from "ngx-editor";
import { finalize } from "rxjs";
import { CalibreService } from "../../core/service/calibre.service";
import { PaisService } from "@core/services/Pais.service";
import { ModeloService } from "../../core/service/modelo.service";
import { TiposArmasService } from "../../core/service/tipos-armas.service";
import { ClassificacaoArmasService } from "../../core/service/classificacao-armas.service";
import { MarcasArmasService } from "../../core/service/marcas-armas.service";
import { ModalService } from "@core/services/config/Modal.service";
import { DirecaoOuOrgaoService } from "@shared/services/config/DirecaoOuOrgao.service";
import { LoteexplosivosService } from "../../core/loteexplosivos.service";
import { EntidadesService } from "../../core/entidades.service";
import { HelpingService } from "../../core/helping.service";
import { AuthService } from "@core/authentication/auth.service";

@Component({
  selector: "app-explosivos-lotes",
  templateUrl: "./explosivos-lotes.component.html",
  styleUrls: ["./explosivos-lotes.component.css"],
})
export class ExplosivosLotesComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public selecionado: any = false;
  public tiposMunicoes: Array<Select2OptionData> = [
    { id: "1", text: "Bala" },
    { id: "2", text: "Cartucho" },
    { id: "3", text: "Granada" },
    { id: "4", text: "Morteiro" },
    { id: "5", text: "Foguete" },
    { id: "6", text: "Rifle" },
    { id: "7", text: "Pistola" },
    { id: "8", text: "Escopeta" },
    { id: "9", text: "Melhadora" },
  ];

  public entidade: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: "",
    orgao_id:''
  };
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;

  aux: any;
  pos!: number;
  options: any = {
    placeholder: "Selecione uma opção",
    width: "100%",
  };
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: "", text: "Selecione uma opção" },
    { id: "Comando Provincial", text: "Comando Provincial" },
    { id: "Orgão", text: "Orgão Central" },
  ];
protected is!:number
  constructor(
    private fb: FormBuilder,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private tipoService: TiposArmasService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private modall: ModalService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private enti: EntidadesService,
    private municoes: LoteexplosivosService,
    private help:HelpingService ,
    private users:AuthService

  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.is=this.help.isUser
    this.buscarArmas();
    this.modal();
    this.criarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarEntidade();



    if (this.arma.estado != "NA") {
      this.color = "red";
    } else {
      this.color = "green";
    }
  }

  editar() {
    console.log(this.form.value)
    console.log(this.pos)
    this.municoes.actualizar(this.pos, this.form.value).subscribe({
      next:()=>{
        this.removerModal();
        this.recarregarPagina()
      }
    });
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
  }
  private buscarModelo() {
    this.modeloService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
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
      .listar({})
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

  private buscarEntidade() {
    this.enti
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.entidade = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }

  private fillForm(data: any) {
    console.log(data)
    this.form.patchValue({
      descricao: data.descricao,
      serie: data.serie,
      tipo_id: data.tipo_id,
      marca_id: data.marca_id,
      pais_id: data.pais_id,
      fabricacao: data.fabricacao,
      lote: data.lote,
      entidade_id: data.entidade_id,
      quantidade: data.quantidade,
      classificacao_id: data.classificacao_id,
    });
    
  }

  private criarForm() {
    this.form = this.fb.group({
      descricao: ["", Validators.required],
      serie: ["", Validators.required],
      tipo_id: ["", Validators.required],
      marca_id: ["", Validators.required],
      pais_id: ["", Validators.required],
      fabricacao: ["", Validators.required],
      lote: ["", Validators.required],
      quantidade: ["", Validators.required],
      classificacao_id: ["", Validators.required],
      entidade_id: ["", Validators.required],
    });
  }

  public onsubmit() {
    this.municoes.registar(this.form.value).subscribe((e) => console.log(e));
    setInterval(() => this.recarregarPagina(), 1000);
  }
  private buscarArmas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.municoes
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.arma = response.data;
        console.log(this.arma)
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";
    this.buscarArmas();
  
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }

    this.buscarArmas();
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  private removerModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  public get armaId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  modal() {
    this.modall.fechar("btn-classificacao");
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public setAct(item: any) {
    this.fillForm(item);
    this.pos = item.id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.municoes
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          this.removerModal();
          this.recarregarPagina();
        },
      });
  }

  public menu(text: any) {
    if (text.target?.value != "") {
      this.modall.abrir("btn-classes");
    }  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + " - " + item.nome_completo,
        }));
      });
  }
}
