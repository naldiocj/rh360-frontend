import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpedienteDiipService } from '@resources/modules/sicgo/core/service/piquete/iip/diip/expediente-diip.service';
 

@Component({
  selector: 'app-sicgo-diip-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  expedienteForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private expedienteService: ExpedienteDiipService
  ) {
    this.expedienteForm = this.fb.group({
      denunciante: ['', Validators.required],
      descricao: ['', Validators.required],
      opcs: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.expedienteForm.valid) {
      this.expedienteService.registar(this.expedienteForm.value)
        .subscribe((response: any) => {
          console.log('Expediente criado:', response)
          this.expedienteForm.reset()
        })
    }
  }
}
