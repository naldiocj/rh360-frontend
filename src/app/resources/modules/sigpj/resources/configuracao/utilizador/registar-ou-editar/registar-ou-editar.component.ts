import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import { PerfilService } from '@resources/modules/sigpj/core/service/Perfil.service';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';
import { Pagination } from '@shared/models/pagination';
import { Funcionario } from '@shared/models/Funcionario.model';

@Component({
  selector: 'sigpj-registar-ou-editar-utilizador',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {
  @Output() eventoRegistarOuEditarUtilizadorModel = new EventEmitter<boolean>()

  @Input() utilizador: any
  simpleForm!: FormGroup

  isLoading: boolean = false
  submitted: boolean = false
  public pagination = new Pagination();
  Agentes = new Array<Funcionario>()
  isAgente: Array<Select2OptionData> = []
  perfis: Array<Select2OptionData> = []
  
  totalBase: number = 0;
  options: any = {
    // multiple: true,
    // theme: 'classic',
    // closeOnSelect: false,
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private utilizadorService: UtilizadorService) { }

  ngOnChanges(): void {

    this.buscarAgentes()
    this.buscarPerfil()
    this.createForm()
    if (this.lerId()) {
      this.editarUtilizador()
    }


  }

  lerId() {
    return this.utilizador?.id
  }

  createForm() {
    this.simpleForm = this.fb.group({
      email: [null, [Validators.required, Validators.minLength(7), Validators.email]],
      username: [null, [Validators.required]],
      nao_existe: [null, [Validators.required]],
      password: [null, [Validators.required]],
      role_id: [null, [Validators.required]],
      pessoa_id: [null, [Validators.required]],
    })

    if (this.lerId()) {
      this.editarUtilizador()
    }
  }

  editarUtilizador() {

    this.simpleForm.patchValue({
      id: this.utilizador.id,
      email: this.utilizador.email,
      username: this.utilizador.username,
      nao_existe: this.utilizador.username,
      password: this.utilizador.password,
      role_id: this.utilizador.role_id,
      pessoa_id: this.utilizador.pessoa_id
    })
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.submitted) {
      return
    }

    this.isLoading = true
    this.submitted = true

    if (this.lerId()) {
      // adicionar array de outros anexos
      this.utilizadorService.editar(this.simpleForm.value, this.lerId()).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {
        this.removerModal()
        this.onReset()
        this.eventoRegistarOuEditarUtilizadorModel.emit(true)
      })
      return
    }
   // console.log("id", this.lerId())

    this.utilizadorService.registar(this.simpleForm.value).pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.removerModal()
      this.onReset()
      this.eventoRegistarOuEditarUtilizadorModel.emit(true)
    })
  }

  buscarAgentes(): void { 

    
    const options = {}
    this.utilizadorService.buscarAgentes(this.filtro)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response) => {
         console.log("searching for agents", response)
        this.Agentes = response.data


        this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
      
      
     
      })
  }


  selectedAgent(item: any) {

    console.log("ver pessoa", item)
    this.simpleForm.patchValue({
      nao_existe:item.nome_completo,
      pessoa_id:item.id
    })

  }

  buscarPerfil(): void {
    const opcoes = {}
    this.perfilService.listar(opcoes)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe((response) => {
        // console.log("perfils", response)
        this.perfis = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  onReset(): void {
    this.simpleForm.reset()
    this.submitted = false
    this.isLoading = false
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
    // $('body').removeClass("modal-open");
  }

  ngOnDestroy(): void {
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarAgentes();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarAgentes();
  }
}
