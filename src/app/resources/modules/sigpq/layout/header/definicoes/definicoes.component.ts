import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { ModalService } from '@core/services/config/Modal.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-definicoes',
  templateUrl: './definicoes.component.html',
  styleUrls: ['./definicoes.component.css']
})
export class DefinicoesComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    novaPassword: new FormControl(null),
    confirmarPassword: new FormControl(null)
  })

  isLoading: boolean = false

  constructor(private authService: AuthService,
    private modalService: ModalService,
    private secureService: SecureService) { }

  ngOnInit(): void {
  }

  get utilizador() {
    return this.secureService.getTokenValueDecode().user || {};
  }
  

  onSubmit(): void {

    this.isLoading = true

    this.loginForm.patchValue({
      email: this.utilizador.email
    })

    this.authService.alterarSenha(this.loginForm.value).pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.modalService.fechar('closed')
    })

  }

}
