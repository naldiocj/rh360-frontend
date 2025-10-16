import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CalibreService } from '../../core/service/calibre.service';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { PaisService } from '@core/services/Pais.service';
import { ModeloService } from '../../core/service/modelo.service';
import { TiposArmasService } from '../../core/service/tipos-armas.service';
import { ClassificacaoArmasService } from '../../core/service/classificacao-armas.service';
import { MarcasArmasService } from '../../core/service/marcas-armas.service';
import { ModalService } from '@core/services/config/Modal.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { MunicoesService } from '../../core/municoes.service';
import { EntidadesService } from '../../core/entidades.service';
import { error } from 'jquery';
import { IziToastService } from '@core/services/IziToastService.service';
import { AtribuirMunicoesService } from '../../core/atribuir-municoes.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { HelpingService } from '../../core/helping.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-municoes',
  templateUrl: './municoes.component.html',
  styleUrls: ['./municoes.component.css'],
})
export class MunicoesComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  dados: any = [];
  id!: any;
  public selecionado: any = false;
  public tiposMunicoes: Array<Select2OptionData> = [
    { id: '1', text: 'Bala' },
    { id: '2', text: 'Cartucho' },
    { id: '3', text: 'Granada' },
    { id: '4', text: 'Morteiro' },
    { id: '5', text: 'Foguete' },
    { id: '6', text: 'Rifle' },
    { id: '7', text: 'Pistola' },
    { id: '8', text: 'Escopeta' },
    { id: '9', text: 'Melhadora' },
  ];

  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id:""
  };
  showATs = true;
  public getFileToUpload: any;
  public func: any;
  public arma: any = [];
  color!: string;
  public formdata = new FormData();
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  menu_escolha!: FormControlName;
  aux: any;
  pos: any = {};
  lista: any = {};
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  setorgao:any;
  public calibres: Array<Select2OptionData> = [];
  public entidade: Array<Select2OptionData> = [];
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
 public getPathCaminho:any;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
protected is!:number
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
    private municoes: MunicoesService,
    private ent: EntidadesService,
    private toast: IziToastService,
    private AtMunicoes: AtribuirMunicoesService,
    private agenteOrgaoService: AgenteOrgaoService,
    private help:HelpingService,
    private users:AuthService

  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
        this.is=this.help.isUser
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.buscarArmas();
    this.modal();
    this.criarForm();
    this.buscarPais();
    this.buscarModelo();
    this.buscarTipo();
    this.buscarMarca();
    this.buscarClassificacao();
    this.buscarCalibre();
    this.buscarEntidade();
    this.selecionarOrgaoOuComandoProvincial();


    if (this.arma.estado != 'NA') {
      this.color = 'red';
    } else {
      this.color = 'green';
    }
  }
  editar() {
    this.municoes.actualizar(this.pos, this.form.value).subscribe((e) => this.recarregarPagina());
  }

  public setId(id: any) {
    this.id = id;
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

  private buscarEntidade() {
    this.ent
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.entidade = res.map((p: any) => ({ id: p.id, text: p.nome }));
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

  private fillForm(data: any) {
    this.form.patchValue({
      classificacao_id: data.classificacao_id,
      descricao: data.descricao,
      serie: data.serie,
      tipo_id: data.tipo_id,
      marca_id: data.marca_id,
      calibre_id: data.calibre_id,
      pais: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      entidade_id: data.entidade_id,
    });
  }

  public SetOrgao($e: any) {
    this.selecionarAgente(this.formAt.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.formAt.value.orgao_id);
  }

  private criarForm() {
    this.form = this.fb.group({
      classificacao_id: ['', Validators.required],
      descricao: ['', Validators.required],
      serie: ['', Validators.required],
      tipo_id: ['', Validators.required],
      marca_id: [''],
      calibre_id: ['', Validators.required],
      pais: ['', Validators.required],
      ano_fabrico: ['', Validators.required],
      entidade_id: [''],
    });

    this.formAt = this.fb.group({
      descricao: ['N/S', Validators.required],
      municoes_id: [''],
      ficheiro: ['', Validators.required],
      estado: ['AT'],
      pessoa_id: [''],
      orgao_id: [''],
      num_despacho:['1']

    });
  }

  public onsubmit() {
  console
    this.municoes.registar(this.form.value).subscribe((e) => console.log(e));
    setInterval(() => location.reload(), 1000);
  }
  private buscarArmas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.municoes
      .listar(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.arma = response.data;
        console.log(response)
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
    // window.location.reload();

  }

  submeterDataDirecao() {
    this.formdata.append('descricao', this.formAt.value.descricao);
    this.formdata.append('orgao_id', this.formAt.value.orgao_id);
    this.formdata.append('pessoa_id', this.pos);
    this.formdata.append('estado', this.formAt.value.estado);
    this.formdata.append('ficheiro', this.getFileToUpload);
    this.formdata.append('municoes_id', this.id);
    this.formdata.append('num_despacho', this.formAt.value.num_despacho);

  }

  public registarMunicoes() {
   

    this.submeterDataDirecao();
    this.formAt.value.municoes_id=this.id

    this.AtMunicoes.registar(this.formdata).subscribe({
      next:()=>{
      this.actualizarPagina()
      }

    });
    console.log(this.formdata);
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

  public get armaId() {
    return this.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  modal() {
    this.modall.fechar('btn-classificacao');
  }

  public nullCalibre() {
    this.dados = null;
  }

  public setobj(item: any) {
    this.fillForm(item);
    this.pos = item.id;
  }

  public delete_(id: any) {
    this.carregando = false;
    this.municoes
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          this.removerModal();
          this.recarregarPagina();
        },
      });
  }

  selecionarOrgaoOuComandoProvincial(): void {
    this.direcaoOuOrgaoService.listarTodos([]).subscribe((res) => {
      this.direcaoOuOrgao = res.map((item: any) => ({
        id: item.id,
        text: `${(item.sigla, ' - ', item.nome_completo)}`,
      }));
    });

    this.selecionarAgente([], []);
  }
  unsetAgente() {
    this.formAt.value.pessoa_id = null;
    this.showATs = true;
  }

  setAgente(event: any) {
  this.pos = event;
    this.formAt.value.pessoa_id = event;
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


  public getFile($event: any) {
    var ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      this.getFileToUpload = ficheiro.files[0];
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      this.actualizarPagina();
      throw error('File big');
    }
    console.log(this.GetFile.name);
  }
  private get GetFile() {
    return this.getFileToUpload;
  }

  public actualizarPagina() {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  public setFileInfo(id:any,url:any){
  this.getPathCaminho = this.help.pegarFicheiroCaminho(id,url);
  }

  public baixarFile(url:any){
    console.log(url)
  window.open(url.changingThisBreaksApplicationSecurity,"_blank")
  }
}
