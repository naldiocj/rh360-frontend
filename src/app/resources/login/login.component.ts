import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@core/authentication/auth.service'
import { SecureService } from '@core/authentication/secure.service'
import { IziToastService } from '@core/services/IziToastService.service'
import { UtilizadorService } from '@core/services/config/Utilizador.service'
import { finalize } from 'rxjs'
import { AppConfig } from '../../config/app.config'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    novaPassword: new FormControl(null),
    confirmarPassword: new FormControl(null)
  })

  user: any = null

  isLoading: boolean = false
  submitted: boolean = false
  alterarSenha: boolean = false
  inserirSenha: boolean = false

  returnUrl?: string

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(
    private router: Router,
    private utilizadorService: UtilizadorService,
    private authService: AuthService,
    private secureService: SecureService,
    public iziToast: IziToastService,
    private renderer: Renderer2
  ) {
    // this.setDefaultValue()
  }

  ngOnInit(): void {
    console.log('LoginComponent.ngOnInit called');
    console.log('Is authenticated on init:', this.authService.isAuthenticated());
    console.log('Token on init:', this.secureService.getTokenValue);

    if (this.authService.isAuthenticated()) {
      console.log('User already authenticated, redirecting...');
      this.redirecionar()
    }
    /* Configurando a variavel do css com render */
    this.renderer.setStyle(document.documentElement, '--use-color', AppConfig.useColor);
  }

  redirecionar() {
    console.log('Starting redirecionar function');
    console.log('User:', this.authService.user);
    console.log('Modules:', this.authService.modules);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Current URL:', window.location.href);
    
    // Usar apenas o Router do Angular para navegação
    console.log('Navigating to /piips using Angular Router');
    
    this.router.navigate(['/piips'], { replaceUrl: true }).then(() => {
      console.log('Navigation to /piips completed successfully');
    }).catch((error) => {
      console.error('Navigation to /piips failed:', error);
      // Fallback: tentar recarregar a página
      window.location.href = '/piips';
    });
  }

  setDefaultValue() {
    this.loginForm.patchValue({
      email: 'pedro.kondo@pn.gov.ao',
      // password: '12345678'
    })
  }

  buscarUtilizador() {
    // const user = this.use

    this.utilizadorService.buscarUtilizadorPorEmail(this.loginForm.value.email)
      .pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe({
        next: (res) => {

          this.user = res

          if (res.forcar_alterar_senha) {
            this.alterarSenha = true
          }

          this.inserirSenha = true;

          if (res.forcar_alterar_senha) {
            this.iziToast.alerta('Obrigatório alterar a senha ! Para a tua maior segurança.')
          }

        },
        error: (res) => {
          this.alterarSenha = false
          this.inserirSenha = false
          // console.log(res);
        }
      })
  }

  onSubmit(): void {
    this.isLoading = true

    if (this.alterarSenha) {
      this.authService.alterarSenha(this.loginForm.value).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ).subscribe({
        next: () => {
          this.loginForm.patchValue({
            password: null
          })
          this.inserirSenha = true
          this.alterarSenha = false
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.iziToast.erro('Erro ao alterar senha.');
        }
      })
      return
    }

    // Enviar apenas email e password
    const loginPayload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Attempting login with:', loginPayload);

    this.authService.login(loginPayload).pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        console.log('User data:', this.authService.user);
        console.log('Modules:', this.authService.modules);
        console.log('Token:', this.secureService.getTokenValue);
        console.log('Is authenticated after login:', this.authService.isAuthenticated());
        console.log('LocalStorage currentUserLogin:', localStorage.getItem('currentUserLogin'));
        
        this.reiniciarFormulario()
        
        // Verificar se o token foi armazenado corretamente
        if (!this.secureService.getTokenValue?.token) {
          console.error('Token not found after login!');
          this.iziToast.erro('Erro: Token não foi armazenado corretamente.');
          return;
        }
        
        // Aguardar um pouco para garantir que os dados do usuário foram carregados
        setTimeout(() => {
          console.log('Executing redirecionar after 300ms...');
          this.redirecionar()
        }, 300);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.iziToast.erro('Erro no login. Verifique suas credenciais.');
      }
    })
  }

  reloadPage(): void {
    window.location.reload()
  }

  reiniciarFormulario() {
    this.loginForm.reset()
    this.submitted = false
    this.isLoading = false
  }
  ngOnDestroy(): void {
    this.reiniciarFormulario()
  }


  public mostrarSenha(id: any, evt: any) {
    const input: any = document.querySelector(`#${id}`)
    if (input) {
      if (evt.target.classList.toString().includes('bi-eye-fill')) {
        input.type = "text"
      } else if (evt.target.classList.toString().includes('bi-eye-slash-fill')) {
        input.type = 'password'
      }
    }
    evt.target.classList.toggle('bi-eye-fill')
    evt.target.classList.toggle('bi-eye-slash-fill')
  }

}
