import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';  
import { FuncionarioService } from '@core/services/Funcionario.service';
import { ReclamacaoService } from '@resources/modules/sigpj/core/service/Reclamacao.service';
import { Funcionario } from '@resources/modules/sigpj/shared/model/funcionario.model';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { ReclamacaoModule } from '../reclamacao.module';
import { OrgaoService } from '@resources/modules/sigpj/core/service/Orgao.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';
import { canActivateValidation } from '@resources/modules/sigpj/shared/validation/canActivate.validation';

@Component({
  selector: 'sigpj-registar-ou-editar-reclamacao',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {

  
  arrayFiles!: File[]
  
  @Input() public NewProcesso: any = null
  @Output() eventRegistarOuEditReclamacaoModel = new EventEmitter<boolean>()
 
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0
  
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
 
  simpleForm!: FormGroup;
  public canCode:any
  public funcionarios:Funcionario[] = [];
  public orgaos: Array<Select2OptionData> = [];
  public provimentos :Array<any> = []
  public Funcionario: Funcionario = new Funcionario();


  reclamacaoForm!:FormGroup
  constructor(private reclamacao:ReclamacaoService, 
    private funcionarioServico:FuncionarioService, 
    private fb: FormBuilder,  
    private canValidation:canActivateValidation,
    private provimento:ProvimentoService, 
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private guardUser:SigpjUserGuard,
    private guardRole:SigpjRoleGuard){}

  ngOnChanges():void{
 
    this.createForm()

    this.buscarFuncionarios()
    this.criarFormulario() 
    this.settarOrgoas()

    if (this.buscarId()) {
      this.getDataForm(); 
      this.settarAcusado()
    }
  }

 
  
  get oficio(){
    return this.reclamacaoForm.get('oficio')!
  }

  
  get orgao_id(){
    return this.reclamacaoForm.get('orgao_id')!
  }

  get assunto(){
    return this.reclamacaoForm.get('assunto')!
  }

  createForm() {
    this.reclamacaoForm = new FormGroup({
      id: new FormControl(''),
      orgao_id: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]), 
      assunto: new FormControl('', [Validators.required]), 
    })
  }

  getDataForm() {
    this.reclamacaoForm.patchValue({
      id: this.NewProcesso.id,
      orgao_id: this.NewProcesso.orgao_id,
      oficio: this.NewProcesso.oficio,
      assunto: this.NewProcesso.assunto, 
    });
  }
  
  settarOrgoas() {
    this.direcaoOuOrgaoService.listarTodos("orgao").pipe(
      finalize(() => {
         this.isLoading = false;
      })
    )
    .subscribe((response) => { 
      this.orgaos = response.map((item: any) => ({
        id: item.id,
        text:item.nome_completo,  
      })); 

})
  }

  
  registrar() {

    this.buscarId() ? this.canCode = 'reclamacao-update' : this.canCode = 'reclamacao-store';
    
    const code ={
      permission:this.canCode
    }
    const result1 =  this.guardRole.canActivate(this.canValidation.getRoute(code),this.canValidation.getState() ).valueOf()
    const result2 = this.guardUser.canActivate(this.canValidation.getRoute(code), this.canValidation.getState())
    if(result1 == false || result2 == false ){
      this.removerModal()      
      return
    }
    
    if (this.reclamacaoForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true 

    const formData = new FormData()
 
    if( this.arrayFiles === undefined || !this.arrayFiles){
      
      formData.append('files[]', '');
      const newreclamacao = { 
        oficio: this.reclamacaoForm.get("oficio")?.value,
        assunto: this.reclamacaoForm.get("assunto")?.value,
        orgao_id: this.reclamacaoForm.get("orgao_id")?.value
      }
      formData.append('funcionario_id', `${this.Funcionario.id}`) 
      formData.append('oficio', newreclamacao.oficio)
      formData.append('assunto', newreclamacao.assunto)
      formData.append('orgao_id', newreclamacao.orgao_id)
  
      const type = this.buscarId() ?
        this.reclamacao.editar(formData, this.buscarId()) :
        this.reclamacao.registar(formData)
  
      type.pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => { 
        this.eventRegistarOuEditReclamacaoModel.emit(true)
        this.removerModal()
        this.reiniciarFormulario()
      })
  

    }else{
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
      const newreclamacao = { 
        oficio: this.reclamacaoForm.get("oficio")?.value,
        assunto: this.reclamacaoForm.get("assunto")?.value,
        orgao_id: this.reclamacaoForm.get("orgao_id")?.value
      }
      formData.append('funcionario_id', `${this.Funcionario.id}`) 
      formData.append('oficio', newreclamacao.oficio)
      formData.append('assunto', newreclamacao.assunto)
      formData.append('orgao_id', newreclamacao.orgao_id)
  
      const type = this.buscarId() ?
        this.reclamacao.editar(formData, this.buscarId()) :
        this.reclamacao.registar(formData)
  
      type.pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {  
        this.eventRegistarOuEditReclamacaoModel.emit(true)
        this.removerModal()
        this.reiniciarFormulario()
      })
    }
    

  }

  
   
  buscarId(): number { 
    return this.NewProcesso?.id;
  }

  buscarFuncionarios() {
    const options = {};

    // this.isLoading = true;
    this.funcionarioServico
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
       // console.log("Rebuscar funcionarios", response)
        this.funcionarios = response.data

        
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      });
  }
  

  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

 
  reiniciarFormulario() { 
    this.Funcionario.id = undefined 
    this.reclamacaoForm.reset()
    this.NewProcesso = new ReclamacaoModule()
  }
 
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide(); 
  }
  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionarios();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncionarios();
  }

  
  criarFormulario() {
    this.simpleForm = this.fb.group({
      Funcionario_id: ['', [Validators.required]], 
    });
  }
  
  selectedFuncionario(item:any){
    //console.log("funcionario acusado", item)
    this.Funcionario = item

  } 

  
  settarAcusado(){ 
    // console.log("new", this.NewProcesso)
 
    
    this.reclamacao.verUm(this.buscarId())
    .subscribe(item=>{ 
    
    console.log("result", item)
       this.funcionarioServico.buscarUm(item.funcionario_id)
       .subscribe(response=>{
       // console.log( "funcionario",response)
        this.Funcionario = response
       })
    })
   }

}
