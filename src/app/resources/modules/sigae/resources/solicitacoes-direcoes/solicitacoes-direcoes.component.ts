import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { TipoEventoService } from '@resources/modules/sigpq/core/service/Tipo-evento.service';
import { Select2OptionData } from 'ng-select2';
import { SolicitacaoService } from '../../core/solicitacao.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { AgenteOrgaoService } from '../../core/service/agente-orgao.service';
import { AtribuicaoArmasService } from '../../core/service/atribuicao-armas.service';
import { LoteArmasService } from '../../core/lote-armas.service';
import { ArmaService } from '../../core/service/arma.service';
import { finalize } from 'rxjs';
import { SolicitacaoDirecaoService } from '../../core/solicitacao-direcao.service';
import { AuthService } from '@core/authentication/auth.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-solicitacoes-direcoes',
  templateUrl: './solicitacoes-direcoes.component.html',
  styleUrls: ['./solicitacoes-direcoes.component.css']
})
export class SolicitacoesDirecoesComponent implements OnInit {
  public solicitacoes: any;
  public pagination = new Pagination();
  public totalBase:any;
  public tituloForm: any;
  ver: boolean = false;
  public armass: any;
  public isLoading: boolean = false;
  public item_id: any;
  public cor!: string;
  public actualiza: boolean = true;
formEntregar!:FormGroup;
  public info = {};
  public pos!:number;
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public func: Array<Select2OptionData> = [];
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: "", text: "Selecione uma opção" },
    { id: "Comando Provincial", text: "Comando Provincial" },
    { id: "Orgão", text: "Orgão Central" },
  ];
  
  options: any = {
    placeholder: "Selecione uma opção",
    width: "100%",
  };
  public filtro = {
    page: 1,
    perPage: 10,
    search: "",
    orgao_id:""
  };
  constructor(
  
    private agenteService: AgenteService,
    private tipoEventoService: TipoEventoService,
    private solicitar: SolicitacaoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private trabalhadores: FuncionarioService,
    private agenteOrgaoService: AgenteOrgaoService,
    private at: AtribuicaoArmasService,
    private loteArmas: LoteArmasService,
    private solicitarArma: SolicitacaoDirecaoService,
    private armasService: ArmaService,
    private fb:FormBuilder,
    private users:AuthService
  ) {}

  ngOnInit(): void {
    this.filtro.orgao_id = this.users.orgao.sigla;
    this.inicio()
    this.state();
    this.listar_solicitacoe();

  }

  view() {
    this.ver = !this.ver;
  }

  public eliminar() {
    this.solicitarArma
      .deletar(this.item_id)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.removerModal();
            window.location.reload();
          }, 500);
        },
      });
  }

  public delete(item: any) {
    this.item_id = item;
    console.log(item)
  }

  public removerModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }
    public listar_solicitacoe(){
      this.solicitarArma.listar(this.filtro).subscribe((response)=>{
    this.solicitacoes=response.data;
    this.pagination = this.pagination.deserialize(response.meta);
  
    this.totalBase = response.meta.current_page
      ? response.meta.current_page === 1
        ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;
    this.pagination = this.pagination.deserialize(response.meta);
  
  console.log(response)
      })}

  public state() {
    this.solicitarArma.listar({}).subscribe((e) => {
      var nomes = e.filter((res: any) => {
        this.cores(res);
      });
    });
  }

  public cores(item: any) {
    var cor;

    if (item.estado == "PENDENTE") {
      this.cor = "btn btn-warning";
    } else if (item.estado == "NEGADO") {
      this.cor = "btn btn-danger";
    }
    if (item.estado == "TRATADO") {
      this.cor = "btn btn-success";
    }
  }

  public itemId(data: any) {
this.pos=data.id;
this.fillForm2(data)
 this.info=data


  }


  private inicio(){
    this.formEntregar=this.fb.group({
      orgao_id:[''],
      pessoa_id:[''],
      arma_id:[''],
      descricao:[''],
      assunto:[''],
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
          text: item.sigla + " - " + item.nome_completo,
        }));
      });
  }

  selecionarAgente(event: any) {
     this.armasService.listar({orgao_id:event}).subscribe((response: any): void => {
      console.log(response);
      this.armass = response.map((item: any) => ({
        id: item.id,
        text: item.livrete + "-" + item.tipo,
      }));
    });
  }

  StartForms() {
  

  }


  fillForm2(data: any) {
    this.formEntregar.patchValue({
      orgao_id:data.orgao_id,
      pessoa_id:data.pessoa_id,
      arma_id:data.arma_id,
      descricao:data.descricao,
      assunto:data.assunto,
    });

  }



  public entregar() {
    this.solicitarArma
      .actualizar(this.pos,this.formEntregar.value)
      .subscribe((e) => console.log(e));

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  


OpBotao(id:number){





     console.log(id)



  }







}
