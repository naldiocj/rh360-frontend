import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { AquartelamentoAtribuirService } from '@resources/modules/sigae/core/aquartelamento-atribuir.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-atribuidos',
  templateUrl: './atribuidos.component.html',
  styleUrls: ['./atribuidos.component.css'],
})
export class AtribuidosComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public onSucess: any;
  public formAt: any;
  public valor: any;
  getPathCaminho: any;
  public lista_users: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  ob: any;
  func: any;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  direcaoOuOrgao: any;
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
  fileUpload: any;
  tipoMateria: number = 0;
  nomeMateria: any;
  id!: number;
  is!: number;
  materias: any = {};

  constructor(
    private help: HelpingService,
    private atribuidos: AquartelamentoAtribuirService,
    private users: AuthService,
    private direcao: DirecaoOuOrgaoService,
    private agentes: AgenteOrgaoService,
    private fb: FormBuilder
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    console.log(this.filtro);
    this.is = this.help.isUser;
    this.mostrarAtribuidosSigae();
    this.startForm();
    this.selecionarOrgaoOuComandoProvincial();
    // 0 - NENHUM
    // 1 - ESTRAVIAR
    // 2 -  EXPOLHAR
    // 3 - CRIME
  }

  startForm() {
    this.formAt = this.fb.group({
      orgao_id: [''],
      pessoa_id: [''],
      materia_id: [''],
      estado_material: [null],
      descricao: [null,Validators.required],
      estado: 'NA',
      created_at: new Date(),
    });
  }

  setTipoMaterial(obj: any, type: number = 0) {
    if (type == 0) {
      obj.estado_material = 'Normal';
      this.nomeMateria = 'Normal';
    } else if (type == 1) {
      obj.estado_material = 'Extraviando';
      this.nomeMateria = 'Extravio';

    } else if (type == 2) {
      obj.estado_material = 'Expolho';
      this.nomeMateria = 'Expolho';
    } else if (type == 3) {
      obj.estado_material = 'Crime';
      this.nomeMateria = 'Crime';

    }
    this.fillForm(obj);
  }

  public fillForm(data: any) {
    this.formAt.patchValue({
      descricao: '',
      id: data.id,
      pessoa_id: data.pessoa_id,
      materia_id: data.materia_id,
      orgao_id: data.orgao_id,
      created_at: new Date(),
      estado_material: data.estado_material,
    });
    this.valor = data.pessoa_id;

    //this.selecionarAgente(data.orgao_id, []);
  }

  public atribuir() {
    this.formAt.value.pessoa_id = this.valor;
    let dataf:any = new FormData();
    dataf.append('orgao_id', this.formAt.value.orgao_id);
    dataf.append('pessoa_id', this.valor);
    dataf.append('materia_id', this.formAt.value.materia_id);
    dataf.append('descricao', this.formAt.value.descricao);
    dataf.append('estado_material', this.formAt.value.estado_material);
    dataf.append('created_at', this.formAt.value.created_at);
    dataf.append('foto', this.GetFile);
    this.atribuidos.registar(dataf).subscribe({
      next: () => {
setTimeout(() => {
  window.location.reload();
}, 500);
      },
      error: () => {
        console.error('error');
      },
    });
  }

  public pegarFile($event: any) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.fileUpload = file;
    }
  }

  public get GetFile() {
    return this.fileUpload;
  }

  selecionarOrgaoOuComandoProvincial(): void {
    this.direcao.listarTodos([]).subscribe((res) => {
      this.direcaoOuOrgao = res.map((item: any) => ({
        id: item.id,
        text: `${(item.sigla, ' - ', item.nome_completo)}`,
      }));
    });

    setTimeout(() => {
      this.recarregarPagina();
    }, 1000);

    //this.selecionarAgente([], []);
  }

  public selecionarAgente(event: any, $e: any = null) {
    this.filtro.perPage = 5;
    this.filtro.search = $e;
    let data = {
      pessoajuridica_id: event,
    };
    this.agentes.verAgenteOrgao(data).subscribe((res) => {
        console.log(res)
      this.func = res.map((item: any) => ({
        id: item.id,
        text: `${item.nome}`,
      }));
    });
  }

  mostrarAtribuidosSigae() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.atribuidos
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.materias = response.data;
        console.log(response);

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
    this.mostrarAtribuidosSigae();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.mostrarAtribuidosSigae();
  }

  public delete_(id: any) {
    this.id = id;
    this.atribuidos.deletar(id).subscribe({
      next: () => {
        this.removeModal();
        this.recarregarPagina();
      },
    });
  }

  public getFileInformation(id: any = null, Url: any = null) {
    var url;
    url = Url;
    this.getPathCaminho = this.help.pegarFicheiroCaminho(id, url);
  }

  public baixarFile(url: any) {
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
