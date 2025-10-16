import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { AtribuicaoArmasService } from '../../core/service/atribuicao-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { finalize } from 'rxjs';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { ArmaService } from '../../core/service/arma.service';
import { CalibreService } from '../../core/service/calibre.service';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { EntregadasService } from '../../core/entregadas.service';
import { Validators } from 'ngx-editor';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-entregadas',
  templateUrl: './entregadas.component.html',
  styleUrls: ['./entregadas.component.css'],
})
export class EntregadasComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;

  public arma_id!: number;
  public form!: FormGroup;
  public formAt!: FormGroup;
  formulario!: FormGroup;
  classe: string = 'classes';
  menu_escolha!: FormControlName;
  aux: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  clas: boolean = false;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma:"crime",
    orgao_id:''

  };
  ob: any;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
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
protected is!:number
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
    private at: AtribuicaoArmasService,
    private entregas: EntregadasService,
    private help:HelpingService ,
    private users:AuthService

  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.criarForm();
    this.buscarPais();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.is=this.help.isUser
    this.filtro.orgao_id = this.users.orgao.sigla;

  
  }

  editar() {
    this.armasService
      .actualizar(this.position, this.form.value)
      .subscribe((e) => null);
  }

  private buscarPais() {
    this.paiService.listar({}).subscribe({
      next: (res) => {
        this.pais = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });

    this.crime ? true : false;
  }
  private buscarModelo() {
    this.modeloService.listar({}).subscribe({
      next: (res) => {
        this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
      },
    });
  }
  private buscarTipo() {
    this.tipoService
      .listar({})
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
    this.mostrar_organicas();
    this.nullCalibre();
    this.is=this.help.isUser

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

  public resetForm = (): void => {
    this.form.reset();
  };

  fillForm(data: any) {
    this.form.patchValue({
      processo: data.processo,
      marca: data.marca_id,
      tipo_id: data.tipo_id,
      calibre_id: data.calibre_id,
      pais_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      categoria: data.categoria,
      serie: data.serie,
      descricao: data.descricao,
    });
  }

  get(item: any) {
    this.fillForm(item);
    this.position = item.id;
  }

  passar() {
    this.at.registar(this.formAt.value).subscribe((e) => console.log(e));
    setInterval(this.recarregarPagina, 3000);
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    console.log($event);
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }

  selecionarAgente(event: any) {
    this.agenteOrgaoService
      .verAgenteOrgao({ pessoajuridica_id: event })
      .subscribe({
        next: (res: any) => {
          this.func = res.map((p: any) => ({
            id: p.id,
            text: p.nome + ' ' + p.apelido,
          }));
        },
      });
  }
  criarForm() {
    this.form = this.fb.group({
      processo: [''],
      marca_id: [''],
      tipo_id: [''],
      calibre_id: [''],
      pais: [''],
      ano_fabrico: [''],
      categoria: [''],
      serie: [''],
      descricao: [''],
    });

    this.atDir = this.fb.group({
      direcao_nome: [''],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      provedor: ['Logistica'],
      arma_id: [''],
    });
  }

  fazerAtPORdir() {
    this.entregas.registar(this.atDir.value).subscribe((e) => console.log(e));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  public pegarId(item: any) {
    this.arma_id = item.id;
    this.inicio(item);
    var obj = {};
    this.entregas.listar({}).subscribe((e) => console.log(e));
  }

  public inicio(data: any) {
    this.atDir.patchValue({
      direcao_nome: [''],
      nome: [''],
      descricao: [''],
      arma_id: this.arma_id,
      provedor: ['Logistica'],
    });
  }
}
