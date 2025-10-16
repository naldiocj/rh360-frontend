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
import { ModuloService } from '@core/services/config/Modulo.service';
import { PerfilService } from '@core/services/config/Perfil.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigt-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar-modal.component.html',
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      } 
  `]
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

  @Input() public utilizador: any = null
  public funcionario: any = null
  public role: any = null
  public modulo: any = null

  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder,
    private moduloService: ModuloService,
    private perfilService: PerfilService,
    private utilizadoresServico: UtilizadorService,
    private funcionarioServico: FuncionarioService) { }

  ngOnChanges(): void {
    this.createForm();
    this.buscarFuncionarios()
    this.buscarModulos()
  }

  createForm() {
    this.simpleForm = this.fb.group({
      id: [this.idUtilizador ? null : this.idUtilizador],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['@pn.gov.ao', [Validators.required, Validators.minLength(6)]],
      password: ['', this.idUtilizador ? null : [Validators.required, Validators.minLength(4)]],
      modulo_id: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
      aceder_todos_agentes: [false],
      aceder_painel_piips: [false],
    });

    if (this.idUtilizador) {
      this.editForm()
    }

  }

  editForm() {
    if (this.utilizador) {

      this.buscarFuncionario(this.utilizador.funcionario_id)

      this.simpleForm.patchValue({
        id: this.utilizador.id,
        username: this.utilizador.username,
        email: this.utilizador.email,
        // password: this.utilizador.id, // ¿Es correcto asignar el ID como contraseña?
        modulo_id: this.utilizador.modulo_id,
        role_id: this.utilizador.role_id,
        aceder_todos_agentes: this.utilizador.aceder_todos_agentes,
        aceder_painel_piips: this.utilizador.aceder_painel_piips,
      });
    }

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

  buscarFuncionario(idFuncionario: number) {

    this.funcionarioServico.buscarUm(idFuncionario).pipe(
      finalize(() => {

      })
    ).subscribe((response) => {
      this.funcionario = response
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

  buscarPerfis(id: number): void {
    this.perfilService.listarPorModulo(id)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe((response) => {
        this.perfis = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  buscarModulos(): void {
    const opcoes = {}
    this.moduloService.listar(opcoes)
      .pipe(
        finalize(() => {

          if (this.idUtilizador) {
            this.buscarPerfis(this.utilizador.modulo_id)
          }
        })
      )
      .subscribe((response) => {

        this.modulos = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome
        }))

      })
  }

  temItemFuncionario: boolean = true

  selecionarFuncionario(item: any) {
    this.funcionario = item
    this.simpleForm.patchValue({
      password: 12345678
    })
  }

  temItemModulo: boolean = true
  selecionarModulo(item: any) {
    if (item && this.temItemModulo) {
      this.temItemModulo = false
      this.simpleForm.controls['modulo_id'].valueChanges.subscribe(
        (item) => {
          this.buscarPerfis(item)
        }
      );
    }
  }

  get idUtilizador() {
    return this.utilizador?.id
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    this.simpleForm.value.pessoa_id = this.funcionario.id

    const type = this.utilizador ?
      this.utilizadoresServico.editar(this.simpleForm.value, this.utilizador.id) :
      this.utilizadoresServico.registar(this.simpleForm.value)

    type.pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.removerModal()
      this.reiniciarFormulario()
      this.eventRegistarOuEditModel.emit(true)
    })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
    this.funcionario = null
    this.modulos = null
    this.perfis = null
    this.buscarFuncionarios()
    this.buscarModulos()
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  ngOnDestroy(): void {
    this.removerModal()
    this.simpleForm.reset()
    this.simpleForm.value.email = '@pn.gov.ao'
    this.funcionario = null
    this.modulos = null
    this.perfis = null
    this.utilizador = null
  }
}
