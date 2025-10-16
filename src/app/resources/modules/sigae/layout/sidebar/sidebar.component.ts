import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { HelpingService } from '../../core/helping.service';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  protected is!:number;
    constructor(public auth: AuthService, private secureService: SecureService) {}
  
  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id
  }

  public get getRoleNome() {
    return this.secureService.getTokenValueDecode()?.role?.nome
  }

  ngOnInit(): void {
    console.log(this.secureService.getTokenValueDecode())
    console.log(this.auth.isPermission())

  }
  sair() {
    this.auth.logout();
  }

  // Método para verificar a permissão do usuário
  hasPermission(requiredRole: string): boolean {
    const role = this.getRoleNome;
    // Se a role do usuário for 'Root', retorna true para todas as permissões
    if (role === 'Root') {
      return false;
    }
    return role === requiredRole;
  }
}
