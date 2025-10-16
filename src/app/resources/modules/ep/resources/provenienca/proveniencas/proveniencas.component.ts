import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-proveniencas',
  templateUrl: './proveniencas.component.html',
  styleUrls: ['./proveniencas.component.css']
})
export class ProveniencasComponent implements OnInit {

  simpleForm!: FormGroup

  constructor() { }

  ngOnInit(): void {
  }

}
