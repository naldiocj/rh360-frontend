import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { PaisService } from '@core/services/Pais.service';
import { ModalService } from '@core/services/config/Modal.service';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { LotemunicoesService } from '@resources/modules/sigae/core/lotemunicoes.service';
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
  selector: 'app-listar-municao',
  templateUrl: './listar-municao.component.html',
  styleUrls: ['./listar-municao.component.css'],
})
export class ListarMunicaoComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public selecionado: any = false;
  public tiposMunicoes: Array<Select2OptionData> = [
    { id: '1', text: 'Bala' },
    { id: '2', text: 'Cartucho' },
    { id: '3', text: 'Granada' },
    { id: '4', text: 'Morteiro' },
    { id: '5', text: 'Foguete' },
    { id: '6', text: 'Rifle' },
    { id: '7', text: 'Pistola' },
    { id: '8', text: 'Escopeta' },
    { id: '9', text: 'Melhadora' },
  ];

  public quantidadeBalas: any = {};
  public entidade: any;

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id:""
  };
  arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  itens: any;
  tab!: HTMLElement;
  aux: any;
  pos!: number;
  balas!: FormGroup;
  posCal!: number;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  protected is!:number
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

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
    private municoes: LotemunicoesService,
    private enti: EntidadesService,
    private help:HelpingService ,
    private users:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.quantidadeBalas;
    this.is=this.help.isUser
    this.buscarArmas();
    this.modal();
    this.criarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarEntidade();
    this.buscarCalibre();

    if (this.arma.estado != 'NA') {
      this.color = 'red';
    } else {
      this.color = 'green';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.itens != null) {
      this.fillForm(this.itens);
    }
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
    this.form.patchValue({
      descricao: data.descricao,
      serie: data.serie,
      tipo_id: data.tipo_id,
      marca_id: data.marca_id,
      calibre_id: data.calibre_id,
      quantidade: data.quantidade,
      lote: data.lote,
      ano_fabrico: data.ano_fabrico,
      pais_id: data.pais_id,
      entidade_id: data.entidade_id,
    });
  }

  private criarForm() {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo_id: ['', Validators.required],
      marca_id: [''],
      calibre_id: ['', Validators.required],
      quantidade: ['', Validators.required],
      lote: [''],
      ano_fabrico: ['', Validators.required],
      pais_id: ['', Validators.required],
      entidade_id: ['', Validators.required],
    });

    this.balas = this.fb.group({
      serie: ['', Validators.required],
      descricao: [''],
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

  public resetForm = (): void => {
    this.form.reset();
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  modal() {
    this.modall.fechar('btn-classificacao');
    //console.log(this.menu_escolha);
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
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
  get(data: any) {
    this.fillForm(data);
    this.pos = data.id;
  }

  editar() {
    this.municoes.actualizar(this.pos, this.form.value).subscribe((e) => null);
    setInterval(() => {
      this.recarregarPagina();
    }, 1000);
  }
  public cadastrar_bala(data: any) {
    this.quantidadeBalas = data;
  }
}
