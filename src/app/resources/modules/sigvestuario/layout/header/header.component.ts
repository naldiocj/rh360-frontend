import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'sigvest-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService, private secureService: SecureService) { }
  ngOnInit(): void { }

  verNotificacoes() { }
  public sair(): void {
    this.auth.logout();
  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo
  }

  /** Está secção se encarrega de extender o main e ocultar o sidebar e vice-versa */
  flag = false;
  toggle(): void {
    const main: HTMLElement | any = document.querySelector('#m');
    const asidebar: HTMLElement | any = document.querySelector('#a');

    if (!this.flag) {
      main.style.width = '100%';
      // Se quiser esconder o "asidebar", você também pode ajustar aqui
      //asidebar.style.display = 'none';   ou
      asidebar.style.width = '0';
      this.flag = !this.flag
    } else {
      main.style.width = '83%';
      asidebar.style.width = '17%';
      this.flag = !this.flag
    }

  }

  public fecharMenuMobile() {
    const menu_mobile: HTMLElement | any = document.querySelector('#menu-mobile-nmg');

    $(menu_mobile).css({ 'transition': 'all 2s linear', 'opacity': '0' });
    $(menu_mobile).hide();
  }

  public abrirMenuMobile() {
    const menu_mobile: HTMLElement | any = document.querySelector('#menu-mobile-nmg');

    $(menu_mobile).css({ 'transition': 'all 2s linear', 'opacity': '1' });
    $(menu_mobile).show()
  }

  validarSair() {
    Swal.fire({
      title: "Terminar sessão?",
      html: `Sr(a). <strong>${this.nomeUtilizador}</strong>, Tem certeza de que deseja sair?`,
      icon: "warning",
      cancelButtonText: 'Cancelar',
      // timer: 2000,
      showCancelButton: true,
      confirmButtonText: "Sim, Sair!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-2 mr-1',
        cancelButton: 'btn btn-danger ms-2 px-2',
      },
    }).then((result: any) => {

      if (result.value) {
        this.sair();
      }

    })
  }
}
