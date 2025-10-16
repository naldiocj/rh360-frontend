import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
 import { ArguidoReclamacaoService } from '@resources/modules/sigpj/core/service/ArguidoReclamacao.service';
 import { DecisaoReclamacaoService } from '@resources/modules/sigpj/core/service/Decisao-reclamacao.service';
 import { ParecerReclamacaoService } from '@resources/modules/sigpj/core/service/Parecer-reclamacao.service';
 import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { ReclamacaoService } from '@resources/modules/sigpj/core/service/Reclamacao.service';
import { ReclamacaoList } from '@resources/modules/sigpj/shared/model/reclamacao-list.model';
import { AntecedenciaService } from '@resources/modules/sigpj/core/service/Antecedencia.service';
import { ParecerList } from '@resources/modules/sigpj/shared/model/parecer-list.model';
import { DecisaoList } from '@resources/modules/sigpj/shared/model/decisao-list.model';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit { 

  public reclamacaos?: ReclamacaoList;
  

  
  public disciplinarTipo:string = 'Disciplinar'
  public disciplinarTotal:number = 0
  public reclamacaoTipo:string = 'Reclamacao'
  public reclamacaoTotal:number = 0
  public AntecedenciaTotal:number = 0

  
  public dadosParecer?:ParecerList 
  
  public  dadosDecisao?:DecisaoList 

  public arguido?: Funcionario ;
  parecerForm!: FormGroup;
  decisaoForm!: FormGroup;
  arrayFiles!: File[];
 
 
  public haveDatasParecer: boolean = false;
 
  public haveDatasDecisao: boolean = false;
  NovoParecer:any

  public pecasParecer: PecasList[] = [];
  public pecasDecisao: PecasList[] = [];
  public todosIntervenientes: any[] = []; 
  public isLoading: boolean = false; 
  public pagination = new Pagination();
  totalBase: number = 0;

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };
  constructor(
    private reclamacao: ReclamacaoService,
    private route: ActivatedRoute, 
    private parecer: ParecerReclamacaoService,
    private decisao: DecisaoReclamacaoService,
    private funcionarioServico: FuncionarioService,
    private arguidoServico: ArguidoReclamacaoService, 
    private router:Router,
    private antecedenciaService:AntecedenciaService
  ) {}

  ngOnInit(): void {
    this.buscarUmDisciplinar();
    this.buscarIntervenientes(); 

    this.buscarPecasParecer()
    this.buscarDadosParecer()

    this.buscarDadosDecisao()
    this.buscarPecasDecisao()
  }
 
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }
 


  onView(item:any){
   this.parecer.verUm(item.id)
   .subscribe(response=>{
    if(!response || !response == null || !response == undefined){
      window.alert('Dados Vazios no Parecer!')
      return
    }
    this.decisao.verUm(item.id)
    .subscribe(response1=>{
      if(!response1 || !response1 == null || !response1 == undefined){
        window.alert('Dados Vazios na Decisao!')
        return
      }

      this.router.navigate(['/piips/sigpj/processo/reclamacao/detalhes/listagem/visualizar',item.id])
    })
   })
    

  }
 
  clicked(id: number) { 
  }
  buscarIntervenientes() {
    this.arguidoServico
      .listar(this.filtro, this.getId)
      .subscribe((response:any) => {
        this.todosIntervenientes = response.data;

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  buscarUmDisciplinar() {
    this.reclamacao
      .verUm(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        //console.log("reclamacao",response.funcionario_id)

        this.reclamacaos = response;
        this.buscarUmArguido(response.funcionario_id);
        this.antecedentesDisciplinar(response.funcionario_id)
        this.antecedentesReclamacao(response.funcionario_id)
      });
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

  buscarUmArguido(arguido_id: number) {
    this.funcionarioServico
      .buscarUm(arguido_id)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        //console.log("arguido", response)
        this.arguido = response;
      });
  }
 

  excluirInterveniente(event: any) {
  //console.log(event)
  if(event.acusado == true){
    window.alert('Acusado nao pode ser eliminado!')
    return
  }
   this.arguidoServico.eliminar(event.id)
   .subscribe((response)=>{
   // console.log('eliminado', response)
    this.buscarIntervenientes()
   })

 
  } 
  filtrarInterve(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarIntervenientes();
  }

  recarregarInterve() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarIntervenientes();
  }

  buscarPecasParecer(){
   
    this.isLoading = true;
  
    this.parecer.listarPecas(this.filtro,this.getId)
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

   buscarDadosParecer(){
    this.parecer.verUm( this.getId)
    .subscribe(response=>{
      console.log('dados parecer', response)
     // this.parecerID = response.id
      this.dadosParecer = response
    //  this.buscarPecasParecer()
    })
   
   }
  
   buscarDadosDecisao(){
    this.decisao.verUm(this.getId)
    .subscribe(response=>{
     // console.log('dados decisao', response)
      //this.decisaoID = response.id
      this.dadosDecisao =response 
      
    })
  
   }

   
buscarPecasDecisao(){
   
  this.isLoading = true;
  this.decisao.listarPecas(this.filtro,this.getId)
    .subscribe((response) => {  
         
       this.pecasDecisao = response.data 
  
      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;
  
      this.pagination = this.pagination.deserialize(response.meta);
    }); 

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

  

 
}
