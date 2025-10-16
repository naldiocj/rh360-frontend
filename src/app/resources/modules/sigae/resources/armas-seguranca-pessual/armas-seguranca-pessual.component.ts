import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { ArmaService } from '../../core/service/arma.service';
import { finalize } from 'rxjs';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';
import { CalibreService } from '../../core/service/calibre.service';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { EntidadesService } from '../../core/entidades.service';

@Component({
  selector: 'app-armas-seguranca-pessual',
  templateUrl: './armas-seguranca-pessual.component.html',
  styleUrls: ['./armas-seguranca-pessual.component.css'],
})
export class ArmasSegurancaPessualComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public selecionado: any = false;
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public enty: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'defesa',
    orgao_id: '',
  };
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  ocultarEditar=false;
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  protected is!: number;
  constructor(
    private armas: ArmaService,
    private help: HelpingService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private tipoService: TiposArmasService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private entidades: EntidadesService,
    private fb: FormBuilder,
    private users: AuthService
  ) {}

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.buscarArmas();
    this.CriarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.recarregarPagina();
  }

  private buscarArmas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.armas
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
    this.is = this.help.isUser;
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

  editar() {
    this.armas
      .actualizar(this.id, this.form.value)
      .subscribe((e) => null);
    setInterval(() => {
      window.location.reload();
    }, 1000);
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get(id: any) {
    this.id = id;
  }
  public delete_(id: any) {
    this.armas.deletar(id).subscribe(() => this.actualizarPagina());

  }

  public actualizarPagina() {
    this.removerModal()
    this.buscarArmas()
  }

  public obj(item: any) {
    this.id = item.id;
    this.fillForm(item);
  }

  CriarForm() {
    this.form = this.fb.group({
      livrete: ['', Validators.required],
      classificacao_arma_id: ['', Validators.required],
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo_armas_id: ['1'],
      modelo_id: ['', Validators.required],
      marca_arma_id: [''],
      calibre_arma_id: ['', Validators.required],
      pai_id: ['', Validators.required],
      id: this.id,
      ano_fabrico: [''],
    });
  }

  public fillForm(data: any) {
    this.form.patchValue({
      descricao: data.descricao,
      livrete: data.livrete,
      estado: data.estado,
      classificacao_arma_id: data.classificacao_id,
      serie: data.serie,
      modelo_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      id: data.id,
      ano_fabrico: data.ano_fabrico,
    });
  }

  public inicio_entidade() {
    this.entidades
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.enty = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }

  public buscarPais($event = null) {
    this.paiService.listar({}).subscribe({
      next: (res) => {
        this.pais = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
      error: (e) => {},
    });
  }

  public buscarTipo() {
    this.tipoService.listar({}).subscribe({
      next: (res) => {
        this.tipos = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  public buscarModelo($event = null) {
    this.modeloService.listar({}).subscribe({
      next: (res) => {
        this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  public buscarMarca($event: any) {
    this.marcaService.listar({ tipo_id: $event }).subscribe({
      next: (res) => {
        this.marcas = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }

  private buscarClassificacao() {
    this.classService.filtrar().subscribe({
      next: (res) => {
        this.classes = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }
  public buscarCalibre($event: any = null) {
    this.calibreService.filtrar().subscribe({
      next: (res) => {
        if ($event) {
          this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
        }
      },
    });
  }
}
