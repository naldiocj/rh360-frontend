import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core'; 
import { FormControl, FormGroup } from '@angular/forms';
import { ReclamacaoService } from '@resources/modules/sigpj/core/service/Reclamacao.service';
import { PecasList } from '@resources/modules/sigpj/shared/model/pecas-list.model';
import { ReclamacaoList } from '@resources/modules/sigpj/shared/model/reclamacao-list.model';



@Component({
  selector: 'sigpj-adicionar-pecas',
  templateUrl: './adicionar-pecas.component.html',
  styleUrls: ['./adicionar-pecas.component.css']
})
export class AdicionarPecasComponent implements OnInit {
  public reclamacaos: ReclamacaoList[] = [];
  public pecas: PecasList[] = [];
  public isLoading: boolean = false 
  @Output() eventAdicionarPecasModel = new EventEmitter<boolean>()
 
  totalBase: number = 0 
  arrayFiles!: File[]
  images!:string
 
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }

  // input datas 
  @Input() public ProcessoId:number = 0
  constructor( private reclamacao:ReclamacaoService){}

  ngOnInit(){  
   
 }

 
 
onSubmit(){
  console.log('id do processo', this.ProcessoId)
  if(!this.ProcessoId){
    console.log("erro de id")
    return
  }
   
   this.isLoading = true;
   const formData = new FormData()
 
    if( this.arrayFiles != undefined || this.arrayFiles != null ){
      
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
      formData.append('id', `${this.ProcessoId}`)  
   
      this.reclamacao.adicionarPecas(formData).subscribe(() => {  
        this.eventAdicionarPecasModel.emit(true)
        this.removerModal() 
      })
  

    }

 }

 
 
 onFileSelected(event: any) {
  this.arrayFiles = event.target.files
}

 
removerModal() {
  $('.modal').hide();
  $('.modal-backdrop').hide(); 
}


  

}
