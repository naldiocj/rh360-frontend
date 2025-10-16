import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { AquartelamentoAtribuirService } from '@resources/modules/sigae/core/aquartelamento-atribuir.service';
import { AquartelamentoService } from '@resources/modules/sigae/core/aquartelamento.service';
import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { AgenteOrgaoService } from '@resources/modules/sigae/core/service/agente-orgao.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public onSucess: any;
  public valor: any;
  public form: any;
  public formAt:any;
  public materiais: any;
  public matId: any;
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  ob: any;
  IDpegado:any;
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'comando Provincial', text: 'Comando Provincial' },
    { id: 'orgao', text: 'Orgão Central' },
  ];
  options: any = {
    placehlder: 'selecione uma opção',
    width: '100%',
  };
  atDir!: FormGroup;
  pos: boolean = false;
  position!: number;
  is!: number;
  id!: number;
  getPathCaminho:any
  lista: any = {};
  public fileUpload:any | File;
  public direcaoOuOrgao:any
  public func:any
  showATs = true;
  setorgao:any;


  constructor(
    private help: HelpingService,
    private users: AuthService,
    private aqua: AquartelamentoService,  
     private direcao: DirecaoOuOrgaoService,
    private agentes: AgenteOrgaoService,
    private aquaAt: AquartelamentoAtribuirService,
    private fb:FormBuilder
  ) {
    this.onSucess = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.is = this.help.isUser;
    this.buscarMateriais();
    this.startForm();
    this.selecionarOrgaoOuComandoProvincial()
  }

  buscarMateriais() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.aqua
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        console.log(response);
              this.materiais = response.data
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  ver_user(data: any) {
    this.lista = data;
    // console.log(data)
  }

  
  get(id: any) {
    this.matId = id;
    console.log(id)

  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarMateriais()
  }

    public pegarFile($event: any) {
  
      let ficheiro = $event.target;
      if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
        var file = $event.target.files[0];
        this.fileUpload = file;
      }
    }
  
    public get GetFile(){
      return this.fileUpload;
    }


      startForm() {
        this.formAt = this.fb.group({
          orgao_id: [''],
          pessoa_id: [''],
          materia_id: [''],
          descricao: ['',],
          estado: 'NA',
          created_at: new Date(),
        });
      }
    

  public atribuir() {
    this.formAt.value.pessoa_id = this.valor;
  
    console.log(this.formAt.value)

     let dataf = new FormData(); 
     dataf.append('orgao_id', this.formAt.value?.orgao_id);
     dataf.append('pessoa_id', this.formAt.value?.pessoa_id);
     dataf.append('descricao', this.formAt.value?.descricao);
     dataf.append('materia_id', this.matId);
     dataf.append('created_at', this.formAt.value?.created_at);
     dataf.append('foto', this.GetFile);
 
    
    console.log(dataf)
     this.aquaAt.registar(dataf).subscribe( {
      next:()=>{
        this.removeModal();
        this.recarregarPagina();
      window.location.reload();
  
      // this.formAt.reset();
      },
      error:()=>{
        console.error('error')
      }
     

     });
  }

  
  public getFileInformation(id: any=null, Url: any=null) {
    var url;
    url = Url
    this.getPathCaminho = this.help.pegarFicheiroCaminho(id, url);
  }

  public baixarFile(url: any) {
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }


  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarMateriais();
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

    
  public delete_(id: any) {

    this.id = id;
    this.aqua
      .deletar(id)
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina();
        },
      });
  }

  public obj(lista: any) {
    // this.object = lista;
    this.fillForm(lista);
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

    this.selecionarAgente([], []);
  }

  setAgente(event: any) {
    this.valor = event
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
    this.agentes.verAgenteOrgao(data).subscribe((res) => {
      this.func = res.data;
    });
  }

  public SetOrgao($e: any) {
    this.selecionarAgente(this.formAt.value.orgao_id, $e);
    console.log($e);
    this.filtro.search = this.setorgao;
    console.log(this.filtro);
    console.log(this.formAt.value.orgao_id);
  }

  //passar
  public fillForm(data: any) {
    this.IDpegado = data.id;
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

}
