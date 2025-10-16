import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Component, Input, OnInit } from '@angular/core'
import { finalize } from 'rxjs'

import { Select2OptionData } from 'ng-select2'

import { TipoMeioService } from '@resources/modules/sigpq/core/service/Tipo-meio.service'

@Component({
  selector: 'app-sigpq-mobilidade-orgao-provincial',
  templateUrl: './orgao-provincial.component.html',
  styleUrls: ['./orgao-provincial.component.css']
})
export class OrgaoProvincialComponent implements OnInit {

  public formatAccept = ['.pdf']

  @Input() simpleForm: any

  tipoMeios: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private tipoMeioService: TipoMeioService) { }

  ngOnInit(): void {
    this.buscarTipoMeio()
  }

  buscarTipoMeio(): void {
    const opcoes = {}
    this.tipoMeioService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoMeios = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  get meios(): FormArray {
    return this.simpleForm.get("meios") as FormArray
  }

  novoMeio(): FormGroup {
    return this.fb.group({
      tipo_meio_id: ['', Validators.required],
      tamanho: ['', Validators.required],
      quantidade: ['', Validators.required]
    })
  }

  adicionar() {
    this.meios.push(this.novoMeio())
  }

  remover(index: number) {
    this.meios.removeAt(index)
  }

}
