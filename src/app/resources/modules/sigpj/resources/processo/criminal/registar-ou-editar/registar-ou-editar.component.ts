import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { Funcionario } from '../../../../shared/model/funcionario.model'; 
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {
  
  FuncionarioForm!:FormGroup
  disciplinarForm!:FormGroup

  //public funcionarios: Funcionario[] = [];
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0

  filtros = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }

  @ViewChild('contentPDF', { static: false }) el!: ElementRef;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
 
  simpleForm!: FormGroup;
  
  public funcionarios: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public provimentos :Array<any> = []
  public Funcionario: Funcionario = new Funcionario();
   

  constructor(private disciplinar:DisciplinarService, 
    private funcionarioServico:FuncionarioService, 
    private fb: FormBuilder,  
    private provimento:ProvimentoService
    ){}

  ngOnInit():void{
    this.disciplinarForm = new FormGroup({
      id: new FormControl(''),
      orgao: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]), 
      infracao: new FormControl('', [Validators.required]), 
      processo: new FormControl('', [Validators.required])
    })

    this.FuncionarioForm = new FormGroup({ 
      filtro: new FormControl('', [Validators.required]), 
    })

    this.buscarFuncionarios()
    this.criarFormulario() 
    this.settarOrgoas()
  
  }

 


  get processo(){
    return this.disciplinarForm.get('processo')!
  }

  
  get oficio(){
    return this.disciplinarForm.get('oficio')!
  }

  
  get orgao(){
    return this.disciplinarForm.get('orgao')!
  }

  get infracao(){
    return this.disciplinarForm.get('infracao')!
  }
 
 
  buscarProvimento(funcionario_id:any){
    
    const options = {};
    this.provimento.listar_promocao_emTempo(options).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe(response=>{
 

      response.map((item:Funcionario)=>{
        if(item.id == this.simpleForm.value.Funcionario_id){ 
          this.Funcionario = item
        }
      }) 

    })

  }
  settarOrgoas(){

    const options =[ {
      id:"CPL",
      nome:"CPL"
    },
    {id:"DEPOL",
      nome:"DEPOL"
    },
    
    {id:"DTTI",
      nome:"DTTI"
    }
    ]
    this.orgaos = options.map((item: any) => ({
      id: item.id,
      text: item.nome, 
    }));


   
  }
 
  registrar(){
    
    if(!this.disciplinarForm.get("processo")?.value || !this.disciplinarForm.get("oficio")?.value || !this.disciplinarForm.get("infracao")?.value ){
      return
    }
    
      const newDisciplinar  ={
        funcionario_id:this.Funcionario.id, 
        processo:this.disciplinarForm.get("processo")?.value,
        oficio:this.disciplinarForm.get("oficio")?.value,
        infracao:this.disciplinarForm.get("infracao")?.value,
        orgao:this.disciplinarForm.get("orgao")?.value
      } 
      console.log( "discip: ", newDisciplinar)
  
      this.disciplinar.registar(newDisciplinar).pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      ).subscribe(evt=>{
        console.log(evt)
      })
    this.Funcionario.id = undefined
    this.disciplinarForm.reset() 
  }

   
  

  buscarFuncionarios() {
    const options = {};

    // this.isLoading = true;
    this.funcionarioServico
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {  
        this.funcionarios = response.map((item: any) => ({
          id: item.id,
          text: item.nome_completo,
          nip:item.nip
        }));

      });
  }

  reiniciarFormulario() { }

  onSubmit() {   
  
     this.buscarProvimento(this.simpleForm.value.Funcionario_id)
    this.removerModal()
 
  }

  buscarDisciplinar(){

    this.disciplinar.listar(this.filtros)


  }
 


  criarFormulario() {
    this.simpleForm = this.fb.group({
      Funcionario_id: ['', [Validators.required]], 
    });
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  


}
