import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { FaaPatenteService } from '@resources/modules/porpna/core/service/config/faa-patente.service';
import { RamoService } from '@resources/modules/porpna/core/service/config/faa-ramo.service';
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
  @Input() public patente: any
  public ramos: Array<Select2OptionData> = []
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  constructor(private fb: FormBuilder, private faaPatenteService: FaaPatenteService, private modalService: ModalService, private ramoService: RamoService) {
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patente'].previousValue != changes['patente'].currentValue) {
      this.preenchaForm(this.patente)
    }
  }

  ngOnInit(): void {
    this.criarForm()
    this.buscarRamos()
  }

  private buscarRamos() {
    this.ramoService.listar().pipe().subscribe({
      next: (response: any) => {
        this.ramos = response.map((item: any) => ({ id: item.id, text: `${item.sigla} - ${item.nome}` }))
      }
    })
  }

  private preenchaForm(data: any) {
    this.simpleForm.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      descricao: data.descricao,
      porpna_faa_ramo_id: data.porpna_faa_ramo_id,
      classe: data.classe
    })
  }
  private criarForm() {
    this.simpleForm = this.fb.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      sigla: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      porpna_faa_ramo_id: ['', Validators.required],
      classe: ['', [Validators.required, Validators.minLength(3)]]
    })
  }


  public onSubmit() {

    this.isLoading = true
    const type = this.getPatenteId ? this.faaPatenteService.editar(this.simpleForm.value, this.getPatenteId) : this.faaPatenteService.registar(this.simpleForm.value)

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

  public get getPatenteId() {
    return this.patente?.id
  }


}
