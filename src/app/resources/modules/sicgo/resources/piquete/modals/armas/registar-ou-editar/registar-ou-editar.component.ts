import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { PaisService } from '@core/services/Pais.service';
import { LoteArmasService } from '@resources/modules/sigae/core/lote-armas.service';
import { ArmaService } from '@resources/modules/sigae/core/service/arma.service';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { MarcasArmasService } from '@resources/modules/sigae/core/service/marcas-armas.service';
import { ModeloService } from '@resources/modules/sigae/core/service/modelo.service';
import { TiposArmasService } from '@resources/modules/sigae/core/service/tipos-armas.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-armas-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarArmaComponent implements OnInit {
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
  public crime!: boolean;
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
protected is!:number
  public fillSerie: any;
  public getLotes: any;
  constructor(
     
    private fb: FormBuilder,
    private armasService: ArmaService,
    private calibreService: CalibreService,
    private paiService: PaisService,
    private modeloService: ModeloService,
    private classService: ClassificacaoArmasService,
    private marcaService: MarcasArmasService,
    private tipoService: TiposArmasService,
    private modall: ModalService,   
    private loteArmas: LoteArmasService, 
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.modal();
    this.criarForm();
    this.buscarClassificacao();
    this.buscarPais();
    
  }

  public setForm(data: any | object) {
    this.fillForm(data);
  }

  
  //preencher quando adicionarem um numero da arma
  public setSerie($event: any) {
    //a variavel valorSerie é mesmo que livrete
    this.valorSerie = $event.target.value;
    // this.isLoading = true;
    this.armasService
      .listar({ livrte: this.valorSerie })
      .pipe(finalize((): void => {}))
      .subscribe((response) => {
        //PASSAR VALO PELO NUEMRO Da arma
        var nome = response.map((p: any) => {
          if (p.livrete == this.valorSerie) {
            if (p.processo != null || p.processo != undefined) {
              this.form.value.classificacao = p.classificacao;
              this.fillAgainForm(p);
            }
          }
        });
      });
    $event = null;
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
      descricao: ['', Validators.required],
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
      nome: ['DL-Logistica'],
      lote_id: [null],
      created_at: new Date(),
    });

    this.formAt = this.fb.group({
      descricao: ['', Validators.required],
      situacao: [''],
      orgao_id: [''],
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      documento: ['N/S'],
      arma_id: ['', Validators.required],
      pessoa_id: ['', Validators.required],
    });

    this.atDir = this.fb.group({
      nome: [''],
      quantidade: [''],
      sem_orgao_id: ['N/S'],
      sem_pessoa_id: ['N/S'],
      documento: ['N/S'],
      lote: [''],
      descricao: [''],
      estado: ['AT'],
    });
  }
  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  //guadar dados
  public onSubmit() {
    this.form.value.categoria == null ? 1 : this.form.value.categoria;
    console.log(this.form.value);
    this.armasService.registar(this.form.value).subscribe((e) => {
      this.onSucess.emit({ success: true });
        this.removeModal()
    });
    // setInterval(() => location.reload(), 500);

        this.form.reset();
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
      tipo_armas_id:data.tipo_armas_id,
      modelo_id: data.tipo_id,
      processo: data.processo,
      categoria: data.categoria,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      ano_fabrico: data.ano_fabrico,
      local: data.local,
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
      tipo_armas_id:data.tipo_armas_id,
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

      
      //estraviadas
      if (nome == 4) {
        this.selecionado = false;
        this.rec = false;
        this.pos = false;
        this.verEnty = false;
        this.desc = false;
        this.alo = true;
        this.emp = false;
      }
       
    }
  }

 

 

  fazerAtPORdir() {
    this.loteArmas.registar(this.atDir.value).subscribe((e) => null);
    //this.armasService.actualizar(1, "estado:'AT'").subscribe((e) => null);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
      this.onSucess.emit({ success: true });
      this.removeModal();

  }

  filtrar(id: number) {
    var ex = this.armasService.listar(id).subscribe((e) => console.log(e));
  }

  
}
