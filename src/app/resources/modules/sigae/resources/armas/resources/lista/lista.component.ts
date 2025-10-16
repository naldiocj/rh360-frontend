import { Pagination } from './../../../../../../../shared/models/pagination';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PaisService } from '@core/services/Pais.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { ArmaService } from '@resources/modules/sigae/core/service/arma.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { filter, finalize } from 'rxjs';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { DevolverService } from '@resources/modules/sigae/core/devolver.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { AddInformacaoService } from '@resources/modules/sigae/core/service/add-informacao.service';
import { error } from 'jquery';
import { RespostasService } from '@resources/modules/sigae/core/respostas.service';
import { AuthService } from '@core/authentication/auth.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit {
  public detalhe: any;
  public checkedArray: any = new Set();
  public showCategoria: boolean = false;
  public takeClasse: any;
  public form!: FormGroup;
  public formInfo!: FormGroup;
  public formAt!: FormGroup;
  public formulario!: FormGroup;
  public classe: string = 'classes';
  public menu_escolha!: FormControlName;
  public obj_info: any;
  public armas_id: any;
  public aux: any;
  public crime!: boolean;
  public idd!: number;
  public IDpegado!: any;
  public id_arma!: number;
  public pos!: number;
  public showAgente: boolean = false;
  public showATs = true;
  setorgao: any;
  public onSucess!: any;
  public con_state: any;

  public pagination = new Pagination();
  public totalBase: number = 0;
  public currentPage: number = 0;
  public itemsPerPage: number = 0;

  public id: any;
  public estado = 'NA';
  armas: any = [];
  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
    search: '',
  };
  public verEnty: any = false;
  public istrue: any;
  public index = 0;
  public count = 0;
  public object: any;
  public status: any;
  public atDir!: FormGroup;
  public objecto: any;
  filtro = {
    page: 1,
    perPage: 6,
    search: '',
    orgao_id: '',
    arma_id: '',
  };
  public formDevolver!: FormGroup;
  public calibres!: Array<Select2OptionData>;
  public enty!: Array<Select2OptionData>;
  public marcas!: Array<Select2OptionData>;
  public modelos!: Array<Select2OptionData>;
  public tipos!: Array<Select2OptionData>;
  public class!: Array<Select2OptionData>;
  public pais!: Array<Select2OptionData>;
  public classes!: Array<Select2OptionData>;
  public direcaoOuOrgao!: Array<Select2OptionData>;
  public func!: any;
  public carregando: boolean = false;
  public fileUpload: any;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  public mostra_entidades: any;
  public showAgentes: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'false', text: 'Direcção' },
    { id: 'true', text: 'Agente' },
  ];
  public VarAgentes: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: '1', text: 'PNA' },
    { id: '2', text: 'Outras Agentes' },
  ];
  public VarOrgaos: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: '2', text: 'PNA' },
    { id: '2', text: 'Outras Entidades' },
  ];
  public selecionado: boolean = false;
  public showValue: boolean = false;
  public verEntys: boolean = false;
  public rec: boolean = false;
  public poss: boolean = false;
  public desc: boolean = false;
  public alo: boolean = false;
  public emp: boolean = false;
  public org: boolean = false;
  public ocultarEditar:boolean = false;
  private formData = new FormData();
  public pegarClasse: any;
  public fileUploadGuia: any;
  public Tipolistar: Array<Select2OptionData> = [
    { id: 'Interior de residencia', text: 'Interior de residencia' },
    { id: 'Vía pública', text: 'Vía pública' },
    { id: 'Interior do estabelecimento', text: 'Interior do estabelecimento' },
  ];
  public estadoAr: Array<Select2OptionData> = [
    { id: 'Bom', text: 'Bom' },
    { id: 'Antigo', text: 'Antigo' },
    { id: 'Desaparecida', text: 'Desaparecida' },
    { id: 'Mal', text: 'Mal' },
  ];
  public verDesconhecido!: boolean;
  protected is!: number;

  constructor(
    private fb: FormBuilder,
    private armasService: ArmaService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private tipoService: TiposArmasService,
    private modeloService: ModeloService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private agenteOrgaoService: AgenteOrgaoService,
    private at: AtribuicaoArmasService,
    private entidades: EntidadesService,
    public devolver: DevolverService,
    public pushValue: HelpingService,
    private toast: IziToastService,
    private armasDetalhe: AddInformacaoService,
    private reply: RespostasService,
    private users: AuthService
  ) {}

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.pushValue.isUser;
    this.buscarTipo();
    this.criarForm();
    this.inicio();
    this.buscarClassificacao();
    this.buscarPais();
    this.buscarModelo();
    this.obj({});
    this.selecionarOrgaoOuComandoProvincial();
  }
  //buscar  armas
  private buscarArmas() {
    const options = { ...this.filtro };
    this.armasService.listar(options).subscribe((response: any) => {
      this.armas = response.data;
      this.show(this.armas);
      this.pagination = this.pagination.deserialize(response.meta);

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;
      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  private buscarDetalhes(id:any) {
    // const options = { ...this.filtro,arma_id:this.id };
    // this.isLoading = true;
    this.filtro.arma_id=id
    console.log(this.filtro);
    
    this.armasDetalhe
      .listar(this.filtro)
      .subscribe((response) => {
        this.detalhe = response.data;
        console.log(response);
  // this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarArmas();
  }

  public recarregar() {
    window.location.reload();
  }

  //pegando o ficheiro
  public pegarFile($event: any = null) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }
  public pegarFileGuia($event: any = null) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUploadGuia = file;
      console.log(file);
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }

  protected get GetFile() {
    return this.fileUpload == null ? 'N/S' : this.fileUpload;
  }

  protected get GetFileGuia() {
    return this.fileUploadGuia == null ? 'N/S' : this.fileUploadGuia;
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else {
    }
    console.log($e);
    console.log(this.filtro.page);
    this.buscarArmas();
  }

  public SetOrgao($e: any) {
    this.selecionarAgente(this.formAt.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.formAt.value.orgao_id);
  }

  public obj(lista: any) {
    this.object = lista;
    this.fillForm(lista);

    this.ocultarEditar = true;
  }

  public setobj(lista: any) {
    this.ocultarEditar = false;
    this.object = lista;
    this.fillForm(lista);
  }

  //passar
  public fillForm(data: any) {
    console.log(data);
    this.IDpegado = data.id;
    this.form.patchValue({
      descricao: data.descricao,
      livrete: data.livrete,
      estado: data.estado,
      estado_arma: data.estado_arma,
      classificacao_arma_id: data.classificacao_id,
      serie: data.serie,
      modelo_id: data.modelo_id,
      tipo_armas_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      id: data.id,
      ano_fabrico: data.created_at,
    });

    console.log(this.form.value);
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
  public show(data: any) {
    this.obj_info = data;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.id_arma = id;
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

  public settId(item: any) {
    this.at.listar({}).subscribe((e) => {
      e.map((p: any) => {
        this.status = p.serie;
      });
    });
  }
  public inicio() {
    this.at.listar({}).subscribe((e) => {
      e.map((p: any) => {
        this.status = p.serie;
      });
    });
  }

  setIdd(id: number) {
    this.idd = id;
  }

  public buscarPais($event = null) {
    this.paiService.listar({}).subscribe({
      next: (res) => {
        if (res) {
          console.log(res);
          this.pais = res.map((p: any) => ({ id: p.id, text: p.nome }));
        }
      },
      error: (e) => {},
    });
    this.crime ? true : false;
  }

  public buscarTipo() {
    this.tipoService
      .listar({})
      .subscribe({
        next: (res) => {
          if (res) {
            this.tipos = res.map((p: any) => ({ id: p.id, text: p.nome }));
          }
        },
      });
  }

  public buscarModelo($event = null) {
    this.modeloService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          if (res) {
            this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
          }
        },
      });
  }

  public buscarMarca($event:any) {
    this.marcaService
    .listar({ tipo_id: $event })
    .subscribe({
      next: (res) => {
        if (res) {
          this.marcas = res.map((p: any) => ({ id: p.id, text: p.nome }));
        }
      },
    });
  }

  private buscarClassificacao() {
    this.classService
      .filtrar()
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.aux = res;
          this.classes = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }
  public buscarCalibre($event: any = null) {
    this.calibreService
      .filtrar()
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          if ($event) {
            this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
          }
        },
      });
  }

  private SetFormDataAt() {
    this.formData.append('descricao', this.formAt.value.descricao);
    this.formData.append(
      'orgao_id',
      this.formAt.value.orgao_id == null ? 323 : this.formAt.value.orgao_id
    );
    this.formData.append('arma_id', this.IDpegado);
    this.formData.append('estado', this.formAt.value.estado);
    this.formData.append('num_despacho', this.formAt.value.num_despacho);
    this.formData.append(
      'pessoa_id',
      this.formAt.value.pessoa_id == undefined ? 2 : this.formAt.value.pessoa_id
    );
    this.formData.append(
      'sem_pessoa_id',
      this.formAt.value.sem_pessoa_id == undefined
        ? 'N/S'
        : this.formAt.value.sem_pessoa_id
    );
    this.formData.append('sem_orgao_id', this.formAt.value.sem_orgao_id);
    this.formData.append('ficheiro', this.GetFileGuia);
    this.formData.append(
      'processo_doc',
      this.GetFile == undefined ? this.GetFileGuia : this.GetFile
    );
    this.formData.append('created_at', this.formAt.value.created_at);
  }

  private SetFormDataAtDir() {
    this.formData.append('descricao', this.atDir.value.descricao);
    this.formData.append('orgao_id', this.atDir.value.orgao_id);
    this.formData.append('arma_id', this.IDpegado);
    this.formData.append('sem_orgao_id', this.formAt.value.sem_orgao_id);
    this.formData.append('estado', this.atDir.value.estado);
    this.formData.append('num_despacho', this.atDir.value.num_despacho);
    this.formData.append('ficheiro', this.GetFile);
    this.formData.append('created_at', this.atDir.value.created_at);
  }

  private SetFormDataDevolver() {
    this.formData.append('descricao', this.formDevolver.value.descricao);
    this.formData.append('destinatario', this.formDevolver.value.destinatario);
    this.formData.append('arma_id', this.IDpegado);
    this.formData.append('provedor', this.formDevolver.value.provedor);
    this.formData.append('num_despacho', this.formDevolver.value.num_despacho);
    this.formData.append('ficheiro', this.GetFile);
    this.formData.append('created_at', this.formDevolver.value.created_at);
  }

  public criarForm() {

    this.form = this.fb.group({
      livrete: ['', Validators.required],
      classificacao_arma_id: ['', Validators.required],
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo_armas_id: ['1'],
      modelo_id: ['', Validators.required],
      marca_arma_id: [''],
      estado_arma: [''],
      calibre_arma_id: ['', Validators.required],
      pai_id: ['', Validators.required],
      id: this.IDpegado,
      ano_fabrico: [''],
    });
    //este é o formulario registar por agente
    this.formAt = this.fb.group({
      descricao: ['s/d', Validators.required],
      orgao_id: [null],
      arma_id: this.IDpegado,
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      estado: ['AT'],
      num_despacho: ['N/S'],
      ficheiro: ['N/S'],
      processo_doc: ['N/S'],
      pessoa_id: [''],
      created_at: new Date(),
    });
    //este é formulario para direcao
    this.atDir = this.fb.group({
      orgao_id: [null],
      descricao: [''],
      estado: ['AT'],
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      ficheiro: ['N/S'],
      num_despacho: ['N/S'],
      arma_id: this.IDpegado,
      created_at: new Date(),
    });

    this.formDevolver = this.fb.group({
      provedor: ['Direcção da Logistica', Validators.required],
      destinatario: ['2', Validators.required],
      descricao: ['Devolucao de armas para as FAA'],
      num_despacho: ['N/S'],
      ficheiro: ['nehum'],
      arma_id: this.IDpegado,
      created_at: new Date(),
    });

    //formulario para adicionar informacao
    this.formInfo = this.fb.group({
      titulo: ['', Validators.required],
      detalhe: ['', Validators.required],
      arma_id: this.IDpegado,
      created_at: new Date(),
    });
  }

  setId(id: number) {
    this.idd = id;
    this.id_arma = id;
  }

  selecionarOrgaoOuComandoProvincial(): void {
    this.direcaoOuOrgaoService.listarTodos([]).subscribe((res) => {
      this.direcaoOuOrgao = res.map((item: any) => ({
        id: item.id,
        text: `${item.sigla}`+`- ${item.nome_completo}`,

      }));
    });

    setTimeout(() => {
      this.recarregarPagina();
    }, 1000);

    this.selecionarAgente([], []);
  }


  unsetAgente() {
    this.id = null;
    this.formAt.value.pessoa_id = null;
    this.formDevolver.value.pessoa_id = null;
    this.showATs = true;
  }

  setAgente(event: any) {
    this.id = event;
    this.formAt.value.pessoa_id = event;
    this.formDevolver.value.pessoa_id = event;
    this.showATs = false;
    // console.log(event);
  }

  public selecionarAgente(event: any, $e: any = null) {
    this.filtro.perPage = 5;
    this.filtro.search = $e;
    let data = {
      ...this.filtro,
      orgaoId: event,
    };
   
 if(data.orgaoId){ 
    this.agenteOrgaoService.TerAgenteOrgao(data).subscribe((res) => {
      this.func = res.data;
    });}
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  public get(id: any) {
    this.IDpegado = id;
    this.id = id;
    console.log(id)
    this.buscarDetalhes(id)
  }

  public checkede(data: any) {
    this.index += 1;
    this.checkedArray[this.index] = data;
    this.count = data;
    this.count = this.index;
  }

  //atribuir por agentes
  passar() {
    var a = (this.formAt.value.arma_id = this.IDpegado);
    this.formAt.value.pessoa_id == null ? 2 : this.formAt.value.pessoa_id;
    this.formAt.value.orgao_id == null ? 323 : this.formAt.value.orgao_id;
    this.formAt.value.created_at = new Date();
    this.formAt.value.updated_at = new Date();
    this.formAt.value.processo_doc == null
      ? 'sem documnto de processo'
      : this.formAt.value.processo_doc;
    this.SetFormDataAt();
    console.log(this.formAt.value);
    this.at.registar(this.formData).subscribe({
      next:()=>{
        this.actualizarPagina()
      }
    });

    if (this.checkedArray.length != 0) {
      var lista_de_Valor = this.removerDuplicados(this.checkedArray);
           if(lista_de_Valor){
      this.addItemOrg(lista_de_Valor);
           }
    }
  }

  //atribuicao por direcao
  fazerAtPORdir() {
    this.atDir.value.arma_id = this.IDpegado;
    this.atDir.value.pessoa_id == null ? null : this.atDir.value.pessoa_id;
    this.atDir.value.orgao_id == null ? null : this.atDir.value.orgao_id;
    this.atDir.value.processo_doc == null
      ? 'sem documnto de processo'
      : this.atDir.value.processo_doc;

    this.atDir.value.sem_pessoa_id == null
      ? 'N/S'
      : this.atDir.value.sem_pessoa_id;

    this.atDir.value.created_at = new Date();
    this.SetFormDataAtDir();
    this.at.registar(this.formData).subscribe(
      {
        next:()=>{
          this.actualizarPagina()
        }
      }
    );

    if (
      this.checkedArray.length != 0 ||
      this.checkedArray.size() != 0 ||
      this.checkedArray.length != null ||
      this.checkedArray.length != undefined
    ) {
      var lista_de_Valor = this.removerDuplicados(this.checkedArray);
      this.addItemDir(lista_de_Valor);
    }
  }

  public removerDuplicados(numero: any) {
    for (let i = 0; i < numero.lenght; i++) {
      if (numero[i] == numero[i + 1]) {
        //apagado
      } else {
        return numero[i];
      }
    }
  }

  
  public limparOrgao() {
    this.direcaoOuOrgao = [];
    this.removeModal();
    this.selecionarOrgaoOuComandoProvincial();
  }

  
  //adicionado itens selecionados na base de dados pelo id
  private addItemDir(vector: any) {
    const val = vector.map((i: any) => {
      var a = (this.atDir.value.arma_id = i);
      this.at.registar(this.atDir?.value).subscribe((e) => null);
    });
    this.actualizarPagina();
  }

  //adicionado itens selecionados na base de dados pelo id
  private addItemOrg(vector: any) {
    const val = vector.map((i: any) => {
      var a = (this.formAt.value.arma_id = i);
    });
    // this.actualizarPagina();
  }

  verificarExiste(data: any) {
    return this.istrue == true ? true : false;
  }

  public orgaoDesconhecido(event: any) {
    if (event === 1) {
      this.verDesconhecido = true;
      this.removeModal();
    } else {
      this.verDesconhecido = false;
      this.removeModal();
    }
  }

  public devolverArma() {
    this.SetFormDataDevolver();
    this.formDevolver.value.arma_id = this.IDpegado;
    this.devolver.registar(this.formData).subscribe((e) => {
      this.armasService.deletar(this.IDpegado).subscribe((e) => e);
      this.actualizarPagina();
    });
  }

  public lista(event: any) {
    var nome = this.form.value.classificacao_arma_id;
    this.pegarClasse = nome;

    if (nome != '') {
      //envolvidas em crimes
      if (nome == 1) {
        this.selecionado = false;
        this.poss = true;
        this.emp = false;
        this.verEntys = false;
        this.desc = false;
        this.rec = false;
        this.alo = false;
      }

      //entrada voluntaria
      if (nome == 2) {
        this.selecionado = false;
        this.desc = true;
        this.verEntys = false;
        this.rec = false;
        this.poss = false;
        this.emp = false;
        this.alo = false;
      }

      //recolha coersivas
      if (nome == 4) {
        this.selecionado = false;
        this.alo = false;
        this.verEntys = false;
        this.rec = true;
        this.poss = false;
        this.desc = false;
        this.emp = false;
      }

      //estraviadas
      if (nome == 5) {
        this.selecionado = false;
        this.rec = false;
        this.poss = false;
        this.verEntys = false;
        this.desc = false;
        this.alo = true;
        this.emp = false;
      }

      //convenio com as faa
      if (nome == 6) {
        this.selecionado = false;
        this.verEntys = true;
        this.rec = false;
        this.poss = false;
        this.desc = false;
        this.alo = false;
        this.emp = true;
        this.org = false;

        this.form.patchValue({
          categoria: 2,
        });
      }

      //organica
      if (nome == 3) {
        this.selecionado = false;
        this.showValue = true;
        this.verEntys = false;
        this.rec = false;
        this.poss = false;
        this.desc = false;
        this.alo = false;
        this.emp = true;
        this.org = false;

        this.form.patchValue({
          categoria: 1,
        });
      }

      if (nome == 7 || nome == 8 || nome == 9) {
        this.selecionado = false;
        this.showValue = true;
        this.verEntys = false;
        this.rec = false;
        this.poss = false;
        this.desc = false;
        this.alo = false;
        this.emp = true;
        this.org = false;
      }
    }
  }

  public editar() {
    this.carregando = true;
    this.armasService.actualizar(this.IDpegado, this.form.value).subscribe({
      next: (p) => {
      window.location.reload();
      },
    });
  }

  public guardar_detalhe() {
    this.formInfo.value.arma_id = this.IDpegado;
    this.armasDetalhe
      .registar(this.formInfo.value)
      .subscribe((e) => this.actualizarPagina());
      
      this.formInfo.reset();
  }
  private actualizarPagina() {
    this.removeModal();
    this.buscarDetalhes([]);
    // setInterval(() => {
    //   window.location.reload();
    // }, 700);
  }

  public getItem(item: object | any) {
    this.pegarClasse = item;
    var { id } = item;
    this.IDpegado = id;
  }

  get classe_id() {
    return this.pegarClasse;
  }

}
