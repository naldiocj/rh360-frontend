import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css'],
})
export class RegistrarOuEditarComponent implements OnInit {


  simpleForm!: FormGroup

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}
}
