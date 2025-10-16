import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { ArmaService } from '../../core/service/arma.service';
import { finalize } from 'rxjs';
import { HelpingService } from '../../core/helping.service';
import { error } from 'jquery';
import { RespostasService } from '../../core/respostas.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-armas-convenio',
  templateUrl: './armas-convenio.component.html',
  styleUrls: ['./armas-convenio.component.css'],
})
export class ArmasConvenioComponent implements OnInit {
  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
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
  public verDesconhecido=false
  public orgaoOuComandoProvincial:any
  public entidade: any;
  public fileUpload: any;
  public pegarClasse: any;
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    tipoArma: 'Convênio com FAA',
    orgao_id:''
  };
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formRes!: FormGroup;
  formData = new FormData();
  public formAt!: FormGroup;
  protected is!: number;
  direcaoOuOrgao:any
  func:any
  constructor(
    private armas: ArmaService,
    private help: HelpingService,
    private reply: RespostasService,
    private toast: IziToastService,
    private users: AuthService,
    private direcaoOuOrgaoService:DirecaoOuOrgaoService,
    private agenteOrgaoService:AgenteOrgaoService,
    private fb:FormBuilder
  ) {}

  ngOnInit(): void {
    this.buscarArmas();
    this.is = this.help.isUser;
  }

  private buscarArmas() {
    const options = { ...this.filtro };
    this.filtro.orgao_id = this.users.orgao.sigla;
    // this.isLoading = true;
    this.armas
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.arma = response.data;
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });


      this.formRes = this.fb.group({
        titulo: ['', Validators.required],
        resposta: ['', Validators.required],
        ficheiro: [''],
        orgao_id:[""]
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarArmas();
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

  public get(id: any) {
    this.id = id;
  }
  public delete_(id: any) {
    this.armas.deletar(id).subscribe(() => this.actualizarPagina());
  }

  public actualizarPagina() {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  public obj(item: any) {
    this.fillForm(item);
  }

  public fillForm(data: any) {
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
