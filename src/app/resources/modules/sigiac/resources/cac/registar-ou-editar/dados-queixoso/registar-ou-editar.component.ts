import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigiac-dados-queixoso',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class DadosQueixosoComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public isLoading: boolean = false
  @Input() dadosForm: any


  public generos: Array<Select2OptionData> = [];
  public estadoCivil: Array<Select2OptionData> = [];
  public naturalidades: Array<Select2OptionData> = [];


  constructor(private estadoCilvilServico: EstadoCivilService,
    private fb: FormBuilder) {
    this.naturalidades = [{ id: "0", text: 'Selecione' }, { id: "angolana", text: 'angolana' }, { text: 'brazileira', id: "brazileira" }];
    this.generos = [ { id: "0", text: 'Selecione' }, { id: "masculino", text: 'masculino' }, { text: 'femenino', id: "femenino" }]

  } 


  ngOnInit(): void {
    this.setarEstados()
  }


  setarEstados() {
    const options = {}
    this.estadoCilvilServico
      .listar(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.estadoCivil = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

      });

  }



}
