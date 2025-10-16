import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { DiversoService } from '@resources/modules/sigpj/core/service/Diverso.service';  
import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs'; 


@Component({
  selector: 'app-pecas',
  templateUrl: './pecas.component.html',
  styleUrls: ['./pecas.component.css']
})
export class PecasComponent implements OnInit { 
  public pecas: PecasList[] = [];
  public isLoading: boolean = false
  public doc?:string
  public pagination = new Pagination();
  totalBase: number = 0 

  images!:string

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor( private diverso:DiversoService,
    private route: ActivatedRoute,
     
    ){}

  ngOnInit(){
    this.buscarUmDiverso()
    this.buscarPecas()
   
 }

 public get getId() {
  return this.route.snapshot.params["id"] as number
}



buscarUmDiverso(){
  this.diverso.verUm(this.getId)
  .subscribe(response=>{
   // console.log("datas", response)
    this.doc = response.data
  })
}


 buscarPecas(){
   
   this.isLoading = true;
   this.diverso.listarPecas(this.filtro, this.getId)
   .subscribe((response) => {  
     
    console.log("download", response)
 
      this.pecas = response.data 
 
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

  
  const buffer = new Uint8Array(file.blob.data)
  const blob =  new  Blob([ buffer], {type:`image/${extensao}`})
  const url = window.URL.createObjectURL(blob)
   
   
   
  window.open(url,'_blank')
  
 }
 



  filtrarPagina(key: any, $e: any) {

   if (key == 'page') {
     this.filtro.page = $e;
   } else if (key == 'perPage') {
     this.filtro.perPage = $e.target.value;
   } else if (key == 'search') {
     this.filtro.search = $e;
   }
   this.buscarPecas()
  }

  recarregarPagina() {
   this.filtro.page = 1
   this.filtro.perPage = 5
   this.filtro.search = ''
   this.buscarPecas()
  }

 construcao() {
   alert('Em construção')
 }


  

}
