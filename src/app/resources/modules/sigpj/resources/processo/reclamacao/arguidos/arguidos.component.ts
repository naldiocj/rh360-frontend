import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { ArguidoReclamacaoService } from '@resources/modules/sigpj/core/service/ArguidoReclamacao.service';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpj-disciplinar-arguidos',
  templateUrl: './arguidos.component.html',
  styleUrls: ['./arguidos.component.css'],
})
export class ArguidosComponent implements OnInit {
  public arguidos: Funcionario[] = [];

  public pagination = new Pagination();
  totalBase: number = 0;

  listedArguido: boolean = false; 
  arguidoForm!: FormGroup;
  public funcionarios:Funcionario[] = [];

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  constructor(
    private funcionarioServico: FuncionarioService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private arguidoService: ArguidoReclamacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.buscarFuncionarios()
    // this.preSettedArguido()
  }

  criarFormulario() {
    this.arguidoForm = this.fb.group({
      Funcionario_id: ['', [Validators.required]],
    });
  }

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  } 
  buscarFuncionarios() { 
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

  verifyArguido(arguido: any) {
    // this.verifyIn(arguido);

    // console.log('estado da inclusao', this.listedArguido)
    const options = {
      reclamacao_id: this.getId,
    };
    // console.log('dados do arguido', arguido)
    this.arguidoService
      .verAdicionado(arguido.id, options)
      .subscribe((response) => {
        //console.log("verify", response)
        if (!response || response === null || response === undefined) {
          this.arguidos.push(arguido);
          return;
        }

        window.alert('Interveniente Existente!');
      });

    // console.log('fora da condicao', this.listedArguido)
  }
 

  addArguidos() {
    if (this.arguidos.length === 0) {
      window.alert('selecione primeiro!');
      return;
    }
    const options = {
      object: this.arguidos,
      reclamacao_id: this.getId,
    };

    // console.log('atribuido', item);

    this.arguidoService
      .registar(options)
      .pipe(finalize(() => {}))
      .subscribe((item) => {
        this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem']);
      });
  }

  
  selectedFuncionario(response:any){
    //console.log("selecionado", response)
    this.listedArguido = false
    this.arguidos.forEach(item=>{
      if(item.id === response.id){
        this.listedArguido = true
        alert('Ja atribuido');
        return;
      }
    }) 


     if (this.listedArguido) { 
       return;
     } 
     this.verifyArguido(response);
 
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

 
}
