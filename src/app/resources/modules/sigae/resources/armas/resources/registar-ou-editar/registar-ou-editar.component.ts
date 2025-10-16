import { Pagination } from './../../../../../../../shared/models/pagination';
import { ModalService } from '@core/services/config/Modal.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PaisService } from '@core/services/Pais.service';
import { ArmaService } from '@resources/modules/sigae/core/service/arma.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { LoteArmasService } from '@resources/modules/sigae/core/lote-armas.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { error } from 'jquery';
import { IziToastService } from '@core/services/IziToastService.service';

@Component({
  selector: 'app-registar-ou-editar-arma',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public element: any;
  public valorSerie!: string;
  public form!: FormGroup;
  public formAt!: FormGroup;
  public verEnty: any = false;
  public formulario!: FormGroup;
  public classe: string = 'classes';
  public menu_escolha!: FormControlName;
  public selecionado: any = true;
  public pagination = new Pagination();
  public totalBase: any;
  public aux: any;
  fileUpload: any;
  public crime!: boolean;
  public isExiste: boolean = false;
  public idd!: number;
  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  public atDir!: FormGroup;

  //variaveis que controlam o aparecimento da arma classificacao
  pos: boolean = false;
  desc: boolean = false;
  rec: boolean = false;
  alo: boolean = false;
  emp: boolean = false;
  org: boolean = false;
  public showValue = true;
  pegarClasse: number = 1;
  public calibres: Array<Select2OptionData> = [];
  public mostra_entidades: any;
  public marcas: Array<Select2OptionData> = [];
  public modelos: Array<Select2OptionData> = [];
  public tipos: Array<Select2OptionData> = [];
  public class: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  public classes: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> = [];
  public carregando: boolean = false;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  public Tipolistar: Array<Select2OptionData> = [
    { id: 'Interior de residencia', text: 'Interior de residencia' },
    { id: 'Vía pública', text: 'Vía pública' },
    { id: 'Interior do estabelecimento', text: 'Interior do estabelecimento' },
  ];
  public TipoUsoArma: Array<Select2OptionData> = [
    { id: 'Defesa Pessual', text: 'Defesa Pessoal' },
    { id: 'uso de Guerra', text: 'uso de Guerra' },
  ];
  public estadoAr: Array<Select2OptionData> = [
    { id: 'Bom', text: 'Bom' },
    { id: 'Antigo', text: 'Antigo' },
    { id: 'Desaparecida', text: 'Desaparecida' },
    { id: 'Mal', text: 'Mal' },
  ];
  protected is!: number;
  public fillSerie: any;
  public getLotes: any;
  constructor(
    private entidades: EntidadesService,
    private pa: UtilService,
    private fb: FormBuilder,
    private armasService: ArmaService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private tipoService: TiposArmasService,
    private modall: ModalService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private agenteOrgaoService: AgenteOrgaoService,
    private at: AtribuicaoArmasService,
    private loteArmas: LoteArmasService,
    private getPushedValue: HelpingService,
    private toast: IziToastService
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.modal();
    this.criarForm();
    this.buscarClassificacao();
    this.buscarPais();
    this.inicio();
    this.is = this.getPushedValue.isUser;
  }

  public setForm(data: any | object) {
    this.fillForm(data);
  }

  public inicio() {
    this.entidades
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res) => {
          this.mostra_entidades = res.map((p: any) => ({
            id: p.id,
            text: p.nome,
          }));
        },
      });
  }
  //preencher quando adicionarem um numero da arma
  public setSerie($event: any) {
    //a variavel valorSerie é mesmo que livrete
    this.valorSerie = $event.target.value;
    // this.isLoading = true;
    this.armasService
      .listar({ search: this.valorSerie })
      .pipe(finalize((): void => {}))
      .subscribe((response) => {
        //verificar VALO PELO NUEMRO Da arma
        var nome = response.map((p: any) => {
          if (p.livrete == this.valorSerie) {
            this.isExiste = true;
          } else if (p.livrete != this.valorSerie) {
            this.isExiste = false;
          }
        });
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

  public buscarModelo($event: any) {
    if ($event != null || $event != undefined) {
      this.modeloService
        .listar({ marca_id: $event })
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (res) => {
            this.modelos = res.map((p: any) => ({ id: p.id, text: p.nome }));
          },
        });

      $event = null;
      console.log($event);
    }
  }

  public buscarMarca($event: any) {
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

  public buscarTipo($event: any) {
    this.tipoService.listar({}).subscribe({
      next: (res) => {
        this.tipos = res.map((p: any) => ({ id: p.id, text: p.nome }));
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
  public buscarCalibre($event: any) {
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

  private criarForm() {
    this.form = this.fb.group({
      livrete: ['', Validators.required],
      classificacao_arma_id: ['', Validators.required],
      descricao: ['', Validators.required,],
      serie: ['', Validators.required],
      modelo_id: ['', Validators.required],
      tipo_armas_id: ['', Validators.required],
      processo: ['N/S'],
      categoria: ['', Validators.required],
      marca_arma_id: ['', Validators.required],
      calibre_arma_id: ['', Validators.required],
      pai_id: [1],
      ano_fabrico: ['N/S'],
      local: ['N/S'],
      estado_entrega: ['N/S'],
      estado_arma: [''],
      nome: ['DL-Logistica', Validators.maxLength(22)],
      lote_id: [null],
      created_at: new Date(),
    });

    this.formAt = this.fb.group({
      descricao: ['', Validators.required, Validators.maxLength(15)],
      situacao: [''],
      orgao_id: [''],
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      documento: ['N/S'],
      arma_id: ['', Validators.required],
      pessoa_id: ['', Validators.required],
    });

    this.atDir = this.fb.group({
      nome: ['', Validators.maxLength(20)],
      quantidade: [''],
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      documento: ['N/S'],
      lote: [''],
      descricao: ['', Validators.maxLength(25)],
      estado: ['AT'],
    });
  }
  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  //guadar dados
  public onSubmit() {
    var fd = new FormData();
    this.form.value.categoria == null ? 1 : this.form.value.categoria;

    fd.append('livrete', this.form.value.livrete);
    fd.append('classificacao_arma_id', this.form.value.classificacao_arma_id);
    fd.append('descricao', this.form.value.descricao);
    fd.append('serie', this.form.value.serie);
    fd.append('modelo_id', this.form.value.modelo_id);
    fd.append('tipo_armas_id', this.form.value.tipo_armas_id);
    fd.append('processo', this.form.value.processo);
    fd.append('categoria', this.form.value.categoria);
    fd.append('marca_arma_id', this.form.value.marca_arma_id);
    fd.append('calibre_arma_id', this.form.value.calibre_arma_id);
    fd.append('pai_id', this.form.value.pai_id);
    fd.append('ano_fabrico', this.form.value.ano_fabrico);
    fd.append('local', this.form.value.local);
    fd.append('estado_entrega', this.form.value.estado_entrega);
    fd.append('estado_arma', this.form.value.estado_arma);
    fd.append('nome', this.form.value.nome);
    fd.append('lote_id', this.form.value.lote_id);
    fd.append('created_at', this.form.value.created_at.toISOString()); // Convertendo a data para string
    fd.append('foto_arma', this.fileUpload);

    this.armasService.registar(this.form.value).subscribe((e) => {
      this.onSucess.emit({ success: true });
      this.removeModal();
    });
    
    fd.forEach(function(val, key, fD){
      fd.delete(key)
      });
      
    // setInterval(() => location.reload(), 500);
  }

  //modificando as informacoes de  uma arma
  public editar() {
    this.carregando = true;

    this.armasService.actualizar(this.armaId, this.form.value).subscribe({
      next: (p) => {
        console.log('done!');
        console.log(p);
      },
    });
    // setInterval(() => window.location.reload(), 1000);
    this.onSucess.emit({ success: true });
  }

  public resetForm = (): void => {
    this.form.reset();
    this.fillForm([]);
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get armaId() {
    return this.element?.id;
  }

  public fechar() {
    this.onSucess.emit({ success: true });
  }

  public setId(id: any) {
    this.armasService
      .um(id)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.fillForm(res);
        },
      });
    this.carregando = true;
  }

  private fillForm(data: any) {
    this.form.patchValue({
      livrete: data.livrete,
      classificacao_arma_id: data.classificacao_id,
      descricao: data.descricao,
      serie: data.serie,
      tipo_armas_id: data.tipo_armas_id,
      modelo_id: data.tipo_id,
      processo: data.processo,
      categoria: data.categoria,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      nome: 'Logistica',
      lote_id: data.lote_id,
    });
  }

  //fiz um copy por causa do formulario e atribuo classe
  //para preencher quando for passado um numero da arma
  private fillAgainForm(data: any) {
    this.form.patchValue({
      livrete: data.livrete,
      classificacao_arma_id: this.pegarClasse,
      descricao: data.descricao,
      serie: data.serie,
      tipo_armas_id: data.tipo_armas_id,
      modelo_id: data.tipo_id,
      processo: data.processo,
      categoria: data.categoria,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      local: data.local,
      nome: data.nome,
    });
  }

  modal() {
    this.modall.fechar('btn-classificacao');
    var data: any = {
      created_at: new Date().getTimezoneOffset(),
    };
    //   console.log(data);
  }
  //listagem de classificacoes
  public lista(event: any) {
    var nome = this.form.value.classificacao_arma_id;
    this.buscarTipo(event);
    this.pegarClasse = nome;

    if (nome != '') {
      //envolvidas em crimes
      if (nome == 1) {
        this.selecionado = false;
        this.pos = true;
        this.emp = false;
        this.verEnty = false;
        this.desc = false;
        this.rec = false;
        this.alo = false;
      }

      //entrada voluntaria
      if (nome == 2) {
        this.selecionado = false;
        this.desc = true;
        this.verEnty = false;
        this.rec = false;
        this.pos = false;
        this.emp = false;
        this.alo = false;
      }

      //recolha coersivas
      if (nome == 4) {
        this.selecionado = false;
        this.alo = false;
        this.verEnty = false;
        this.rec = true;
        this.pos = false;
        this.desc = false;
        this.emp = false;
      }

      //estraviadas
      if (nome == 5) {
        this.selecionado = false;
        this.rec = false;
        this.pos = false;
        this.verEnty = false;
        this.desc = false;
        this.alo = true;
        this.emp = false;
      }
      //convenio com as faa
      if (nome == 6) {
        this.selecionado = false;
        this.verEnty = true;
        this.rec = false;
        this.pos = false;
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
        this.verEnty = false;
        this.rec = false;
        this.pos = false;
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
        this.verEnty = false;
        this.rec = false;
        this.pos = false;
        this.desc = false;
        this.alo = false;
        this.emp = true;
        this.org = false;
      }
    }
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
            text: p.nome_completo,
          }));
        },
      });
  }

  passar() {
    this.at
      .registar(this.formAt.value)
      .pipe()
      .subscribe((e) => null);
    this.onSucess.emit({ success: true });
    this.removeModal();
  }

  fazerAtPORdir() {
    this.loteArmas.registar(this.atDir.value).subscribe((e) => null);
    //this.armasService.actualizar(1, "estado:'AT'").subscribe((e) => null);
    this.onSucess.emit({ success: true });
    this.removeModal();
  }

  filtrar(id: number) {
    var ex = this.armasService.listar(id).subscribe((e) => console.log(e));
  }

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

  public get getDate(): any {
    //dd/mm/yy
    return this.pa.dataActual;
  }
}
