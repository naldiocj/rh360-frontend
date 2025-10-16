import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { PaisService } from '@core/services/Pais.service';
import { ModalService } from '@core/services/config/Modal.service';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { LoteArmasService } from '@resources/modules/sigae/core/lote-armas.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-armas',
  templateUrl: './listar-armas.component.html',
  styleUrls: ['./listar-armas.component.css'],
})
export class ListarArmasComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public formulario!: FormGroup;
  public formAt!: FormGroup;
  public selecionado: any = false;
  classe: string = 'classes';
  menu_escolha!: FormControlName;
  aux: any;
  pos!: number;
  lista: any;
  crime!: boolean;
  idd!: number;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id:""
  };

  public armas: Array<any> = [];

  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public entidades: Array<Select2OptionData> = [];
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> = [];
  public carregando: boolean = false;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  protected is!: number;
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
    private ent: EntidadesService,
    private agenteOrgaoService: AgenteOrgaoService,
    private at: AtribuicaoArmasService,
    private loteArmas: LoteArmasService,
    private help: HelpingService,
    private users:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
        this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
    this.modal();
    this.criarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarArmas();
    this.buscarEntidades();

  }

  editar() {
    this.loteArmas
      .actualizar(this.pos, this.formulario.value)
      .subscribe((e) => null);
    setInterval(() => {
      this.recarregarPagina();
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

  private buscarEntidades() {
    this.ent
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.entidades = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }

  private buscarArmas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.loteArmas
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
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
  fazerAtPORdir() {
    this.loteArmas
      .registar(this.formulario.value)
      .subscribe((e) => console.log(e));
    setInterval(() => this.recarregarPagina(), 1000);
  }

  fillForm(data: any) {
    this.formulario.patchValue({
      descricao: data.descricao,
      serie: data.serie,
      tipo_id: data.tipo_id,
      marca_id: data.marca_id,
      calibre_id: data.calibre_id,
      pais_id: data.pais_id,
      ano_fabrico: data.ano_fabrico,
      lote: data.lote,
      quantidade: data.quantidade,
      classificacao_id: data.classificacao_id,
      entidade_id: data.entidade_id,
    });
  }

  private criarForm() {
    this.formulario = this.fb.group({
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo_id: ['', Validators.required],
      marca_id: ['', Validators.required],
      calibre_id: ['', Validators.required],
      pais_id: ['', Validators.required],
      ano_fabrico: ['', Validators.required],
      lote: ['', Validators.required],
      quantidade: ['', Validators.required],
      entidade_id: [''],
      classificacao_id: 3,
    });

    this.formAt = this.fb.group({
      descricao: ['', Validators.required],
      situacao: ['', Validators.required],
      orgao_id: [''],
      arma_id: [''],
      pessoa_id: ['', Validators.required],
    });

    this.atDir = this.fb.group({
      descricao: ['', Validators.required],
      situacao: ['', Validators.required],
      orgao_id: [''],
      lote_id: [''],
      pessoa_id: ['', Validators.required],
    });
  }

  public onSubmit() {
    // this.carregando = true;
    // this.loteArmas
    //   .registar(this.formulario.value)
    //   .subscribe((e) => console.log(e));
  }

  getID() {
    return this.idd;
  }

  public onupdate() {
    this.carregando = true;
    this.loteArmas
      .actualizar(this.getID(), this.formulario.value)
      .subscribe((e) => console.log(e));
  }

  public resetForm = (): void => {
    this.formulario.reset();
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get armaId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  public setId(id: any) {}

  //utilizado para trazer os dados do backend
  public setAct(item: any) {
    this.fillForm(item);
    this.pos = item.id;
  }

  modal() {
    this.modall.fechar('btn-classificacao');
  }

  public menu(text: any) {
    if (text.target?.value != '') {
      this.modall.abrir('btn-classes');
    }
  }

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
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }

  selecionarAgente(event: any) {
    this.agenteOrgaoService
      .verAgenteOrgao(event)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.func = res.map((p: any) => ({
            id: p.id,
            text: p.nome_completo,
          }));
        },
      });
  }

  passar() {
    this.at.registar(this.atDir.value).subscribe((e) => console.log(e));
  }

  //cadastrar um lote ainda nao troquei o nome

  public delete_(id: any) {
    this.carregando = false;
    this.loteArmas.deletar(id).pipe(
      finalize((): void => {
        this.carregando = true;
      })
    );
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarArmas();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarArmas();
  }
}
