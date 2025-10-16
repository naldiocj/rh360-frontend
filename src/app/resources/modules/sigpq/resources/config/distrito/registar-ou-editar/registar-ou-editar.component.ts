import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { ModalService } from '@core/services/config/Modal.service';
import { DistritoService } from '@resources/modules/sigpq/core/service/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sigpq/core/service/config/Municipio.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {


  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false
  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };


  @Input() distrito!: any
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()
  public provincias: Array<Select2OptionData> = []
  public municipios: Array<Select2OptionData> = []


  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['distrito'].previousValue != changes['distrito'].currentValue) {
      this.preenchaForm(this.distrito)
    }
  }
  ngOnInit(): void {
    this.createForm();
    this.buscarProvincias()
  }


  private buscarProvincias() {
    this.provinciaService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.provincias = response.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }

  public handlerProvincia($event: any) {
    if (!$event) return

    const options = { provincia_id: $event };
    this.municipioService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.municipios = response.map((m: any) => ({ id: m.id, text: m.nome }));

    });
  }
  createForm() {
    this.simpleForm = this.fb.group({
      sigla: [''],
      nome: ['', [Validators.required, Validators.minLength(4)]],
      provincia_id: [null, Validators.required],
      municipio_id: [null, Validators.required],
      descricao: [''],
      activo: [1],
    });
  }

  preenchaForm(data: any) {
    this.simpleForm.patchValue({
      provincia_id: data.provincia_id,
      municipio_id: data.provincia_id,
      sigla: data.sigla,
      nome: data.nome,
      descricao: data.descricao,
      activo: data.activo,
    });
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const type = this.buscarId ? this.distritoService.editar(this.simpleForm.value, this.buscarId) : this.distritoService.registar(this.simpleForm.value)

    type.pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.reiniciarFormulario()
      this.modalService.fechar('close')
      this.eventRegistarOuEditModel.emit(true)
    })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
  }



  get buscarId(): number {
    return this.distrito?.id;
  }

  ngOnDestroy(): void {
  }

}
