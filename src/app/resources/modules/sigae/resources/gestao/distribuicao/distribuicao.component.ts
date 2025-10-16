import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { AtribuirLotesService } from '@resources/modules/sigae/core/atribuir-lotes.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { LoteArmasService } from '@resources/modules/sigae/core/lote-armas.service';
import { RespostasService } from '@resources/modules/sigae/core/respostas.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { error } from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-distribuicao',
  templateUrl: './distribuicao.component.html',
  styleUrls: ['./distribuicao.component.css'],
})
export class DistribuicaoComponent implements OnInit {
  formAt!: FormGroup;
  formRes!: FormGroup;
  public showEntidade: any;
  public condicion: any;
  public arma: any = [];
  public pagination = new Pagination();
  public totalBase: number = 0;
  public id: any;
  public carregando: boolean = false;
  public func: any;
  public direcaoOuOrgao: any;
  public his: any;
  public getPathCaminho: any;
  dataDate = new Date();
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id:''
  };
  public atribuidos: any;
  public lotesI: any;
  public username!: string;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];
  options: any = {
    placehlder: 'selecione uma opção',
    width: '100%',
  };
  DataFull: any;
  fileUpload: any;
  pegarClasse: any;
  protected is!: number;
  formData = new FormData();
  constructor(
    private armasservice: AtribuicaoArmasService,
    private armas: LoteArmasService,
    private armalotes: AtribuirLotesService,
    private direcao: DirecaoOuOrgaoService,
    private agentes: AgenteOrgaoService,
    private fb: FormBuilder,
    private help: HelpingService,
    private toast: IziToastService,
    private reply: RespostasService,
    private users:AuthService
  ) {}
  ngOnInit(): void {
     this.is = this.help.isUser;
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.buscarCalibres();
    this.recarregarPagina();
    this.buscarSeries();
    this.startForm();
   

  }

  private buscarCalibres() {
    const options = { ...this.filtro };
    // this.isLoading = true;
    this.armalotes
      .listar(options)
      .pipe()
      .subscribe((response) => {
        console.log(response);
        this.arma = response.data;
        this.pagination = this.pagination.deserialize(response.meta);

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  startForm() {
    this.formAt = this.fb.group({
      orgao_id: ['', Validators.required],
      situacao: ['', Validators.required],
      descricao: ['',Validators.maxLength(15)],
      lote_id: [''],
      estado: ['NA'],
      created_at: this.dataDate.toLocaleString(),
    });

    this.formRes = this.fb.group({
      titulo: ['', Validators.required],
      resposta: ['', Validators.required],
      ficheiro: [''],
      orgao_id: [''],
    });
  }
  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarCalibres();
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

    this.buscarCalibres();
  }

  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
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

  selecionarOrgaoOuComandoProvincial($event: any): void {
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcao.listarTodos(opcoes).subscribe((response: any): void => {
      this.direcaoOuOrgao = response.map((item: any) => ({
        id: item.id,
        text: item.sigla + ' - ' + item.nome_completo,
      }));
    });
  }

  selecionarAgente(event: any) {
    this.agentes.verAgenteOrgao({ pessoajuridica_id: event }).subscribe({
      next: (res: any) => {
        this.func = res.map((p: any) => ({
          id: p.id,
          text: p.nome + ' ' + p.apelido,
        }));
      },
    });
  }

  Buscar_atribuidas() {
    this.armas.filtrar().subscribe((response: any): void => {
      var nome = response.map((aux: any) => {
        this.his = aux.serie;
        this.atribuidos = aux.arma_id;
      });
    });
  }

  buscarSeries() {
    this.Buscar_atribuidas();
    this.armas.filtrar().subscribe((response: any): void => {
      var dat = response.map((p: any) => {
        if (this.atribuidos == p.id) {
          console.log('Não é possivel passa o id:' + p.arma_id);
        } else {
          this.dataSelect(response);
        }
      });
    });
  }

  dataSelect(dados: any) {
    this.lotesI = dados.map((p: any) => ({
      id: p.id,
      text: p.serie + '-' + p.tipo,
    }));
  }

  atribuir_lote() {
    this.armalotes.registar(this.formAt.value).subscribe((e) => null);
  }

  public buscarArmasLotes(data: any) {
    const options = { ...this.filtro,lote_id:data.id};

    this.condicion = data.orgao_id;
    this.armasservice.listar(options).subscribe((e: any) => {
      this.showEntidade = e;
      console.log(e)
    });
  }
  getid(id: any) {
    this.id = id;
  }

  public getFileInformation(id: any, Url: any) {
    this.getPathCaminho = this.help.pegarFicheiroCaminho(id, Url);
  }
  public baixarFile(url: any) {
    console.log(url);
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }

  ver(cond: any) {
    if (cond) {
      return true;
    } else {
      return false;
    }
  }

  public pegarFile($event: any) {
    console.log($event.target.files);
    console.log($event.target.files[0]);

    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }

  private get GetFile() {
    return this.fileUpload;
  }

  public getItem(item: object | any) {
    this.pegarClasse = item;
    console.log(item);
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
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
