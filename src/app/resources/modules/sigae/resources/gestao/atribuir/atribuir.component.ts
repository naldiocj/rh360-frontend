import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { PaisService } from '@core/services/Pais.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { RespostasService } from '@resources/modules/sigae/core/respostas.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { ArmaService } from '@resources/modules/sigae/core/service/arma.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { error, isArray } from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-atribuir',
  templateUrl: './atribuir.component.html',
  styleUrls: ['./atribuir.component.css'],
})
export class AtribuirComponent implements OnInit {
  formAt!: FormGroup;
  public arma: any = [];
  public pagination = new Pagination();
  public totalBase: number = 0;
  public id: any;
  public pegarClasse: any;
  public fileUpload: any;
  public carregando: boolean = false;
  public func: any;
  formRes!: FormGroup;
  form!: FormGroup;
  public direcaoOuOrgao: any;
  formData = new FormData();
  dataDate = new Date();
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
    estadoArma: 'AT',
    armaId: '',
  };
  public atribuidos!: number;
  public listar_armas: any;
  public estado = false;
  public situacao = [];
  public his: any;
  public pos: any | number;
  setorgao: any;
  public objHis: any;
  public formdata: any;
  public datas: any;
  public getPathCaminho: any;
  public calibres: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'comando Provincial', text: 'Comando Provincial' },
    { id: 'orgao', text: 'Orgão Central' },
  ];
  options = {
    placehlder: 'selecione uma opção',
    width: '100%',
  };
  showATs = true;
  DataFull: any;
  protected is!: number;
  constructor(
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private tipoService: TiposArmasService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private armas: AtribuicaoArmasService,
    private direcao: DirecaoOuOrgaoService,
    private agentes: AgenteOrgaoService,
    private armaservice: ArmaService,
    private fb: FormBuilder,
    private help: HelpingService,
    private reply: RespostasService,
    private toast: IziToastService,
    private users: AuthService
  ) {}

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarSeries();
    this.startForm();
    this.recarregarPagina();
    this.Buscar_atribuidas();
    this.buscarArmass();
    this.selecionarOrgaoOuComandoProvincial();
  }

  private buscarArmass() {
    this.filtro.estadoArma = 'AT';
    console.log(this.filtro);
    const options = { ...this.filtro };
    this.armas.listar(options).subscribe((response) => {
      this.arma = response.data;
      console.log(this.arma);
      this.pagination = this.pagination.deserialize(response.meta);

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  listar(data: any) {
    this.arma = data;
  }

  public oculto(id: number) {
    if (this.filtro.perPage <= 20) this.filtro.perPage = 10;
    console.log(id);
    const options = { ...this.filtro, estadoArma: 'NA', armaId: id };
    this.armas
      .listar(options)
      .pipe()
      .subscribe((response: any) => {
        this.objHis = response.data;
        console.log(this.objHis);
        console.log(response);
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
          console.log(res);
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

  editar(data: any) {
    this.fillform(data);
    this.estado = true;
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarArmass();
    this.nullCalibre();
  }

  startForm() {
    this.formAt = this.fb.group({
      orgao_id: [''],
      pessoa_id: [''],
      arma_id: [''],
      situacao: ['', Validators.maxLength(35)],
      descricao: ['', Validators.maxLength(15)],
      estado: 'NA',
      created_at: new Date(),
    });

    this.form = this.fb.group({
      livrete: [''],
      classificacao_arma_id: [''],
      descricao: [''],
      serie: [''],
      modelo_id: [''],
      marca_arma_id: [''],
      tipo_armas_id: [''],
      calibre_arma_id: [''],
      pai_id: [''],
      ano_fabrico: [''],
      categoria: [''],
      estado: [''],
    });

    this.formRes = this.fb.group({
      titulo: ['', Validators.required],
      resposta: ['', Validators.required],
      ficheiro: [''],
      orgao_id: [''],
    });
  }

  public pegarFile($event: any) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File too  big');
    }
  }

  public get GetFile() {
    return this.fileUpload;
  }

  //formulario para voltar a cadastar um usuario
  fillform(data: any) {
    this.pos = data.arma_id;
    this.formAt.patchValue({
      orgao_id: ['', Validators.required],
      pessoa_id: ['', Validators.required],
      arma_id: data.arma_id,
      situacao: data.situacao,
      descricao: data.descricao,
      estado: data.estado,
      created_at: new Date(),
    });
  }


 

  verHis(data: any) {
    //numero de serie que vai ser comparado com outro da listagem
    this.his = data.serie;
    console.log(data);
  }
  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarArmass();

    console.log($e);
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
    this.pos = id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.armas
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

  extraviara() {
    console.log(this.pos);
    var formData = new FormData();
    formData.append('id', this.pos);
    formData.append('livrete', this.form.value.livrete);
    formData.append('classificacao_arma_id', '5');
    formData.append('descricao', this.form.value.descricao);
    formData.append('serie', this.form.value.serie);
    formData.append('modelo_id', this.form.value.modelo_id);
    formData.append('marca_arma_id', this.form.value.marca_arma_id);
    formData.append('calibre_arma_id', this.form.value.calibre_arma_id);
    formData.append('pai_id', this.form.value.pai_id);
    formData.append('estado', 'NA');
    formData.append('ano_fabrico', this.form.value.ano_fabrico);
    formData.append('categoria', this.form.value.categoria);
    formData.append('foto_arma', this.fileUpload);
    // this.setForm();
    //arma service
    this.armaservice.actualizar(this.pos, formData).subscribe({
      next: () => {
        
        //armas atribuidas
        this.objHis.estado = 'NA';
        this.armas.actualizar(this.objHis.id, this.objHis).subscribe({
          next: () => {
            console.log('done!....');
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
        });
      },
    });
  }


  removerArma() {
    console.log(this.pos);
    var formData = new FormData();
    formData.append('id', this.pos);
    formData.append('livrete', this.form.value.livrete);
    formData.append('classificacao_arma_id', '3');
    formData.append('descricao', this.form.value.descricao);
    formData.append('serie', this.form.value.serie);
    formData.append('modelo_id', this.form.value.modelo_id);
    formData.append('marca_arma_id', this.form.value.marca_arma_id);
    formData.append('calibre_arma_id', this.form.value.calibre_arma_id);
    formData.append('pai_id', this.form.value.pai_id);
    formData.append('estado', 'NA');
    formData.append('ano_fabrico', this.form.value.ano_fabrico);
    formData.append('categoria', this.form.value.categoria);
    formData.append('foto_arma', this.fileUpload);
    // this.setForm();
    //arma service
    this.armaservice.actualizar(this.pos, formData).subscribe({
      next: () => {
        
        //armas atribuidas
        this.objHis.estado = 'NA';
        this.objHis.created_at = new Date();
        this.armas.actualizar(this.objHis.id, this.objHis).subscribe({
          next: () => {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
        });
      },
    });
  }


  selecionarOrgaoOuComandoProvincial(): void {
    this.direcao.listarTodos([]).subscribe((res) => {
      this.direcaoOuOrgao = res.map((item: any) => ({
        id: item.id,
        text: item.nome_completo,
      }));

      console.log(res)
    });

    // setTimeout(() => {
    //   this.recarregarPagina();
    // }, 1000);

  
      this.selecionarAgente([], []);

  }

  fillForm(data: any,classe = 5) {
    console.log(data);
    this.form.patchValue({
      livrete: data.livrete,
      id: data.id,
      classificacao_arma_id:classe,
      descricao: [''],
      serie: data.serie,
      tipo_armas_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      modelo_id: data.modelo_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      categoria: data.categoria,
      estado: 'NA',
    });
  }

  public selecionarAgente(event: any, $e: any = null) {
    this.filtro.search = $e;
    let data = {
      ...this.filtro,
      pessoajuridica_id: event,
      perPage:4
    };
    this.agentes.verAgenteOrgao(data).subscribe((res) => {
      this.func = res.data;
      console.log(this.func)
    });
  }

  Buscar_atribuidas() {
    this.armas.filtrar().subscribe((response: any): void => {
      var nome = response.map((aux: any) => {
        this.atribuidos = aux.arma_id;
      });
    });
  }

  buscarSeries() {
    var IdArma = 0;
    this.armaservice.filtrar().subscribe((response: any): void => {
      var dat = response.map((aux: any) => {
        this.dataSelect(response);
      });
    });
  }

  dataSelect(p: any) {
    this.listar_armas = p.map((p: any) => ({
      id: p.id,
      text: p.livrete + '-' + p.tipo_arma,
    }));
    this.arma = p;
  }

  public SetOrgao($e: any) {
    this.selecionarAgente(this.formAt.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.formAt.value.orgao_id);
  }

  public atribuir() {
    //  this.SetFormAtribuir()
    console.log(this.formAt.value);

    let dataf = new FormData();
    dataf.append('orgao_id', this.formAt.value?.orgao_id);
    dataf.append('pessoa_id', this.id);
    dataf.append('arma_id', this.formAt.value?.arma_id);
    dataf.append('estado', this.formAt.value?.estado);
    dataf.append('situacao', this.formAt.value?.situacao);
    dataf.append('descricao', this.formAt.value?.descricao);
    dataf.append('created_at', this.formAt.value?.created_at);
    dataf.append('ficheiro', this.GetFile);

    console.log(dataf);
    this.armas.registar(dataf).subscribe({
      next: () => {
        this.removeModal();
        this.recarregarPagina();
        window.location.reload();

        this.formAt.reset();
      },
      error: () => {
        console.error('error');
      },
    });
  }

  public getFileInformation(id: any = null, Url: any = null) {
    var url;
    url = Url;
    this.getPathCaminho = this.help.pegarFicheiroCaminho(id, url);
  }
  public baixarFile(url: any) {
    window.open(url, '_blank');
  }
  unsetAgente() {
    this.id = null;
    this.formAt.value.pessoa_id = null;
    this.showATs = true;
  }

  public estraviar(event: any) {
    this.pos = event.arma_id;
    this.objHis = event;

    console.log(event);
    // this.setForm(event);
    this.armaservice.um(event.arma_id).subscribe({
      next: (res) => {
        this.fillForm(res[0]);
      },
    });

    // this.buscarArmass();
  }


  public setIdRemover(event:any){
    this.pos = event.arma_id;
    this.objHis = event;
    this.armaservice.um(event.arma_id).subscribe({
      next: (res) => {
        this.fillForm(res[0],3);
      },
    });
  }

  setAgente(event: any) {
    this.id = event;
    this.formAt.value.pessoa_id = event;
    this.showATs = false;
    console.log(event);
  }

  public getItem(item: object | any) {
    this.pegarClasse = item;
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
    this.reply.registar(this.formData).subscribe((e) => e);
    this.removeModal();
    this.formRes.reset();
  }
}
