import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecureService } from '@core/authentication/secure.service';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit{

  userForm!:FormGroup
  constructor( private fb:FormBuilder,
    private secureService: SecureService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      senha_antiga:[null, [Validators.required]],
      senha_nova:[null, [Validators.required]],
      senha_confirm:[null, [Validators.required]]

    })

    console.log(this.user)
  }

  get user(){
    return this.secureService.getTokenValueDecode().user

  }

  onSubmit(){
    if(this.userForm.get('senha_antiga')?.value == null || 
    this.userForm.get('senha_nova')?.value == null ||
    this.userForm.get('senha_confirm')?.value == null  ){
      window.alert("Não pode conter espaços vazios!")
      return
    }


    if(this.userForm.get('senha_nova')?.value != this.userForm.get('senha_confirm')?.value ){
      window.alert("As senhas não combinam!")
      return
    }

    //if(this.userForm.get('senha_antiga')?.value )


  
    window.alert("Alterado com Sucesso!")

  }

}
