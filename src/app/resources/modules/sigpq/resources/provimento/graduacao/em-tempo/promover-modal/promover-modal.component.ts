import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { PatenteService } from '@core/services/Patente.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sigpq-promover-modal',
  templateUrl: './promover-modal.component.html',
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class PromoverModalComponent implements OnChanges {

  @Input() emTempo: any = null
  @Output() eventRegistarPromocaoModel = new EventEmitter<boolean>()

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  simpleForm!: FormGroup

  isLoading: boolean = false

  public em_tempo: any

  patentes: Array<Select2OptionData> = []
  actoProgressaos: Array<Select2OptionData> = []
  // modelos: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private actoProgressaoService: ActoProgressaoService,
    private provimentoService: ProvimentoService,
  ) { }

  ngOnChanges(): void {

    this.createForm()
    this.buscarPatente()
    this.buscarActoProgressao()
  }

  createForm() {
    this.simpleForm = this.fb.group({
      patente_id: ['', [Validators.required]],
      numero_despacho: ['', [Validators.required]],
      data_provimento: ['', [Validators.required]],
      anexo: ['', [Validators.required]],
      sigpq_acto_progressao_id: ['', [Validators.required]],
      descricao: ['']
    });
  }

  buscarPatente(): void {
    const opcoes = { patente_em_tempo_id: this.getEmTempoPatenteId }

    this.patenteService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  buscarActoProgressao(): void {
    const opcoes = {}
    this.actoProgressaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.actoProgressaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    this.simpleForm.value.pessoa_id = this.emTempo.id
    this.simpleForm.value.tipo = 'GRADUACAO'

    // const type = this.buscarId() ?
    //   this.veiculoService.editar(this.simpleForm.value, this.buscarId()) :
    this.provimentoService.registar(this.simpleForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe(() => {
        this.removerModal()
        this.reiniciarFormulario()
        this.eventRegistarPromocaoModel.emit(true)
      })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
  }

  buscarId(): number {
    return this.em_tempo?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  setEmTempo(item: any) {
    this.emTempo = item

  }

  get getEmTempoPatenteId() {
    return this.emTempo?.patente_id
  }
}
