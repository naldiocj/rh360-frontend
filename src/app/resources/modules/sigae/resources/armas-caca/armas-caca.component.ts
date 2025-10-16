import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { ArmaService } from '../../core/service/arma.service';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';
import { CalibreService } from '../../core/service/calibre.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { EntidadesService } from '../../core/entidades.service';

@Component({
  selector: 'app-armas-caca',
  templateUrl: './armas-caca.component.html',
  styleUrls: ['./armas-caca.component.css'],
})
export class ArmasCacaComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public selecionado: any = false;

  ocultarEditar = false;
  public mostra_entidades: any;
  public marcas!: Array<Select2OptionData>;
  public modelos!: Array<Select2OptionData>;
  public tipos!: Array<Select2OptionData>;
  public class!: Array<Select2OptionData>;
  public pais!: Array<Select2OptionData>;
  public classes!: Array<Select2OptionData>;
  public calibres!: Array<Select2OptionData>;
  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
    search: '',
  };
  public enty: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'caça',
    orgao_id: '',
  };
  
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  public is!: number;
  constructor(
    private armas: ArmaService,
    private help: HelpingService,
    private users: AuthService,
    private calibreService:CalibreService,
    private tipoService:TiposArmasService,
    private classService:ClassificacaoArmasService,
    private modeloService:ModeloService,
    private marcaService:MarcasArmasService,
    private paiService:PaisService,
    private entidades:EntidadesService,
    private fb:FormBuilder
  ) {}

  ngOnInit(): void {
    this.is = this.help.isUser;
    this.startForm();
    this.buscarArmas();
    this.buscarClassificacao();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
  this.inicio_entidade()

  }


  public startForm(){
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

  private buscarArmas() {
    const options = { ...this.filtro };
    this.filtro.orgao_id = this.users.orgao.sigla;
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
    this.modeloService
      .listar({})
      .subscribe({
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
    this.classService
      .filtrar()
      .subscribe({
        next: (res) => {
          this.classes = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  public buscarCalibre($event: any = null) {
    this.calibreService
      .filtrar()
      .subscribe({
        next: (res) => {
          if ($event) {
            this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
          }
        },
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

  public get(id: any) {
    this.id = id;
  }
  public delete_(id: any) {
    this.armas.deletar(id).subscribe(() => this.actualizarPagina());
  }

  public editar() {
    this.carregando = true;
    this.armas.actualizar(this.id, this.form.value).subscribe({
      next: (p) => {
       this.buscarArmas();
      },
    });
  }

  public actualizarPagina() {
    window.location.reload();
  }

  public obj(item: any) {
    this.fillForm(item);
    this.id = item.id;
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
}
