import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  simpleForm!: FormGroup

  options: any = {
    placeholder: 'Selecione uma opção'
  }


  constructor(
    private fb: FormBuilder
  ) { }
  

  ngOnInit(): void {
  }

}