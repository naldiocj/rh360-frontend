import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { IdadeService } from '@resources/modules/porpna/core/service/config/other/idade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'porpna-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {

  public simpleForm!: FormGroup
  public isLoading: boolean = false;
  @Output() public onSucesso: EventEmitter<any>
  @Input() public idade: any
  public genero: Array<Select2OptionData> = []
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  constructor(private fb: FormBuilder, private idadeService: IdadeService, private modalService: ModalService) {
    this.onSucesso = new EventEmitter<any>()
    this.genero = [{ id: '', text: '' }, { id: 'M', text: 'Masculino' }, { id: 'F', text: 'Femenino' }]
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idade'].previousValue != changes['idade'].currentValue) {
      this.preenchaForm(this.idade)
    }
  }

  ngOnInit(): void {
    this.criarForm()

  }

  private preenchaForm(data: any) {
    this.simpleForm.patchValue({
      idade_min: data.idade_min,
      idade_max: data.idade_max,
      genero: data.genero,
      // descricao: data.descricao
    })
  }
  private criarForm() {
    this.simpleForm = this.fb.group({
      idade_min: ['', Validators.required],
      idade_max: ['', Validators.required],
      genero: ['', Validators.required],
      // descricao: ['', Validators.required]
    })
  }

  public onSubmit() {

    this.isLoading = true
    const type = this.getIdadeId ? this.idadeService.editar(this.simpleForm.value, this.getIdadeId) : this.idadeService.registar(this.simpleForm.value)

    type.pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.modalService.fechar('btn-close')
        this.resetForm()
        this.onSucesso.emit({ sair: true })
      }
    })

  }
  public resetForm() {
    this.simpleForm.reset()
  }

  public get getIdadeId() {
    return this.idade?.id
  }


  public getGenero(genero: any) {
    return genero == "M" ? "Masculino" : genero == "F" ? "Femenino" : "F"
  }

}
