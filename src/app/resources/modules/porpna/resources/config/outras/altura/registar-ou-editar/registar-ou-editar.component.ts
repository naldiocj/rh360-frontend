import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { AlturaService } from '@resources/modules/porpna/core/service/config/other/altura.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'porpna-registar-ou-editar-altura',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {

  public simpleForm!: any
  public isLoading: boolean = false;
  @Output() public onSucesso: EventEmitter<any>
  @Input() public altura: any
  public genero: Array<Select2OptionData> = []
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  constructor(private fb: FormBuilder, private alturaService: AlturaService, private modalService: ModalService,) {
    this.onSucesso = new EventEmitter<any>()
    this.genero = [{ id: '', text: '' }, { id: 'M', text: 'Masculino' }, { id: 'F', text: 'Femenino' }]
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['altura']?.previousValue != changes['altura']?.currentValue) {
      this.preenchaForm(this.altura)
    }
  }

  ngOnInit(): void {
    this.criarForm()

  }



  private preenchaForm(data: any) {
    this.simpleForm.patchValue({
      altura_min: data.altura_min,
      altura_max: data.altura_max,
      genero: data.genero,
      // descricao: data.descricao

    })
  }
  private criarForm() {
    this.simpleForm = this.fb.group({
      altura_min: ['', Validators.required],
      altura_max: ['', Validators.required],
      genero: ['', Validators.required],
      // descricao: ['', Validators.required]

    })
  }


  public onSubmit() {

    this.isLoading = true
    const type = this.getAlturaId ? this.alturaService.editar(this.simpleForm.value, this.getAlturaId) : this.alturaService.registar(this.simpleForm.value)

    type.pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.modalService.fechar('close')
        this.resetForm()
        this.onSucesso.emit({ sair: true })
      }
    })

  }
  public resetForm() {
    this.simpleForm.reset()
  }

  public get getAlturaId() {
    return this.altura?.id
  }


  public getGenero(genero: any) {
    return genero == "M" ? "Masculino" : genero == "F" ? "Femenino" : "F"
  }
}
