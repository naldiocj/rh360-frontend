import { catchError } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { ArmaService } from '../../core/service/arma.service';
import { CalibreService } from '../../core/service/calibre.service';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { ModalService } from '@core/services/config/Modal.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '../../core/service/atribuicao-armas.service';
import { LoteArmasService } from '../../core/lote-armas.service';
import { finalize } from 'rxjs';
import { Validators } from 'ngx-editor';
import { Pagination } from '@shared/models/pagination';
import { EntidadesService } from '../../core/entidades.service';
import { AtribuirLotesService } from '../../core/atribuir-lotes.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { error } from 'jquery';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { environment, server_config } from '@environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { HelpingService } from '../../core/helping.service';
import { AnyObject } from 'chart.js/dist/types/basic';
import { AuthService } from '@core/authentication/auth.service';
@Component({
  selector: 'app-armas-lotes',
  templateUrl: './armas-lotes.component.html',
  styleUrls: ['./armas-lotes.component.css'],
})
export class ArmasLotesComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public formulario!: FormGroup;
  public formAt!: FormGroup;
  public selecionado: any = true;
  public classe: string = 'classes';
  public menu_escolha!: FormControlName;
  public aux: any;
  public pos!: number;
  public lista: any;
  public crime!: boolean;
  public idd!: number;
  public dataActual: Date = new Date();
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public atDir!: FormGroup;
  public form!: FormGroup;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };

  public filtro2 = {
    page: 1,
    perPage: 20,
    search: '',
    lote_id: '',
    orgao_id: '',
  };

  public ide!: number;
  public armas: Array<any> = [];
  public getPathCaminho: any | string;
  color!: string;
  public showATs: boolean = true;
  public itemArmas: any;
  public armasValorIgual: any;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public entidades: Array<Select2OptionData> = [];
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: any;
  public isExiste = false;
  public func: any;
  public carregando: boolean = false;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  private formularioData = new FormData();
  private DirecaoformularioData = new FormData();
  protected getFileToUpload: File | any;
  protected getCurrentHost!: string | Text;
  public username: any | Text;
  public serieArma: number | any;
  public totalArma: number = 0;
  public isFull: boolean = false;
  setorgao: any;
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
    private ent: EntidadesService,
    private agenteOrgaoService: AgenteOrgaoService,
    private at: AtribuicaoArmasService,
    private lotesAr: AtribuirLotesService,
    private util: UtilService,
    private loteArmas: LoteArmasService,
    private arma: ArmaService,
    private fileservice: FicheiroService,
    private toast: IziToastService,
    private sanitizer: DomSanitizer,
    private help: HelpingService,
    private users: AuthService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.filtro2.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
    this.modal();
    this.criarForm();
    this.buscarPais();
    this.buscarClassificacao();
    this.buscarTipo();
    this.buscarArmas();
    this.buscarEntidades();
    this.initVariaveis();
    this.selecionarOrgaoOuComandoProvincial();
  }

  private initVariaveis() {
    this.getCurrentHost =
      server_config.host +
      ':' +
      server_config.port +
      environment.api_url_by_version;
  }

  public buscarArmasNoLote(options: any) {
    console.log(options);
    // this.isLoading = true;
    this.arma.listar(options).subscribe((response) => {
      this.itemArmas = response.data;
      console.log(this.itemArmas);
      this.totalArma = this.itemArmas.length;
      this.pagination = this.pagination.deserialize(response.meta);

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
    console.log(this.pagination);
  }

  editar() {
    console.log(this.formulario.value);

    this.loteArmas.actualizar(this.pos, this.formulario.value).subscribe({
      next: () => {
       this.actualizarPagina();
        console.log(this.formulario.value);
      },
      error: () => {},
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

    this.crime ? true : false;
  }
  public buscarModelo($event: any = null) {
    if ($event != null || $event != undefined) {
      this.modeloService
        .listar({ marca_id: $event })
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (res) => {
            this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
          },
        });
    }
    $event = null;
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

  private buscarEntidades() {
    this.ent
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.entidades = res.map((p: any) => ({ id: p.id, text: p.nome }));
        },
      });
  }

  public buscarMarca($event: any = null) {
    if ($event != null || $event != undefined) {
      this.marcaService
        .listar({ tipo_id: $event })
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (res) => {
            this.marcas = res.map((p: any) => ({ id: p.id, text: p.nome }));
          },
        });
    }
    $event = null;
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
  public buscarCalibre($event: any = null) {
    if ($event != null || $event != undefined) {
      this.calibreService
        .listar({ modelo_id: $event })
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (res) => {
            this.calibres = res.map((p: any) => ({ id: p.id, text: p.nome }));
          },
        });
    }
    $event = null;
  }

  private buscarArmas() {
    const options = { ...this.filtro };
    this.loteArmas
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.armas = response?.data;
    console.log(this.armas);

        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  fillForm(data: any) {
    this.formulario.patchValue({
      descricao: data.descricao,
      serie: data.serie,
      tipo_id: data.tipo_id,
      modelo_id: data.modelo_id,
      marca_id: data.marca_id,
      calibre_id: data.calibre_id,
      pais_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      lote: data.lote,
      local: data.local,
      quantidade: data.quantidade,
      classificacao_id: data.classificacao_id,
      entidade_id: data.entidade_id,
    });

    
  }

  private criarForm() {
    //fomurlario de registo de lote
    this.formulario = this.fb.group({
      serie: ['', Validators.required],
      tipo_id: ['', Validators.required],
      modelo_id: ['', Validators.required],
      marca_id: ['', Validators.required],
      calibre_id: ['', Validators.required],
      pais_id: ['', Validators.required],
      lote: ['', Validators.required],
      local: ['', Validators.required],
      quantidade: ['', Validators.required],
      ano_fabrico: [''],
      descricao: ['', Validators.required],
      entidade_id: 1,
      classificacao_id: 3,
    });

    this.form = this.fb.group({
      livrete: [[], Validators.required, Validators.minLength(9)],
      descricao: ['', Validators.required],
      serie: this.serieArma,
      modelo_id: ['', Validators.required],
      marca_arma_id: ['', Validators.required],
      processo: ['N/S'],
      tipo_armas_id: ['', Validators.required],
      calibre_arma_id: ['', Validators.required],
      pai_id: ['', Validators.required],
      ano_fabrico: ['', Validators.required],
      local: ['N/S', Validators.required, Validators.minLength(2)],
      estado_entrega: ['N/S'],
      nome: ['Direcção da Logistica'],
      created_at: new Date(),
      lote_id: this.idd,
      categoria: 1,
      classificacao_arma_id: 3,
    });

    //fazer atribuição por lote
    this.atDir = this.fb.group({
      descricao: ['N/S'],
      situacao: ['nenhuma'],
      orgao_id: [''],
      pessoa_id: [''],
      matricula: ['', Validators.required],
      estado: ['AT'],
      documento: [''],
      lote_id: this.idd,
    });
  }

  public getFile($event: any) {
    var ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      this.getFileToUpload = ficheiro.files[0];
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
    console.log(this.GetFile.name);
  }
  private get GetFile() {
    return this.getFileToUpload;
  }

  //formualrio de direcoes
  submeterDataDirecao() {
    this.DirecaoformularioData.append('descricao', this.atDir.value.descricao);
    this.DirecaoformularioData.append('situacao', this.atDir.value.situacao);
    this.DirecaoformularioData.append('orgao_id', this.atDir.value.orgao_id);
    this.DirecaoformularioData.append('pessoa_id', this.atDir.value.pessoa_id);
    this.DirecaoformularioData.append('matricula', this.atDir.value.matricula);
    this.DirecaoformularioData.append('estado', this.atDir.value.estado);
    this.DirecaoformularioData.append('documento', this.GetFile);
    this.DirecaoformularioData.append('lote_id', this.atDir.value.lote_id);
  }

  //formualrio pra mandar file na db

  loteArma() {
    this.formularioData.append('quantidade', this.formulario.value.quantidade);
    this.formularioData.append('descricao', this.formulario.value.descricao);
    this.formularioData.append('serie', this.formulario.value.serie);
    this.formularioData.append('tipo_id', this.formulario.value.tipo_id);
    this.formularioData.append('marca_id', this.formulario.value.marca_id);
    this.formularioData.append('modelo_id', this.formulario.value.modelo_id);
    this.formularioData.append('calibre_id', this.formulario.value.calibre_id);
    this.formularioData.append('pais_id', this.formulario.value.pais_id);
    this.formularioData.append(
      'ano_fabrico',
      this.formulario.value.ano_fabrico
    );
    this.formularioData.append('lote', this.formulario.value.lote);
    this.formularioData.append('local', this.formulario.value.local);
    this.formularioData.append(
      'entidade_id',
      this.formulario.value.entidade_id
    );
    this.formularioData.append('ficheiroGuia', this.GetFile);
    this.formularioData.append(
      'classificacao_id',
      this.formulario.value.classificacao_id
    );
  }

  public GuardarLote() {
    this.loteArma();
    this.formulario.value.ficheiroGuia = this.GetFile;
    console.log(this.formulario.value);
    this.loteArmas
      .registar(this.formularioData)
      .pipe(
        catchError((er): any => {
          this.toast.erro('Não foi possivel guardar o arquivo!! ');
        })
      )
      .subscribe({
        next: (e) => {

          this.putInForm();
        },
      });
      let that = this;
      this.formularioData.forEach(function(val, key, fD){
        that.cleanFormData(key);
        });
  }

  public get getDate() {
    return this.util.dataActual;
  }


  public set cleanFormData(key:any) {
    this.formularioData.delete(key)
  }

  getID(id: any) {
    this.idd = id;
    this.id = id;
    console.log(this.idd);
  }

  public onupdate() {
    this.carregando = true;
    this.loteArma();
    this.loteArmas
      .actualizar(this.idd, this.formulario.value)
      .subscribe((e) => this.actualizarPagina());
  }

  public resetForm = (): void => {
    this.formulario.reset();
  };

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  public putInForm() {
    this.buscarArmas();

    this.getFile(null);
  }

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get armaId() {
    return this.id;
  }

  public setId(item: any) {
    var { id } = item;
    this.serieArma = item.serie;
    console.log(this.serieArma);
    this.form.value.serie = this.serieArma;
    this.idd = id;
    this.atDir.value.lote_id = id;
    this.armasValorIgual = id;
    console.log(this.itemArmas);
    console.log(item.id);
    console.log(this.armasValorIgual);
    this.filtro2.lote_id = item.id;
    this.buscarArmasNoLote(this.filtro2);
    this.setFull(item.quantidade, this.totalArma);
  }

  private setFull(qt: any, total: number) {
    this.totalArma = qt;
    console.log(qt);
    if (qt <= total) {
      this.isFull = true;
    } else {
      this.isFull = false;
    }
    console.log(this.isFull);
  }

  //utilizado para trazer os dados do backend
  public setAct(item: any) {
    this.fillForm(item);
    this.pos = item.id;
  }

  //funcao para verficar se as armas adicionadas nao passa da quantidade do lote
  private verifyArmaNoLote(data: any, loteId: number) {
    var datalist: any = [];
    datalist = data.filter((i: any) => i.lote_id != null);
    console.log(datalist);
    console.log(data);
    return data.filter((i: any) => i.lote_id == loteId);
  }

  modal() {
    this.modall.fechar('btn-classificacao');
  }

  public menu(text: any) {
    if (text.target?.value != '') {
      this.modall.abrir('btn-classes');
    }
  }

  public SetOrgao($e: any) {
    this.selecionarAgente(this.atDir.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.atDir.value.orgao_id);
  }

  selecionarOrgaoOuComandoProvincial(): void {
    this.direcaoOuOrgaoService.listarTodos([]).subscribe((res) => {
      this.direcaoOuOrgao = res.map((item: any) => ({
        id: item.id,
        text: `${item.sigla}`+`- ${item.nome_completo}`,

      }));
    });

    this.selecionarAgente([], []);
  }
  unsetAgente() {
    this.id = null;
    this.atDir.value.pessoa_id = null;
    this.showATs = true;
  }

  setAgente(event: any) {
    this.id = event;
    this.atDir.value.pessoa_id = event;
    this.showATs = false;
    console.log(event);
  }

  public selecionarAgente(event: any, $e: any = null) {
    this.filtro.perPage = 5;
    this.filtro.search = $e;
    let data = {
      ...this.filtro,
      pessoajuridica_id: event,
    };
    this.agenteOrgaoService.verAgenteOrgao(data).subscribe((res) => {
      this.func = res.data;
    });
  }

  //guardar direcao na db
  passar() {
    this.atDir.value.lote_id = this.idd;
    this.submeterDataDirecao();
    this.lotesAr.registar(this.DirecaoformularioData).subscribe({
      next: () => {
        this.recarregarPagina();
      },
    });
  }
  //deletar um lote
  public delete() {
    this.carregando = false;
    this.loteArmas
      .deletar(this.idd)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          // this.removeModal();
        this.recarregar()
        },
      });
  }

  public delete_(id: any) {
    this.carregando = false;
    console.log('pegou id:', id);
    this.loteArmas
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          // this.removeModal();
          this.recarregarPagina();
        },
      });
  }
  public recarregarPagina() {
    this.buscarArmas();
     this.actualizarPagina();
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

  public filtrarPagina2(key: any, $e: any) {
    if (key == 'page') {
      this.filtro2.page = $e;
    } else if (key == 'perPage') {
      this.filtro2.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro2.search = $e;
    }
    this.buscarArmasNoLote(this.filtro2);
  }


  public verificarNumLote($event: any) {
    //a variavel valorSerie é mesmo que livrete
    var valorSerie = $event.target.value;
    // this.isLoading = true;
    console.log(valorSerie)
    this.loteArmas
      .listar({ search: valorSerie })
      .pipe(finalize((): void => {}))
      .subscribe((response) => {
        //verificar VALO PELO NUEMRO Da arma
        var nome = response.map((p: any) => {
          if (p.serie == valorSerie) {
            this.isExiste = true;
          } else if (p.serie != valorSerie) {
            this.isExiste = false;
          }
        });
      });
  }

  //adicionar arma no lote
  public addArma() {
    this.form.value.lote_id = this.idd;
    this.form.value.serie = this.serieArma;
    console.log(this.form.value.livrete.length);
    if (!this.form.value.livrete.includes(',')) {
      this.arma
        .registar(this.form.value)
        .subscribe((e) => this.actualizarPagina());
    } else {
      var arrayArma = this.removeSpace([this.form.value.livrete]);
      arrayArma.map((i) => {
        console.log(i);
        this.adicionaArma(i, this.form.value);
        // this.adicionaArma(i, this.form.value);
      });
    }
  }

  adicionaArma(num: any, data: any) {
    console.log(data);
    setTimeout(() => {
      console.log('waiting......');
    }, 1000);
    var index = 0;
    var datalist = [];
    datalist = data;
    data.livrete = num;
    console.log(datalist);
    var formdata: any = this.fillFormArma(num, data);
    this.arma.registar(formdata).subscribe((e) => this.actualizarPagina());
    console.log(formdata);

    // console.log(formdata);
  }

  public removeSpace(input: any) {
    const result = input.map((item: any) => {
      if (item == ' ') return item.split(' ');
      return item.split(',');
    });
    return this.removeDoubleValue(result);
  }
  public removeDoubleValue(listDese: any) {
    const uniqueDesejado = [
      ...new Set(
        listDese.filter((i: any) => i !== null || i !== '' || i !== ' ')
      ),
    ];
    return uniqueDesejado;
  }

  private fillFormArma(num: any, form: any = null) {
    form = {
      livrete: num,
      descricao: form?.descricao,
      serie: form?.serie,
      modelo_id: form?.modelo_id,
      marca_arma_id: form?.marca_arma_id,
      processo: form?.processo,
      tipo_armas_id: form?.tipo_armas_id,
      calibre_arma_id: form?.calibre_arma_id,
      pai_id: form?.pai_id,
      ano_fabrico: form?.ano_fabrico,
      local: form?.local,
      estado_entrega: form?.estado_entrega,
      nome: form?.nome,
      created_at: form?.created_at,
      lote_id: form?.lote_id,
      categoria: 1,
      classificacao_arma_id: 3,
    };

    return form;
  }

  public recarregar() {
    window.location.reload();
  }

  private actualizarPagina() {
    this.removerModal();
    this.onSucess.emit({ success: true });
     this.formulario.reset();
     this.getFileToUpload = null;
    this.buscarArmas();
  }
  //nao julgue o meu codigo
  public async pegarFicheiroCaminho(id: any | number, caminho: any) {
    var op = {
      pessoaId: id,
      url: caminho,
    };
    this.username = 'Guia_de_lote_feito_por_user_' + op.pessoaId;
    this.fileservice.getFile(op).subscribe({
      next: (files) => {
        //this.getPathCaminho = this.fileservice.createImageBlob(file)
        let file: any =
          'http://127.0.0.1' +
          ':' +
          server_config.port +
          environment.api_url_by_version +
          '/files?' +
          'PessoaId=' +
          op.pessoaId +
          '&url=' +
          op.url;
        this.getPathCaminho =
          this.sanitizer.bypassSecurityTrustResourceUrl(file);
      },
    });
  }

  public baixarFile(url: any) {
    console.log(url);
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }
}
