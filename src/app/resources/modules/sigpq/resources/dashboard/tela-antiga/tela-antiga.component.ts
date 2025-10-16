import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { TokenData } from '@shared/models/token.model';
import { Router } from '@angular/router';
import { UrlService } from '@core/helper/Url.helper';
import { AuthService } from '@core/authentication/auth.service';
import { DashboardService } from '../../../core/service/Dashboard.service';

@Component({
  selector: 'app-tela-antiga',
  templateUrl: './tela-antiga.component.html',
  styleUrls: ['./tela-antiga.component.css']
})
export class TelaAntigaComponent implements OnInit {
dashboards: any = []
  public setup: TokenData
  public direcaoNome: string = ''
  isLoading: boolean = false

  constructor(
    private url: UrlService,
    private dashboardService: DashboardService,
    private secureService: SecureService,
    private authService: AuthService) {
    this.setup = this.secureService.getTokenValueDecode();
  }

  ngOnInit(): void {
    this.buscarDashboards()
  }

  redirect(url: any) {

    const params = url;

    this.url.url('/sigpg/funcionario/listar', params);
  }

  public get getModulo() {
    return this.authService?.user?.aceder_todos_agentes ?
      'DPQ - DIRECÇÃO DE PESSOAL E QUADROS ' :
      `${this.setup.orgao?.sigla || ''} - ${this.setup.orgao?.['nome_completo'] || ''}`;
  }

  buscarDashboards() {
    this.isLoading = true;
    this.dashboardService.listar_todos().pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe((response) => {
      this.dashboards = response
    });
  }
}
