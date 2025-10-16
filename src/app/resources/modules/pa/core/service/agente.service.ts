import { Injectable } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { MeuOrgaoService } from './meu-orgao.service';

@Injectable({
  providedIn: 'root',
})
export class AgenteService {
  constructor(
    private auth: AuthService,
    private secure: SecureService,
  ) {}

  get name() {
    return this.secure.getTokenValueDecode().user.nome_completo;
  }

  get id() {
    return this.secure.getTokenValueDecode().user['pessoas_id'];
  }

  get email() {
    return this.secure.getTokenValueDecode().user.email;
  }

  get activo() {
    const tokenData = this.secure.getTokenValueDecode();
    return !!tokenData?.user?.activo;
  }




  sair() {
    this.auth.logout();
  }
}
