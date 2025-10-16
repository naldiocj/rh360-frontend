import { Pagination } from '@shared/models/pagination';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { CalibreService } from '../../core/service/calibre.service';
import { ArmaService } from '../../core/service/arma.service';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '../../core/service/atribuicao-armas.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { EntregadasService } from '../../core/entregadas.service';
import { HelpingService } from '../../core/helping.service';
import { error } from 'jquery';
import { IziToastService } from '@core/services/IziToastService.service';
import { RespostasService } from '../../core/respostas.service';
import { AuthService } from '@core/authentication/auth.service';
import { EntidadesService } from '../../core/entidades.service';

@Component({
  selector: 'app-armas-crime',
  templateUrl: './armas-crime.component.html',
  styleUrls: ['./armas-crime.component.css'],
})
export class ArmasCrimeComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  condicion: any;
  showentidade: any;
  public verDesconhecido=false
  public arma_id!: number;
  public form!: FormGroup;
  public formRes!: FormGroup;
  public formAt!: FormGroup;
  formulario!: FormGroup;
  classe: string = 'classes';
  menu_escolha!: FormControlName;
  aux: any;
  pegarClasse: any;
  crime!: boolean;
  idd!: number;
  armas: any = [];
  clas: boolean = false;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'crime',
    orgao_id:''
  };
  ob: any;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  formData = new FormData();
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
  desc!: any;
  objHis:any;
  getPathCaminho:any;
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public enty: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  protected is!: number;
  ocultarEditar=false;
  fileUpload:any
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
    private help: HelpingService,
    private toast:IziToastService,
    private reply:RespostasService,    
    private entidades:EntidadesService,
    private users:AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.criarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarEntregadas();
    this.recarregarPagina()
  this.inicio_entidade()
    this.is = this.help.isUser;
    this.filtro.orgao_id = this.users.orgao.sigla;
  }
  buscarEntregadas() {
    this.entregas.listar({}).subscribe((e: any) => {
      this.showentidade = e;
    });
  }

  editar() {
    this.armasService
      .actualizar(this.position, this.form.value)
      .subscribe((e) => this.recarregarPagina());
      this.removeModal()
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

    
      public oculto(id:number) {
        if (this.filtro.perPage <=20) this.filtro.perPage = 10;
       console.log(id)
        const options = { ...this.filtro,estadoArma:'NA',armaId:id };
        this.armasService
          .listar(options)
          .pipe()
          .subscribe((response: any) => {
            this.objHis = response.data;
            console.log(this.objHis)
            console.log(response)
    
          });
      }

      public getFileInformation(id: any=null, Url: any=null) {
        var url;
        url = Url
        this.getPathCaminho = this.help.pegarFicheiroCaminho(id, url);
      }
    

  public delete(id:number) {
    console.log(id)
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

  get(item: any) {
    this.fillForm(item);
    this.position = item.id;
  }

  passar() {
    this.at.registar(this.formAt.value).subscribe((e) => console.log(e));
    setInterval(location.reload, 3000);
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

    this.atDir = this.fb.group({
      direcao_nome: [''],
      num_despacho: [''],
      estado: ['NA'],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      provedor: ['Logistica'],
      arma_id: this.arma_id,
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
    this.entregas.listar({}).subscribe((e) => e);
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
  public objCrime(data: any) {
    this.condicion = data;
  }

  public pegarFile($event: any) {
    console.log($event.target.files)
    console.log($event.target.files[0])

    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }

  private get GetFile(){
    return this.fileUpload;
  }
  
  public getItem(item: object | any) {
    this.pegarClasse = item;
    console.log(item)
  }

  get classe_id() {
    return this.pegarClasse;
  }
  private SetFormDataResposta() {
    this.formData.append('titulo', this.formRes.value.titulo);
    this.formData.append('resposta', this.formRes.value.resposta);
    this.formData.append('orgao_id', this.formRes.value.orgao_id);
    this.formData.append('classificacao_id', this.classe_id);
    this.formData.append('ficheiro', this.GetFile);
  }

  public registarResposta() {
    this.SetFormDataResposta();
    this.reply
       .registar(this.formData)
       .subscribe((e) => e);
     setTimeout(() => {
        window.location.reload()
     }, 500);
  }
}
