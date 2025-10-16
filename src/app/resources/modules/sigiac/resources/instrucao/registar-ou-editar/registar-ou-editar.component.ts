import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiversoService } from '@resources/modules/sigpj/core/service/Diverso.service';
import { OrgaoService } from '@resources/modules/sigpj/core/service/Orgao.service';
import { DiversoModel } from '@resources/modules/sigpj/shared/model/diverso.model';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpj-registar-ou-editar-diverso',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {


  diversoForm!:FormGroup
  arrayFiles!: File[]
  
  public isLoading: boolean = false
  @Input() public NewProcesso: any = null
  @Output() eventRegistarOuEditDiversoModel = new EventEmitter<boolean>()

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public orgaos: Array<Select2OptionData> = [];


  constructor(private diverso:DiversoService,
    private  orgaoService:OrgaoService
    ){}


  ngOnChanges():void{
    this.createForm()
  }

  get orgao_id(){
    return this.diversoForm.get('orgao_id')!
  }

  
  get oficio(){
    return this.diversoForm.get('oficio')!
  }

  
  get assunto(){
    return this.diversoForm.get('assunto')!
  }

  get observacao(){
    return this.diversoForm.get('observacao')!
  }

  createForm() {
    this.diversoForm = new FormGroup({
      id: new FormControl(''),
      orgao_id: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]),
      assunto: new FormControl('', [Validators.required]),
      observacao: new FormControl('', [Validators.required])
    })
  }

  getDataForm() {
    this.diversoForm.patchValue({
      id: this.NewProcesso.id,
      orgao_id: this.NewProcesso.orgao_id,
      oficio: this.NewProcesso.oficio,
      assunto: this.NewProcesso.assunto,
      observacao: this.NewProcesso.observacao
    });
  }

    
 

  settarOrgoas() {

  
    // const options = {}
    this.orgaoService 
    .listar()
    .pipe(
      finalize(() => {
         this.isLoading = false;
      })
    )
    .subscribe((response) => { 
      this.orgaos = response.map((item: any) => ({
        id: item.id,
        text: `${item.sigla}  ${item.nome}`, 
        descricao:item.descricao
      }));

    });
    
     

  }

  registrar() {

    if (this.diversoForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true 

    const formData = new FormData()
 
    if( this.arrayFiles === undefined || !this.arrayFiles){
      
      formData.append('files[]', '');

      const newDiverso  ={ 
        oficio:this.diversoForm.get("oficio")?.value,
        assunto:this.diversoForm.get("assunto")?.value,
        observacao:this.diversoForm.get("observacao")?.value,
        orgao_id:this.diversoForm.get("orgao_id")?.value
      }   
      formData.append('observacao', newDiverso.observacao)
      formData.append('oficio', newDiverso.oficio)
      formData.append('assunto', newDiverso.assunto)
      formData.append('orgao_id', newDiverso.orgao_id)
  
      const type = this.buscarId() ?
        this.diverso.editar(formData, this.buscarId()) :
        this.diverso.registar(formData)
  
      type.pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {
        this.removerModal()
        this.reiniciarFormulario()
        this.eventRegistarOuEditDiversoModel.emit(true)
        this.diversoForm.reset()
      })
  

    }else{
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
      const newDiverso = {
        oficio: this.diversoForm.get("oficio")?.value,
        assunto: this.diversoForm.get("assunto")?.value,
        observacao: this.diversoForm.get("observacao")?.value,
        orgao_id: this.diversoForm.get("orgao_id")?.value
      } 
      formData.append('assunto', newDiverso.assunto)
      formData.append('oficio', newDiverso.oficio)
      formData.append('orgao_id', newDiverso.orgao_id)
      formData.append('observacao', newDiverso.observacao)
  
      const type = this.buscarId() ?
        this.diverso.editar(formData, this.buscarId()) :
        this.diverso.registar(formData)
  
      type.pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {
        this.removerModal()
        this.reiniciarFormulario()
        this.eventRegistarOuEditDiversoModel.emit(true)
      
        this.diversoForm.reset()
      })
    }
    

  }

 
  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

  reiniciarFormulario() {
    this.diversoForm.reset()
    this.NewProcesso = new DiversoModel()
  }

  reiniciarFormularioArguido() { 
  }

  buscarId(): number { 
    return this.NewProcesso?.id;
  }
 

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
    // $('body').removeClass("modal-open");
  }

}
