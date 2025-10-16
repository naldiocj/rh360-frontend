import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { AntecedenciaService } from '@resources/modules/sigpj/core/service/Antecedencia.service';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { DecisaoList } from '@resources/modules/sigpj/shared/model/decisao-list.model';
import { ParecerList } from '@resources/modules/sigpj/shared/model/parecer-list.model';
import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'sigpj-app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
   
  public isLoading:boolean = false
  public pecasParecer: PecasList[] = [];
  public pecasDecisao: PecasList[] = [];
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
 
  public parecerID:number = 0
  public decisaoID:number = 0

  
  public disciplinarTipo:string = 'Disciplinar'
  public disciplinarTotal:number = 0
  public reclamacaoTipo:string = 'Reclamacao'
  public reclamacaoTotal:number = 0
  public AntecedenciaTotal:number = 0

  public dadosArguido?:Funcionario 
  public historicoDecisao: any[] = [];
  public historicoParecer: any[] = [];
  public dadosParecer?:ParecerList 
  
  public  dadosDecisao?:DecisaoList 

  constructor(
    private parecer:ParecerDisciplinarService,
    private decisao:DecisaoDisciplinarService,
    private route:ActivatedRoute,
    private arguidoService:ArguidoDisciplinarService,
    private antecedenciaService:AntecedenciaService
  ) { }

  ngOnInit(): void {  
    this.buscarArguido()
    this.buscarDadosDecisao()
    this.buscarDadosParecer()
    this.buscarPecasDecisao()
    this.buscarPecasParecer()


    this.buscarHistoricoParecer()
    this.buscarHistoricoDecisao()
     
  }


  get arguidoDisciplinarID(){
    return this.route.snapshot.params['id'] as number
  }


  antecedentesDisciplinar(arguido:any){
    this.antecedenciaService.listarDisciplinar(arguido)
    .subscribe(response=>{
      console.log('Antecedencia discip', response)
      this.disciplinarTotal = response.total
    })
  }
  antecedentesReclamacao(arguido:any){
    this.antecedenciaService.listarReclamacao(arguido)
    .subscribe(response=>{
      this.reclamacaoTotal = response.total
    })
  }
 buscarArguido(){
  this.arguidoService.verUm(this.arguidoDisciplinarID)
  .subscribe(response=>{
   //console.log('dados do arguido', response)
   this.antecedentesDisciplinar(response.funcionario_id)
   this.antecedentesReclamacao(response.funcionario_id)
    this.dadosArguido = response
  })

 }



 buscarDadosParecer(){
  this.parecer.verUm( this.arguidoDisciplinarID)
  .subscribe(response=>{
   // this.parecerID = response.id
    this.dadosParecer = response
  //  this.buscarPecasParecer()
  })
 
 }

 buscarDadosDecisao(){
  this.decisao.verUm(this.arguidoDisciplinarID)
  .subscribe(response=>{
   // console.log('dados decisao', response)
    //this.decisaoID = response.id
    this.dadosDecisao =response 
    
  })

 }
 buscarPecasParecer(){
   
  this.isLoading = true;

  this.parecer.listarPecas(this.filtro,this.arguidoDisciplinarID)
  .subscribe((response) => { 
     // console.log('Pecas parecer', response)
     this.pecasParecer = response.data 

    this.totalBase = response.meta.current_page ?
      response.meta.current_page === 1 ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;

    this.pagination = this.pagination.deserialize(response.meta);
  });



}

buscarPecasDecisao(){
   
  this.isLoading = true;
  this.decisao.listarPecas(this.filtro,this.arguidoDisciplinarID)
    .subscribe((response) => {  
         
       this.pecasDecisao = response.data 
  
      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;
  
      this.pagination = this.pagination.deserialize(response.meta);
    });




}

 

  
  downloadFile(file:any){ 

    const pos = file.nome.lastIndexOf('.');
    const extensao = pos >= 0 ? file.nome.slice(pos + 1) : '' 
   
    
    let a = document.createElement('a')
    a.style.display = 'none';
    document.body.appendChild(a)
   
   
   
    if(extensao === 'pdf' ){
      const buffer = new Uint8Array(file.blob.data)
      const blob =  new  Blob([ buffer], {type:'application/pdf'})
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = file.nome
      a.click()
      window.URL.revokeObjectURL(url)
      return
    }
   
    const buffer = new Uint8Array(file.blob.data)
    const blob =  new  Blob([ buffer], {type:`image/${extensao}`})
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = file.nome
    a.click()
    window.URL.revokeObjectURL(url)
    
   }
   
   
   verFile(file:any){ 
   
    const pos = file.nome.lastIndexOf('.');
    const extensao = pos >= 0 ? file.nome.slice(pos + 1) : '' 
   
   //  var ext = file.nome.split('/').pop(); 
   // ext = ext.indexOf('.') < 1 ? '' : ext.split('.').pop();

   if(extensao == 'pdf'){
    window.alert(' Nao e permitido visualizar arquivo pdf')
    return
   }
    
    const buffer = new Uint8Array(file.blob.data)
    const blob =  new  Blob([ buffer], {type:`image/${extensao}`})
    const url = window.URL.createObjectURL(blob)
      
    window.open(url,'_blank')
    
   }

   filtrarPecasParecer(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } 
    this.buscarPecasParecer() 
   }
  
   recarregarPecasParecer() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = '' 
    this.buscarPecasParecer() 
   }

   recarregarHistoricoParecer() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarHistoricoParecer();
  }
  
   buscarHistoricoParecer() {
    this.parecer.listar(this.filtro, this.arguidoDisciplinarID).subscribe((response) => {
      //console.log('historico parecer', response)

      this.historicoParecer = response.data;

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }
  
   
  filtrarHistoricoParecer(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarHistoricoParecer();
  }
 
filtrarPecasDecisao(key: any, $e: any) {

  if (key == 'page') {
    this.filtro.page = $e;
  } else if (key == 'perPage') {
    this.filtro.perPage = $e.target.value;
  } else if (key == 'search') {
    this.filtro.search = $e;
  } 
  this.buscarPecasDecisao()
 }

 recarregarPecasDecisao() {
  this.filtro.page = 1
  this.filtro.perPage = 5
  this.filtro.search = '' 
  this.buscarPecasDecisao()
 }

 buscarHistoricoDecisao() {
  this.decisao.listar(this.filtro, this.arguidoDisciplinarID).subscribe((response) => {
   // console.log('historico decisao', response);

    this.historicoDecisao = response.data;

    this.totalBase = response.meta.current_page
      ? response.meta.current_page === 1
        ? 1
        : (response.meta.current_page - 1) * response.meta.per_page + 1
      : this.totalBase;

    this.pagination = this.pagination.deserialize(response.meta);
  });
}


 filtrarHistoricoDecisao(key: any, $e: any) {
  if (key == 'page') {
    this.filtro.page = $e;
  } else if (key == 'perPage') {
    this.filtro.perPage = $e.target.value;
  } else if (key == 'search') {
    this.filtro.search = $e;
  }
  this.buscarHistoricoDecisao;
}

recarregarHistoricoDecisao() {
  this.filtro.page = 1;
  this.filtro.perPage = 5;
  this.filtro.search = '';
  this.buscarHistoricoDecisao;
}

 

}
