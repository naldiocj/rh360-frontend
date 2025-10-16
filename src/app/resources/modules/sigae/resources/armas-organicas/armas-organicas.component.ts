import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import { ArmaService } from '../../core/service/arma.service';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { CalibreService } from '../../core/service/calibre.service';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { HelpingService } from '../../core/helping.service';
import { Auth } from '@shared/models/auth.model';
import { AuthService } from '@core/authentication/auth.service';
import { error } from 'jquery';

@Component({
  selector: 'app-armas-organicas',
  templateUrl: './armas-organicas.component.html',
  styleUrls: ['./armas-organicas.component.css'],
})
export class ArmasOrganicasComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public formdata = new FormData();
  public form!: FormGroup;
  formulario!: FormGroup;
  classe: string = 'classes';
  menu_escolha!: FormControlName;
  aux: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  position!: number;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'Orgânica',
    orgao_id:''
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  desc!: any;
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
  private fileUpload:any;
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
    private agenteOrgaoService: AgenteOrgaoService,
    private help: HelpingService,
    private users:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
      this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
    this.mostrar_organicas();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.criarForm();
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

  extraviara() {
    this.setForm();
    this.armasService
      .actualizar(this.position, this.formdata)
      .subscribe((e) => this.removeModal());

    console.log(this.formdata)
  }

  
  crimera() {

    this.formdata.append('livrete', this.form.value.livrete);
    this.formdata.append('classificacao_arma_id', '1');
    this.formdata.append('descricao', this.form.value.descricao);
    this.formdata.append('serie', this.form.value.serie);
    this.formdata.append('modelo_id', this.form.value.modelo_id);
    this.formdata.append('marca_arma_id', this.form.value.marca_arma_id);
    this.formdata.append('calibre_arma_id', this.form.value.calibre_arma_id);
    this.formdata.append('pai_id', this.form.value.pai_id);
    this.formdata.append('estado', 'NA');
    this.formdata.append('ano_fabrico', this.form.value.ano_fabrico);
    this.formdata.append('categoria', this.form.value.categoria);
    this.formdata.append('foto_arma', this.fileUpload);

    this.armasService
      .actualizar(this.position, this.formdata)
      .subscribe((e) => this.removeModal());
    console.log(this.formdata)
  }

  extraviar(item: any) {
    this.position = item.id;
    console.log(item)
    this.fillForm2(item);
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

  public pegarFile($event: any = null) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    } else {
      // this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.mostrar_organicas();
    this.nullCalibre();
  }

  private setForm(){
  this.formdata.append('livrete', this.form.value.livrete);
  this.formdata.append('classificacao_arma_id', '5');
  this.formdata.append('descricao', this.form.value.descricao);
  this.formdata.append('serie', this.form.value.serie);
  this.formdata.append('modelo_id', this.form.value.modelo_id);
  this.formdata.append('marca_arma_id', this.form.value.marca_arma_id);
  this.formdata.append('calibre_arma_id', this.form.value.calibre_arma_id);
  this.formdata.append('pai_id', this.form.value.pai_id);
  this.formdata.append('estado', 'NA');
  this.formdata.append('ano_fabrico', this.form.value.ano_fabrico);
  this.formdata.append('categoria', this.form.value.categoria);
  this.formdata.append('foto_arma', this.fileUpload);

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

  selecionarAgente(event: any) {
    this.agenteOrgaoService
      .verAgenteOrgao(event)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.func = res.map((p: any) => ({
            id: p.id,
            text: p.nome + '-' + p.apelido,
          }));
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
        console.log(this.armas)
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  fillForm(data: any) {
    this.form.patchValue({
      livrete: data.livrete,
      classificacao_arma_id: data.classificacao_id,
      descricao: data.descricao,
      serie: data.serie,
      modelo_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      categoria: data.categoria,
    });
  }

  fillForm2(data: any) {
    this.form.patchValue({
      livrete: data.livrete,
      id: data.id,
      classificacao_arma_id: 6,
      descricao: [''],
      serie: data.serie,
      modelo_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      categoria: data.categoria,
      estado: 'NA'
    });
  }

  get(item: any) {
    //   this.fillFor2(item)
    this.fillForm(item);
    this.position = item.id;
  }

  criarForm() {
    this.form = this.fb.group({
      livrete: ['ola eu'],
      classificacao_arma_id: [''],
      descricao: ['sem detalhes'],
      serie: [''],
      modelo_id: [''],
      marca_arma_id: [''],
      calibre_arma_id: [''],
      pai_id: [''],
      ano_fabrico: [''],
      categoria: [''],
      estado: [''],
    });
  }

  submit() {
    this.armasService
      .registar(this.formdata)
      .pipe()
      .subscribe({
        next:()=>{
          this.removeModal();
        },
        error:()=>{},
      });
  }

  isOrganica(value: any) {
    if (value == this.filtro.tipoArma) {
      return true;
    }
    return false;
  }
}
