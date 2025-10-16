import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcusadoService } from '@resources/modules/sigiac/core/service/Acusado.service';
import { QueixaService } from '@resources/modules/sigiac/core/service/Queixa.service';
import { QueixaModel } from '@resources/modules/sigiac/shared/model/queixa.model2';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-listar',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css'],
})
export class DetalhesComponent implements OnInit { 

  public dadosQueixoso?: QueixaModel;
  public dadosAcusado:any
  public dadosQueixa:any
  public obserStatus:Boolean = false
  dadosAcusados: any[] = []; // Lista de acusados
  id!: number;
  arrayFiles!: File[];


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
    private route: ActivatedRoute, 
    private decisao: DecisaoDisciplinarService,
    private queixaService:QueixaService,
    private acusadoService:AcusadoService
  ) {}

  ngOnInit(): void {
    this.buscarQueixoso()
    this.buscarAcusados()
    this.buscarQueixa()


  }
 
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  }
 
  buscarQueixa() {
    this.queixaService.listarUm(this.getId)
      .subscribe((response) => {
        if (response.observacao != null || response.observacao != undefined) {
          this.obserStatus = true;
        } 
        this.dadosQueixa = response;
        this.dadosAcusados = response.dadosAcusado || []; // Garante que sempre será um array
      });
  }
  



  buscarQueixoso() {
    this.queixaService
      .verQueixoso(this.getId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        // console.log("Dados do queixoso", response)
        this.dadosQueixoso = response;
      });
  }

  buscarAcusados() {
     /* this.acusadoService
      .listar(this.filtro, this.getId)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
      // console.log("acusados", response)
        this.dadosAcusado = response.data;

        this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;
  
      this.pagination = this.pagination.deserialize(response.meta);
    

      });*/
       
  }
 
   verFile(file:any){ 
   // console.log("btn do file foi precionado")
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

   
  downloadFile(file:any){ 
   // console.log("btn de download foi precionado")
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

   filtrarAcusados(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    
    this.buscarAcusados()
   }
  


recarregarAcusados() {
  this.filtro.page = 1
  this.filtro.perPage = 5
  this.filtro.search = '' 
  this.buscarAcusados()
 }
}
