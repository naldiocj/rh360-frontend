import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormadoresService } from '@resources/modules/sigef/core/service/formadores.service';
import { FormadorModel } from '@resources/modules/sigef/shared/model/formador.model';

@Component({
  selector: 'app-perfil-utilizador',
  templateUrl: './perfil-utilizador.component.html',
  styleUrls: ['./perfil-utilizador.component.css']
})
export class PerfilUtilizadorComponent implements OnInit {
  @Output() RegistrarOuEditarFormadorModel = new EventEmitter<boolean>();

  formador: FormadorModel = new FormadorModel()

  simpleForm!: FormGroup

  totalBase: number = 0
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',

  }


  constructor(
    private fb: FormBuilder,
    private formadorService: FormadoresService
    ) { }

  ngOnInit(): void {
  }

 



}
