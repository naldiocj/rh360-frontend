import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  dropdownActive = false;

  mes:boolean = true
  trimestre:boolean =true
  semestre:boolean = true 
  ano:boolean = true

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
 

  public funcionarios: Funcionario[] = [];
  public isLoading: boolean = false
  public pagination = new Pagination();
  
  public relatorios: Array<Select2OptionData> = [];
  totalBase: number = 0
  relatorioForm !:FormGroup

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  constructor( ){}


  ngOnInit(){

    this.relatorioForm = new FormGroup({ 
      filtros: new FormControl('',[Validators.required]), 

    }) 
  this.settarFiltro()
    // this.buscarFuncionario()
  }

  get filtros(){
    return this.relatorioForm.get('filtros')!
  }
  settarFiltro(){

    const options =[ {
      id:"Mes",
      nome:"Mensal"
    },
    {id:"Semestral",
      nome:"Semestral"
    },
    {id:"Trimestre",
      nome:"Trimestral"
    },
    
    {id:"Ano",
      nome:"Anual"
    }
    ]
    this.relatorios = options.map((item: any) => ({
      id: item.id,
      text: item.nome, 
    }));


   
  }
  

  



  // filtrar os campos
  filtrarCampos(){
 
    if(this.relatorioForm.value.filtros === "mes"){
      
       console.log(this.relatorioForm.value)
        this.mes = true
        this.ano = true 
        this.trimestre = true
        this.semestre = true
        return;
    } 
    if(this.relatorioForm.value.filtros === "trimestre"){
      console.log(this.relatorioForm.value)
       this.mes = false
       this.trimestre = true
       this.semestre = true
       return;
    } 
    if(this.relatorioForm.value.filtros === "semestre"){
      console.log(this.relatorioForm.value)
      this.mes = false
      this.trimestre = false 
      this.semestre = true
    return;
    }
    if(this.relatorioForm.value.filtros === "ano"){
      console.log(this.relatorioForm.value)
      this.mes = false
      this.trimestre = false
      this.semestre = false 
      this.ano = true
      return;
    }
  }

  // buscarFuncionario() {

  //   this.isLoading = true;
  //   this.funcionarioServico.listar(this.filtro).pipe(
  //     finalize(() => {
  //       this.isLoading = false;
  //     })
  //   ).subscribe((response) => {

  //     this.funcionarios = response.data;

  //     this.totalBase = response.meta.current_page ?
  //       response.meta.current_page === 1 ? 1
  //         : (response.meta.current_page - 1) * response.meta.per_page + 1
  //       : this.totalBase;

  //     this.pagination = this.pagination.deserialize(response.meta);
  //   });
  // }

   filtrarPagina(key: any, $e: any) {

  //   if (key == 'page') {
  //     this.filtro.page = $e;
  //   } else if (key == 'perPage') {
  //     this.filtro.perPage = $e.target.value;
  //   } else if (key == 'search') {
  //     this.filtro.search = $e;
  //   }
  //   this.buscarFuncionario()
   }

   recarregarPagina() {
  //   this.filtro.page = 1
  //   this.filtro.perPage = 5
  //   this.filtro.search = ''
  //   this.buscarFuncionario()
   }

  construcao() {
    alert('Em construção')
  }

  toggleDropdown(): void {
    this.dropdownActive = !this.dropdownActive;
  }

}
