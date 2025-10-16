import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpj-alterar-password',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {


  diversoForm!: FormGroup
  public user: any
  public utilizador: any


  constructor(private secureService: SecureService, private router:Router,
    private utilizadorService: UtilizadorService, private auth:AuthService) { }


  ngOnInit(): void {
    this.diversoForm = new FormGroup({
      senha_antiga: new FormControl('', [Validators.required]),
      nova_senha: new FormControl('', [Validators.required]),
    })
    this.getUser()
    this.buscarUser()


  }
  sair() {
    this.auth.logout();
  }

  getUser() {
    this.user = this.secureService.getTokenValueDecode().user
  }
  buscarUser(){
    this.utilizadorService.verUm(this.user.id)
    .subscribe(response=>{
      this.utilizador = response
      
    console.log('user', this.utilizador)
    })
  }



  registrar() {
    if (!this.diversoForm.get("senha_antiga")?.value || !this.diversoForm.get("nova_senha")?.value) {
      alert("Campos estão vazios!")
      return
    } 
    const input = {
      username: this.utilizador.username ,
      email: this.utilizador.email,
      password:this.utilizador.password,
      pessoa_id:this.utilizador.pessoa_id,  
      nova_senha: this.diversoForm.get("nova_senha")?.value,
      senha_antiga:this.diversoForm.get("senha_antiga")?.value
    }  

    this.utilizadorService.editar(input, this.user.id)
    .subscribe(response=>{
      this.sair()
    })

  }

}
