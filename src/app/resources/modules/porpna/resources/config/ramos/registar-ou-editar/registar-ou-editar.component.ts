import { finalize } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RamoService } from '@resources/modules/porpna/core/service/config/faa-ramo.service';
import { ModalService } from '@core/services/config/Modal.service';



@Component({
  selector: 'porpna-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {

  public simpleForm!: FormGroup
  public isLoading: boolean = false;
  @Output() public onSucesso: EventEmitter<any>
  @Input() public ramo: any
  constructor(private fb: FormBuilder, private ramoService: RamoService, private modalService: ModalService) {
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ramo'].previousValue != changes['ramo'].currentValue) {
      this.preenchaForm(this.ramo)
    }
  }

  ngOnInit(): void {
    this.criarForm()
  }

  private preenchaForm(data:any){
    this.simpleForm.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      descricao: data.descricao
    })
  }
  private criarForm() {
    this.simpleForm = this.fb.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      sigla: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(20)])]
    })
  }


  public onSubmit() {

    this.isLoading = true
    const type = this.getRamoId ? this.ramoService.editar(this.simpleForm.value, this.getRamoId) : this.ramoService.registar(this.simpleForm.value)

    type.pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.modalService.fechar('close')
        this.resetForm()
        this.onSucesso.emit({ sair: true })
      }
    })

  }
  public resetForm() {
    this.simpleForm.reset()
  }

  public get getRamoId() {
    return this.ramo?.id
  }

}
