import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { SolicitacaoService } from '@resources/modules/sigae/core/solicitacao.service';

import { HelpingService } from '@resources/modules/sigae/core/helping.service';
import { AuthService } from '@core/authentication/auth.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-pedentes',
  templateUrl: './pedentes.component.html',
  styleUrls: ['./pedentes.component.css']
})
export class PedentesComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase:any;
  public solicitacoes:any;

  public tituloForm: any
ver:boolean=false

  public isLoading: boolean = false;
  public cache_id: any
public cor!:string;
  public actualiza: boolean = true;
 public filtro = {
    page: 1,
    perPage: 10,
    search: "",
    orgao_id:""
  };
  protected is!:number
  constructor(
    private secureService: SecureService,
    private agenteService: AgenteService,
    private solicitar:SolicitacaoService,
    private help:HelpingService,
    private users:AuthService

  ) { }

  ngOnInit(): void {
    this.is=this.help.isUser
this.filtro.orgao_id = this.users.orgao.sigla;
    this.state()
this.listar_solicitacoe()


  }


  public get pessoa_id(): any {
    return this.agenteService.id
  }
 

  public get getPessoaId(): number {
    return this.secureService.getTokenValueDecode().pessoa.id as number;
  }

  view(){
this.ver=!this.ver
  }


   listar_solicitacoe() {
    const options = { estado:'nega' };

    // this.isLoading = true;
    this.solicitar
      .listar(options)
      .subscribe((response) => {
      var nome = response.map((res:any)=>{
if(res.estado=="PENDENTE"){

    this.solicitacoes = response;
     
    this.pagination = this.pagination.deserialize(response.meta);
  
    this.totalBase = response.meta.current_page
      ? response.meta.current_page === 1
        ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;
    this.pagination = this.pagination.deserialize(response.meta);
  
}

      })

  
      });
  }





//   public listar_solicitacoe(){
//     this.solicitar.listar({}).subscribe((e)=>{
//   this.solicitacoes=e
// console.log(e)
//     })




public state(){


  this.solicitar.listar({}).subscribe((e)=>{
        var nomes=e.filter((res:any)=>{
          console.log(res)
             this.cores(res)
        })
  })
}


public cores (item:any){
  var cor;

  if(item.estado=="PENDENTE"){
   this.cor="btn btn-warning";


  } else if(item.estado=="NEGADO"){

    this.cor="btn btn-danger";

  }

  if(item.estado=="TRATADO"){
  this.cor="btn btn-success";

  }




}

  
}


