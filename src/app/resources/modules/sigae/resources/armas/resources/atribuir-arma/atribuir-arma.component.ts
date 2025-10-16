import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IziToastService } from '@core/services/IziToastService.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '@resources/modules/sigae/core/service/atribuicao-armas.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { error } from 'jquery';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-atribuir-arma',
  templateUrl: './atribuir-arma.component.html',
  styleUrls: ['./atribuir-arma.component.css'],
})
export class AtribuirArmaComponent implements OnInit {
  public checkedArray: any = new Set();
  public showCategoria: boolean = false;
  public verEnty: any = false;
  public istrue: any;
  public index = 0;
  @Input() id!:any;
  public count = 0;
  public object: any;
  public status: any;
  public atDir!: FormGroup;
  public takeClasse: any;
  public form!: FormGroup;
  public formInfo!: FormGroup;
  public formAt!: FormGroup;
  public formulario!: FormGroup;
  filtro = {
    page: 1,
    perPage: 6,
    search: '',
    orgao_id: '',
    arma_id: '',
  };
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
  public options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
    height: '100%',
    search: '',
    class:'w-auto h-auto'
  };
  public direcaoOuOrgao!: Array<Select2OptionData>;
  public func!: any;
  public carregando: boolean = false;
  public fileUpload: any;
  public fileUploadGuia: any;
  public formDevolver!: FormGroup;
  private formData = new FormData();
  public verDesconhecido: any;
  constructor(
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private agenteOrgaoService: AgenteOrgaoService,
    private toast: IziToastService,
    private at: AtribuicaoArmasService,
    private fb:FormBuilder
  ) {}

  ngOnInit(): void {
this.iniciarForm();
this.selecionarOrgaoOuComandoProvincial();
  }



  public iniciarForm(){

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
          descricao: ['entrega de armas'],
          estado: ['AT'],
          sem_orgao_id: ['N/S'],
          sem_pessoa_id: ['N/S'],
          ficheiro: ['N/S'],
          num_despacho: ['N/S'],
          arma_id: this.IDpegado,
          created_at: new Date(),
        });
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

  public SetOrgao($e: any) {
    this.selecionarAgente(this.formAt.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.formAt.value.orgao_id);
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
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
      console.log(res)
    });

    setTimeout(() => {
      this.recarregarPagina();
    }, 1000);

    this.selecionarAgente([], []);
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
  }

  public recarregar() {
    window.location.reload();
  }

  public limparOrgao() {
    this.direcaoOuOrgao = [];
    this.selecionarOrgaoOuComandoProvincial();
  }

  unsetAgente() {
    this.id = 0;
    this.formAt.value.pessoa_id = null;
    this.formDevolver.value.pessoa_id = null;
    this.showATs = true;
  }

  setAgente(event: any) {
    this.id = event;
    this.formAt.value.pessoa_id = event;
    this.formDevolver.value.pessoa_id = event;
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

  public get(id: any) {
    this.IDpegado = id;
    this.id = id;
    console.log(id);
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
      next: () => {
        this.actualizarPagina();
      },
    });

    if (this.checkedArray.length != 0) {
      var lista_de_Valor = this.removerDuplicados(this.checkedArray);
      if (lista_de_Valor) {
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
    this.at.registar(this.formData).subscribe({
      next: () => {
        this.actualizarPagina();
      },
    });

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

  protected get GetFile() {
    return this.fileUpload == null ? 'N/S' : this.fileUpload;
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

  protected get GetFileGuia() {
    return this.fileUploadGuia == null ? 'N/S' : this.fileUploadGuia;
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

  //adicionado itens selecionados na base de dados pelo id
  private addItemDir(vector: any) {
    const val = vector.map((i: any) => {
      var a = (this.atDir.value.arma_id = i);
      this.at.registar(this.atDir?.value).subscribe((e) => null);
    });
    this.actualizarPagina();
  }

  private actualizarPagina() {
    this.removeModal();
    // this.buscarDetalhes([]);
    setInterval(() => {
      window.location.reload();
    }, 700);
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
}
