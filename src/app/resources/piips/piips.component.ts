import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { ModuloService } from '@core/services/config/Modulo.service';
import { environment } from '@environments/environment';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { Pagination } from '@shared/models/pagination';
import { AppConfig } from 'app/config/app.config';
@Component({
  templateUrl: './piips.component.html',
  styleUrls: ['./piips.component.css'],
})
export class PiipsComponent implements OnInit {
  public pagination = new Pagination();
  returnUrl: string = '';
  modulos: any = [];
  totalBase: number = 0;
  id: number = 0;

  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private secureService: SecureService,
    private authService: AuthService,
    private moduloService: ModuloService,
    private utilService: UtilService,
    public iziToast: IziToastService
  ) {
    console.log('PiipsComponent constructor called');
    console.log('Token available:', !!this.secureService.getTokenValue);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    
    if (!this.secureService.getTokenValue || !this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('User authenticated, proceeding with component initialization');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/piips';
  }

  filtro = {
    search: '',
  };

  ngOnInit(): void {
    console.log('PiipsComponent.ngOnInit called');
    console.log('User modules:', this.authService.modules);
    console.log('User aceder_painel_piips:', this.authService?.user?.aceder_painel_piips);
    
    this.listarTodosModulos();
    
    const sigla = this.authService?.user?.aceder_painel_piips
      ? null
      : this.authService?.modules?.sigla;
    
    console.log('Calculated sigla for redirection:', sigla);
    
    if (sigla) {
      console.log('Redirecting to module:', sigla);
      this.redirecionar(sigla);
    } else {
      console.log('No specific module to redirect to, staying on piips main page');
    }
  }

  get buscarModulo() {
    return this.secureService.getTokenValueDecode().modules;
  }

  /*  listarTodosModulos() {
     this.moduloService.listarTodos(this.filtro).subscribe((response) => {
       this.modulos = response.sort((a: any, b: any) => a.id - b.id);
       this.modulos = response;
     });
   } */

  listarTodosModulos() {
    this.moduloService.listarTodos(this.filtro).subscribe((response) => {
      this.modulos = response.sort((a: any, b: any) => a.id - b.id);
      // this.modulos = response;
      // this.modulos.push({
      //   "id": 22,
      //   "nome": "",
      //   "sigla": "",
      //   "cor": null,
      //   "img": "",
      //   "url": null
      // },{
      //   "id": 23,
      //   "nome": "",
      //   "sigla": "",
      //   "cor": null,
      //   "img": "",
      //   "url": null
      // },{
      //   "id": 24,
      //   "nome": "",
      //   "sigla": "",
      //   "cor": null,
      //   "img": "",
      //   "url": null
      // },{
      //   "id": 25,
      //   "nome": "",
      //   "sigla": "",
      //   "cor": null,
      //   "img": "",
      //   "url": null
      // })
    });
  }

  redirecionar(sigla: string) {
    if (!sigla) return
    switch (sigla) {
      case 'PA':
        this.router.navigate(['/piips/pa']);
        break;
      case 'SIGPQ':
        this.router.navigate(['/piips/sigpg']);
        break;
      case 'SIGPJ':
        this.router.navigate(['/piips/sigpj']);
        break;
      case 'SIGIAC':
        this.router.navigate(['/piips/sigiac']);
        break;
      case 'SIGT':
        this.router.navigate(['/piips/sigt']);
        break;
      case 'SIGAE':
        this.router.navigate(['/piips/sigae']);
        break;
      case 'SIGEF':
        this.router.navigate(['/piips/sigef']);
        break;
      case 'PORPNA':
        this.router.navigate(['/piips/porpna']);
        break;
      case 'SICGO':
        this.router.navigate(['/piips/sicgo']);
        break;
      case 'SIGOP':
        this.router.navigate(['/piips/sigop']);
        break;
      case 'SIGIO':
        this.router.navigate(['/piips/sigio']);
        break;
      case 'SIGE':
        this.router.navigate(['/piips/sigoe']);
        break;
      case 'SIGCOD':
        this.router.navigate(['/piips/sigcod']);
        break;
      case 'SIGDOC':
        this.router.navigate(['/piips/sigdoc']);
        break;
      /* Rotas Provisórias para as novas telas*/
      case 'SIGLOG':
        this.router.navigate(['/piips/siglog']);
        break;
      case 'SIGIP':
        this.router.navigate(['/piips/siip']);
        break;
      /* Fim*/
      case 'SIGM':
        this.router.navigate(['/piips/sigm']);
        break;
      case 'SIGV':
        this.router.navigate(['/piips/sigv']);
        break;
      case 'SIGOE':
        this.router.navigate(['/piips/sigoe']);
        break;
      case 'MGPS':
        this.router.navigate(['/piips/sigps']);
        break;
      case 'PIPNA':
        if (!environment.pipna_url) return;
        this.utilService.redicionarNovaPagina(environment.pipna_url);
        break;

      default:
        // Navigate to a default route or handle other cases as needed
        this.router.navigate(['/piips']);
        break;
    }
  }

  filtrarPagina($e: any) {
    this.filtro.search = $e;
    this.listarTodosModulos();
  }


  onLogout() {
    this.authService.logout();
  }



  // public get ano(): number {
  //   return new Date().getFullYear()
  // }

  public get getAno() {
    return new Date().getFullYear();
  }
}
