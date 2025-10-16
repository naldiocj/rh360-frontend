import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { ChefiaComandoService } from '@resources/modules/sigpq/core/service/Chefia-Comando.service';
import { TipoChefeComandoService } from '@resources/modules/sigpq/core/service/config/Tipo-Chefia-Comando.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnDestroy {

  public destroy$ = new Subject<void>()

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false

  public nivel: any = null
  public tipoChefiaComandos: Array<Select2OptionData> = []
  pessoajuridicas: Array<Select2OptionData> = []
  departamentos: Array<Select2OptionData> = []
  departamentosClone: any = []
  seccaos: Array<Select2OptionData> = []
  auxTipoChefiaComandos: any[] = []
 nivel_de_chefia_selecionado:string='muito-alto'
  @Input() public seccao: any = null
  @Input() public pessoaId: any = null
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private tipoChefiaComandoService: TipoChefeComandoService,
    private fb: FormBuilder,
    private seccaoService: SeccaoService,
    private modalService: ModalService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private unidadeService: UnidadeService,
    private chefiaComandoService: ChefiaComandoService) { }

  ngOnInit(): void {
    this.buscarTipoChefia()
    this.createForm();
    this.buscarTipoEstruturaOrganica()
    this.ocultarInput()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaId'].currentValue != changes['pessoaId'].previousValue && this.pessoaId != null) {
      this.simpleForm.get('pessoafisica_id')?.setValue(this.getPessoaId)
      this.simpleForm.updateValueAndValidity()

    }
  }


  private buscarTipoChefia() {
    this.tipoChefiaComandoService.listarTodos({}).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.tipoChefiaComandos = response.map((item: any) => ({ id: item?.id, text: item.nome }))
        this.auxTipoChefiaComandos = response
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  private preenchaForm() {

    this.selecionarOrgaoOuComandoProvincial(this?.seccao?.tipo_estrutura_organica_sigla)

    this.simpleForm.patchValue({
      sigpq_tipo_chefia_comando: [null, Validators.required],
      pessoajuridica_id: [null, Validators.required],
      pessoafisica_id: [this.getPessoaId, Validators.required],
      descricao: [''],
      activo: [true],
    });

  }

  createForm() {
    this.simpleForm = this.fb.group({
      estruturaOrganica: [null, Validators.required],
      sigpq_tipo_chefia_comando_id: [null, Validators.required],
      pessoajuridica_id: [null, Validators.required],
      pessoafisica_id: [this.getPessoaId, Validators.required],
      descricao: [''],
      activo: [true],
    });

  }

  imprimirErros()
  {
    console.log("Erros detectados:",this.simpleForm.errors);
  }

  buscarSeccoes($evt: any) {
    if (!$evt) return

    const options = { departamentoId: $evt };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.seccaos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))

    });
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = []
        let aux = response.map((item: any) => ({ id: item.sigla, text: item.name }))
        this.tipoEstruturaOrganicas.push(...aux)
      })
  }

  public validarChefia($event: any) {
    this.nivel = null
    this.tipoEstruturaOrganicas = []
    this.buscarTipoEstruturaOrganica()
    this.selecionarOrgaoOuComandoProvincial(null)
    this.ocultarInput()

    if (!$event) return

    const [chefia] = this.auxTipoChefiaComandos.filter((item: any) => item?.id == $event)



    const orgao: any = {
      'muito-alto': ['tipo-orgao', 'direcao'],
      'alto': ['tipo-orgao', 'direcao', 'departamento'],
      'medio': ['tipo-orgao', 'direcao', 'departamento', 'seccao'],
      'baixo': ['tipo-orgao', 'direcao', 'departamento', 'seccao', 'posto'],
    }

    this.nivel_de_chefia_selecionado=chefia.nivel
    if (!orgao.hasOwnProperty(chefia.nivel)) return

    for (let item of orgao[chefia.nivel]) {
      const element: HTMLElement = document.querySelector(`[data-input="${item}"]`) as HTMLElement

      const elementParent = element.parentElement

      element.style.display = 'block'
      if (elementParent)
        elementParent.style.display = "block"

    }

  }


  private ocultarInput() {
    const elementos: Array<HTMLElement> = Array.from(document.querySelectorAll('[data-input]'))

    if (!elementos) return

    elementos.forEach((elemento: HTMLElement) => {
      if (elemento.parentElement) {
        elemento.parentElement.style.display = 'none'
      }
      elemento.style.display = "none"

    })
  }

  public selecionarDireccao($event: any): void {
    if (!$event || this.nivel_de_chefia_selecionado=='muito-alto') return
    const opcoes = {
      pessoafisica: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {
         
        })
      )
      .subscribe((response: any): void => {
        this.departamentosClone = response
        this.departamentos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  public selecionarDepartamento($evt: any): void {

    if (!$evt) return

    const options = { departamentoId: $evt };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.seccaos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      
    });

    
  }

  onSubmit() {


    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const type = this.buscarId() ? this.chefiaComandoService.editar(this.simpleForm.value, this.buscarId()) : this.chefiaComandoService.registar(this.simpleForm.value).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {
        this.isLoading = false
      })
    ).subscribe((): void => {
      this.reiniciarFormulario()
      this.modalService.fechar('close')
      this.eventRegistarOuEditModel.emit(true)
    })



    // console.log(this.simpleForm.value)
    // this.isLoading = true
    // const type =
    //   this.buscarId() ?
    //     this.unidadeService.editar(this.simpleForm.value, this.buscarId()) :
    //     this.unidadeService.registar(this.simpleForm.value)

    // type.pipe(
    //   finalize(() => {
    //     this.isLoading = false
    //   })
    // ).subscribe(() => {
    //   this.reiniciarFormulario()
    //   this.modalService.fechar('close')
    //   this.eventRegistarOuEditModel.emit(true)
    // })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
    this.simpleForm.patchValue({
      tipo_pessoajuridica_id: 8,
      orgao_comando_provincial: 'Posto Policial',
      activo: [true],
    })
  }

  buscarId(): number {
    return this.seccao?.id;
  }


  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.pessoajuridicas = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  public get getPessoaId() {
    return this.pessoaId
  }

}
