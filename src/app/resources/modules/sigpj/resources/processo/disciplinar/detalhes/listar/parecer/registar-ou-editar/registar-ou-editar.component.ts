import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { TipoDecisaoService } from '@resources/modules/sigpj/core/service/TipoDecisao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  
  public haveDatasParecer: boolean = false 
  public parecerID:number = 0
  public disciplinarID: number = 0
   
 

  constructor(
    private route: ActivatedRoute, 
    private parecerService: ParecerDisciplinarService,
    private router:Router,
    private arguidoService:ArguidoDisciplinarService
  ) { }


  arrayFiles!: File[]
  parecerForm!: FormGroup

  ngOnInit(): void {
 
    this.createForm()
    this.setarProcesso()
    this.verifyParecerArguido()
  
  }
  
  get processoId() {
    return this.route.snapshot.params["id"] as number
  } 
 
  createForm(){
    this.parecerForm = new FormGroup({
      id: new FormControl(''),
      assunto: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]), 
      processo: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required])
    })

    
  }

  setarProcesso(){
  
      this.parecerForm.patchValue({
        processo:this.processoId
      })
      
  }
 onVoltar(){
  this.router.navigate(['/piips/sigpj/processo/disciplinar/listagem'])
 }
verifyParecerArguido(){
  this.parecerService.verUm(this.processoId)
  .subscribe((response)=>{
   // console.log('Dados do parecer do arguido Disciplinar', response)

    if(!response || response == null || response == undefined){

      this.haveDatasParecer = false
      return
    }

    //console.log('parecer', response)
    this.parecerForm.patchValue({
      processo:response.processo,
      assunto:response.assunto,
      oficio:response.oficio,
      data:response.data
    })
    this.parecerID = response.id
    this.haveDatasParecer = true
  })


}
  
  registrar() {

    if ( !this.parecerForm.get("oficio")?.value || !this.parecerForm.get("assunto")?.value || !this.parecerForm.get("processo")?.value || !this.parecerForm.get("data")?.value) {
      
      window.alert("Campos vazios!")
      return
    } 

    const formData = new FormData() 
  
    if(this.arrayFiles === undefined || !this.arrayFiles){
      formData.append('files[]', '');
    }else{
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
    }

    if (this.haveDatasParecer) {

      const newDisciplinar = {
        processo: this.parecerForm.get("processo")?.value,
        oficio: this.parecerForm.get("oficio")?.value,
        assunto: this.parecerForm.get("assunto")?.value, 
        data: this.parecerForm.get("data")?.value, 
      }
  
      formData.append('disciplinar_id', `${this.processoId}`)
      formData.append('processo', newDisciplinar.processo)
      formData.append('oficio', newDisciplinar.oficio)
      formData.append('assunto', newDisciplinar.assunto) 
      formData.append('data', newDisciplinar.data) 
  
  
      this.parecerService.editar(formData, this.parecerID).pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      ).subscribe(evt => { 
        
        this.router.navigate(['/piips/sigpj/processo/disciplinar/listagem'])
      })
  
      this.parecerForm.reset() 
      return
    }


    const newDisciplinar = {
      processo: this.parecerForm.get("processo")?.value,
      oficio: this.parecerForm.get("oficio")?.value,
      assunto: this.parecerForm.get("assunto")?.value, 
      data: this.parecerForm.get("data")?.value, 
    }

    formData.append('disciplinar_id', `${this.processoId}`)
    formData.append('processo', newDisciplinar.processo)
    formData.append('oficio', newDisciplinar.oficio)
    formData.append('assunto', newDisciplinar.assunto) 
    formData.append('data', newDisciplinar.data) 


    this.parecerService.registar(formData).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe(evt => { 
     // console.log('resultado do registro', evt)
     // this.verifyParecerArguido() 
      this.router.navigate(['/piips/sigpj/processo/disciplinar/listagem'])
    })

    this.parecerForm.reset()


  }
  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

}
