import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { UnidadeService } from '@resources/modules/porpna/core/service/config/faa-unidade.service';
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
  @Input() public unidade: any
  constructor(private fb: FormBuilder, private unidadeService: UnidadeService, private modalService: ModalService) {
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unidade'].previousValue != changes['unidade'].currentValue) {
      this.preenchaForm(this.unidade)
    }
  }

  ngOnInit(): void {
    this.criarForm()
  }

  private preenchaForm(data: any) {
    this.simpleForm.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      endereco: data.endereco,
      descricao: data.descricao
    })
  }
  private criarForm() {
    this.simpleForm = this.fb.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      sigla: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(20)])]
    })
  }


  public onSubmit() {

    this.isLoading = true
    const type = this.getUnidadeId ? this.unidadeService.editar(this.simpleForm.value, this.getUnidadeId) : this.unidadeService.registar(this.simpleForm.value)

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

  public get getUnidadeId() {
    return this.unidade?.id
  }

}
