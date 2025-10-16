import { Component, EventEmitter, OnInit } from '@angular/core';
import { CalibreService } from '../../core/service/calibre.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { ArmaService } from '../../core/service/arma.service';
import { Validators } from 'ngx-editor';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ModeloService } from '../../core/service/modelo.service';
import { PaisService } from '@core/services/Pais.service';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-armas-empresa',
  templateUrl: './armas-empresa.component.html',
  styleUrls: ['./armas-empresa.component.css'],
})
export class ArmasEmpresaComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  onSucess: any;
  public form!: FormGroup;
  public formAt!: FormGroup;
  formulario!: FormGroup;
  classe: string = 'classes';
  menu_escolha!: FormControlName;
  aux: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  id: any;
  position!: number;

  mostra: boolean = false;

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'empresa',
    orgao_id:''
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  desc!: any;
  lista: any;
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
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.recarregarPagina();
  }

  editar() {
    this.armasService
      .actualizar(this.position, this.form.value)
      .subscribe((e) => null);
    setInterval(() => {
      window.location.reload();
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
  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.empresas();
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
    this.empresas();
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
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  empresas() {
    const options = { ...this.filtro };
    this.armasService
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.armas = response.data;
        console.log(response.data);
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
      processo: ['', Validators.required],
      marca_marca_id: ['', Validators.required],
      tipo_arma_id: ['', Validators.required],
      calibre_arma_id: ['', Validators.required],
      pai_id: ['', Validators.required],
      ano_fabrico: ['', Validators.required],
      categoria: ['', Validators.required],
      serie: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  desvendar(dot: any) {
    if (dot == 'Orgânca') {
      this.mostra == true;
    }
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

  get(item: any) {
    this.fillForm(item);
  }
}
