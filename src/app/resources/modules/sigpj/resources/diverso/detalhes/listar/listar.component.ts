import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  
import { DiversoService } from '@resources/modules/sigpj/core/service/Diverso.service'; 
import { DecisaoList } from '@resources/modules/sigpj/shared/model/decisao-list.model';
import { DisciplinarList } from '@resources/modules/sigpj/shared/model/disciplinar-list.model';
import { DiversoList } from '@resources/modules/sigpj/shared/model/diverso-list.model';
import { ParecerList } from '@resources/modules/sigpj/shared/model/parecer-list.model';
import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public diversos?:DiversoList   
 
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor(private diverso: DiversoService,
    private route: ActivatedRoute,  
    ) { }

  ngOnInit(): void {
    this.buscarUmDiverso() 
  }

  public get getId() {
    return this.route.snapshot.params["id"] as number
  }

  buscarUmDiverso() {

    this.diverso.verUm(this.getId).pipe(
      finalize(() => {

        this.isLoading = false;
      })
    ).subscribe((response) => {  
    
      this.diversos = response

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

 }

 recarregarPagina() {
  this.filtro.page = 1
  this.filtro.perPage = 5
  this.filtro.search = '' 

 }


}
