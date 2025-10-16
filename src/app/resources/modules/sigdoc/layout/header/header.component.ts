import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { PerfilService } from '@core/services/config/Perfil.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { Perfil } from '@resources/modules/pa/shared/models/agente-perfil.model';
import { Subscription } from 'rxjs';
import { CorrespondenciaService } from '../../core/service/Corrrespondencia.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public perfil!: Perfil;
  public correspondenciasNaoLidas: any[] = []; // Array para correspondências não lidas
  public unreadCount: number = 0;
  public startBlink: boolean = false;
  private pollingSubscription!: Subscription;
  private previousCount: number = 0;
  private correspondenciaIds: Set<number> = new Set();

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  };

  constructor(
    private agenteService: AgenteService,
    private perfilServive: PerfilService,
    private secureService: SecureService,
    private correspondenciaService: CorrespondenciaService,
  ) {}

  ngOnInit(): void {
    this.verPerfil();
    this.loadCorrespondenciasNaoLidas();
    this.startPolling();
  }

  verPerfil() {
    this.perfilServive
      .listar({ id: this.agenteService.id })
      .pipe()
      .subscribe((response) => {
        this.perfil = response;
      });
  }

  toggle() {
    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.left;
      let mainLeft: string | any = main.style.marginLeft;
      if (asideLeft == '' || asideLeft == '0px') {
        asideLeft = '-300px';
        mainLeft = '0px';
      } else {
        asideLeft = '0px';
        mainLeft = '300px';
      }
      asidebar.style.left = asideLeft;
      main.style.marginLeft = mainLeft;
    }
  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user?.nome_completo;
  }

  sair() {
    this.agenteService.sair();
  }

  loadCorrespondenciasNaoLidas() {
    const options = {
      ...this.filtro,
      enviado_para: this.getOrgaoId,
    };
    this.correspondenciaService.listarNaoLidas(options).subscribe((correspondencias: any[]) => {
      this.correspondenciasNaoLidas = Array.isArray(correspondencias) ? correspondencias : [];
      this.unreadCount = this.correspondenciasNaoLidas.length;
      this.checkNewCorrespondencias(this.correspondenciasNaoLidas);
    });
  }

  startPolling() {
    const options = {
      ...this.filtro,
      enviado_para: this.getOrgaoId,
    };
    this.pollingSubscription = this.correspondenciaService.startPolling(options).subscribe((correspondencias: any[]) => {
      this.correspondenciasNaoLidas = Array.isArray(correspondencias) ? correspondencias : [];
      this.unreadCount = this.correspondenciasNaoLidas.length;
      this.checkNewCorrespondencias(this.correspondenciasNaoLidas);
    });
  }

  marcarComolido(correspondenciaId: number) {
    this.correspondenciaService.marcarComolido(correspondenciaId).subscribe(() => {
      this.correspondenciasNaoLidas = this.correspondenciasNaoLidas.filter((c) => c.id !== correspondenciaId);
      this.unreadCount = this.correspondenciasNaoLidas.length;
      this.checkNewCorrespondencias(this.correspondenciasNaoLidas);
    });
  }

  checkNewCorrespondencias(correspondencias: any[]) {
    if (!Array.isArray(correspondencias)) {
      console.error('correspondencias não é um array:', correspondencias);
      return;
    }
    const currentIds = new Set(correspondencias.map((c) => c.id));
    const newCorrespondencia = Array.from(currentIds).find((id) => !this.correspondenciaIds.has(id));

    if (newCorrespondencia !== undefined) {
      this.startBlink = true;
      this.correspondenciaIds.add(newCorrespondencia);
      setTimeout(() => {
        this.startBlink = false;
        setTimeout(() => {
          this.startBlink = true;
        }, 50);
      }, 300);
    } else if (this.unreadCount === 0) {
      this.correspondenciaIds.clear();
      this.startBlink = false;
    }
    this.previousCount = this.unreadCount;
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  public get getOrgaoId(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }
}