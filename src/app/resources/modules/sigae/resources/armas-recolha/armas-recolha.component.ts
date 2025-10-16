import { Component, EventEmitter, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { CalibreService } from '../../core/service/calibre.service';
import { Pagination } from '@shared/models/pagination';
import { ArmaService } from '../../core/service/arma.service';
import { Validators } from 'ngx-editor';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';
import { EntidadesService } from '../../core/entidades.service';

@Component({
  selector: 'app-armas-recolha',
  templateUrl: './armas-recolha.component.html',
  styleUrls: ['./armas-recolha.component.css'],
})
export class ArmasRecolhaComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  onSucess: any;
  public form!: FormGroup;
  public formAt!: FormGroup;
  formulario!: FormGroup;
  classe: string = 'coersiva';
  menu_escolha!: FormControlName;
  aux: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  id: any;
  position!: number;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'recolha',
    orgao_id:''
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  ocultarEditar = false
  desc!: any;
  lista: any;
  enty: any;
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  protected is!: number;
  constructor(
    private fb: FormBuilder,
    private armasService: ArmaService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private tipoService: TiposArmasService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private entidades: EntidadesService,
    private help: HelpingService,
    private users:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
      this.is = this.help.isUser;
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.CriarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.recarregarPagina();
  
  }

  editar() {
    this.armasService
      .actualizar(this.position, this.form.value)
      .subscribe((e) => this.recarregarPagina());
      this.removeModal()
      this.form.reset()
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.mostrar_organicas();
    this.nullCalibre();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.mostrar_organicas();
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.armasService
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
          this.mostrar_organicas()
        },
      });
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  mostrar_organicas() {
    const options = { ...this.filtro };
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

  public resetForm = (): void => {
    this.form.reset();
  };

  fillForm(data: any) {
    this.position = data.id
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



  get(item: any) {
    this.position = item.id;
    this.fillForm(item);
  }
}
