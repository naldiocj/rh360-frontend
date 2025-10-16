import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CalibreService } from '../../core/service/calibre.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { Select2OptionData } from 'ng-select2';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { ModalService } from '@core/services/config/Modal.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { ExplosivosService } from '../../core/explosivos.service';
import { EntidadesService } from '../../core/entidades.service';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-explosivos',
  templateUrl: './explosivos.component.html',
  styleUrls: ['./explosivos.component.css'],
})
export class ExplosivosComponent implements OnInit {
  public selecionado: any = false;
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;

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

  public classi: Array<Select2OptionData> = [
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

  valor!: Text;
  lista = {};
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  menu_escolha!: FormControlName;
  aux: any;
  pos: any = {};
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public entidade: Array<Select2OptionData> = [];

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
    private municoes: ExplosivosService,
    private ent: EntidadesService,
    private help: HelpingService,
    private users: AuthService
  ) {
    this.onSucess = new EventEmitter();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lista == null) {
    } else {
      this.fillForm(this.lista);
    }
  }

  //editar explosivo com nome de municoes
  editar() {
    this.municoes.actualizar(this.pos, this.form.value).subscribe({
      next:()=>{
        this.buscarArmas();
        this.removerModal();
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

  private buscarEntidade() {
    this.ent
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.entidade = res.map((p: any) => ({ id: p.id, text: p.nome }));
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

  private fillForm(data: any) {
    this.form.patchValue({
      classificacao: data.classificacao_id,
      descricao: data.descricao,
      serie: data.serie,
      tipo: data.tipo_id,
      marca: data.marca_id,
      pais: data.pais_id,
      ano_fabrico: data.ano_fabrico,
      entidade_id: data.entidade_id,
    });
    console.log(data);
  }

  private criarForm() {
    this.form = this.fb.group({
      classificacao: ['', Validators.required],
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      pais: ['', Validators.required],
      ano_fabrico: ['', Validators.required],
      entidade_id: ['', Validators.required],
    });
  }

  public onsubmit() {
    this.municoes.registar(this.form.value).subscribe({
      next:()=>{
   window.location.reload();
      }
    });
  }
  private buscarArmas() {
    this.filtro.orgao_id = this.users.orgao.sigla;
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
        console.log(response);
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
    this.buscarArmas();
    this.removerModal()
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
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
  //pegando a posicao do objecto a actualizar
  public get armaId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  modal() {
    this.modall.fechar('btn-classificacao');
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  //pegando valor do item para actualizar
  public setAct(item: any) {
    this.lista = item;
    this.pos = item.id;
    this.fillForm(item);
  }

  //apagar item

  public delete_(id: any) {
    console.log(id)
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
}
