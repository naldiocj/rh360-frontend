import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  OnChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PerfisOperativoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/perfis/perfis_operativo/perfis-operativo.service';
import { TipoPerfisService } from '@resources/modules/sicgo/core/service/piquete/dinfop/perfis/tipoPerfil/tipo-perfis.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
 

@Component({
  selector: 'sigt-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar-modal.component.html',
  styleUrls: ['./registar-ou-editar-modal.component.css']
})
export class RegistarOuEditarModalComponent implements OnChanges, OnDestroy {

 public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  };

  public tipoVinculos: Array<Select2OptionData> = []
  public isLoading: boolean = false
  public pagination = new Pagination();

  regimes: any = [
    { id: null, sigla: 'Todos' },
    { id: 1, sigla: 'Especial' },
    { id: 2, sigla: 'Geral' }
  ]

  totalBase: number = 0
  acesso: string='';
  simpleForm: FormGroup = new FormGroup({})

  modulos: any
  perfis: any

  filtro = {
    page: 1,
    perPage: 5,
    regime: null,
    vinculo: null,
    search: ""
  }

  funcionarios: any[] = []
  funcionariosSelecionados: any = [];
  
  public funcionario: any = null
  public role: any = null
  public modulo: any = null

  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder, 
    private perfilService: TipoPerfisService,
    private perfisOperativoService: PerfisOperativoService,
    private funcionarioServico: FuncionarioService) {this.simpleForm = this.fb.group({});  }

    isLoadingProcess:boolean=false
  ngOnChanges(): void {
 
    this.buscarFuncionarios()
    this.buscarPerfis() 
  }
  ngOnInit(): void {
    this.createForm();
    this.buscarFuncionarios()
    this.buscarPerfis() 
  }
  createForm() {
    this.simpleForm = this.fb.group({ 
      codinome: ['', [Validators.required]],
      perfilId: ['', [Validators.required]],
    });
  }
  

   
  

  buscarFuncionarios() {

    this.isLoading = true;
    this.funcionarioServico.listar(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {

      this.funcionarios = response.data; 
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
      this.filtro.page = 1
    } else if (key == 'regime') {
      this.filtro.regime = $e.target.value;
    } else if (key == 'vinculo') {
      this.filtro.vinculo = $e.target.value;
    }
    this.buscarFuncionarios()
  }

  buscarPerfis(): void {
    const opcoes = {}
    this.perfilService.listar(opcoes)
      .pipe(finalize(() => {}))
      .subscribe((response) => {

        this.perfis = response.map((item: any) => ({
          id: item.id,
          text: item.nome
        }))
        console.log('ad:', this.perfis);
      })
  }

 
  
  onSubmit() {
    if (!this.funcionariosSelecionados || this.funcionariosSelecionados.length === 0) {
      console.log('Nenhum funcionário selecionado');
      return;
    }
  
    if (this.simpleForm.invalid) {
      console.log('Campos inválidos:', this.simpleForm.controls);
      Object.keys(this.simpleForm.controls).forEach(key => {
        const controlErrors = this.simpleForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Erro no campo ${key}:`, controlErrors);
        }
      });
      return;
    }
    
    this.isLoading = true;
  
    // Pegando os IDs dos funcionários selecionados
    const ids = this.funcionariosSelecionados.map((item: any) => item.id);
      
    // Montando a associação
    const associacao = {
      funcionarioId: ids, // IDs dos funcionários selecionados
      ...this.simpleForm.value // Adicionando os valores do formulário
    };
  
    const type = this.perfisOperativoService.registar(associacao);
  
    type.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next:() => {
        this.removerModal();
        this.reiniciarFormulario();
        
        this.eventRegistarOuEditModel.emit(true);
      }
    });
  }
  



  selecionarFuncionario(item: any): void {
    const conjuntoUnico = new Set(this.funcionariosSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.funcionariosSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined): boolean {
    return !!this.funcionariosSelecionados.find((o: any) => o.id === id);
  }

  limparVariaveis(): void {
    this.funcionariosSelecionados = [];
  }

  removerDelituosoSelecionado(item: any): void {
    const posicao = this.funcionariosSelecionados.findIndex((o: any) => o.id === item.id);
    if (posicao !== -1) {
      this.funcionariosSelecionados.splice(posicao, 1);
    }
  }

  removerTodos(): void {
    this.funcionariosSelecionados = [];
  }

 



  reiniciarFormulario() {
    this.simpleForm.reset()
    this.funcionario = null
    this.modulos = null
    this.perfis = null
    this.buscarFuncionarios() 
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  ngOnDestroy(): void {
    this.removerModal()
    this.simpleForm.reset()
    this.funcionario = null 
    this.perfis = null 
  }
}
