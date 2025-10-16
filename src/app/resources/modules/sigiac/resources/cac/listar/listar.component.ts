import { Component, OnInit } from '@angular/core';
import { QueixaService } from '@resources/modules/sigiac/core/service/Queixa.service';
import { QueixaModel } from '@resources/modules/sigiac/shared/model/queixa.model2';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import * as CryptoJS from 'crypto-js';
 //import { CryptoJS } from 'crypto-js';
@Component({
  selector: 'sigiac-queixa-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  private inicializador = 'piis_v2';
  encryptId(id: number): string {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), this.inicializador).toString();
    return encodeURIComponent(encrypted); // Evita problemas na URL
  }

  public queixas: QueixaModel[] = [];
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0
  NovoProcesso:any

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor( private queixaServico:QueixaService){}

  ngOnInit( ){
    
    this.buscarQueixas()
  }

  setDiverso(item: QueixaModel) { 
    this.NovoProcesso  = item
  }
 


  
  buscarQueixas(){
    
    this.isLoading = true;
    this.queixaServico.listarTodos(this.filtro).pipe(
      finalize(() => {  
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.queixas = response.data;

      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });

  } 

 

   filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarQueixas()
   }

   recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarQueixas()
   }


}
