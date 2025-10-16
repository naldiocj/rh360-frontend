import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { ModalService } from '@core/services/config/Modal.service';
import { ModuloService } from '@core/services/config/Modulo.service';
import { PerfilService } from '@core/services/config/Perfil.service';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar-modal.component.html',
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class RegistarOuEditarModalComponent implements OnInit, OnChanges {

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false

  modulos: any
  perfis: any
  @Input() perfil: any


  destroy$ = new Subject<void>()

  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder,
    private moduloService: ModuloService,
    private perfilService: PerfilService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarModulos()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['perfil'].currentValue != changes['perfil'] && this.perfil != null) {
      this.preenchaForm()
    }
  }

  createForm() {
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      modulo_id: ['', [Validators.required]],
      descricao: ['']
    });
  }

  preenchaForm() {

    console.log(this.perfil)
    this.simpleForm.patchValue({
      nome: this.perfil.nome,
      name: this.perfil.name,
      modulo_id: this.perfil.modulo_id,
      descricao: this.perfil.descricao
    });
  }


  buscarModulos(): void {
    const opcoes = {}
    this.moduloService.listar(opcoes)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {

        })
      )
      .subscribe((response) => {
        this.modulos = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome
        }))

      })
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const type = this.buscarId ? this.perfilService.editar(this.buscarId, this.simpleForm.value) : this.perfilService.registar(this.simpleForm.value)
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
  }

  get buscarId(): number {
    return this.perfil?.id;
  }

  public removerModal() {
    this.modalService.fechar('btn-close-registar')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
