import { Component, OnInit } from '@angular/core';
import { AgenteService } from '../../core/service/agente.service';
import { PushService } from '../../core/service/push.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.css'],
})
export class PushComponent implements OnInit {
  public without: boolean = true;
  public notificacoes: any = [];
  public carreando: boolean = false;
  public globalId!: any;
  constructor(
    private agenteService: AgenteService,
    private agentePush: PushService
  ) {}

  private get getPessoadId(): number {
    return this.agenteService.id;
  }

  ngOnInit(): void {
    this.buscarNotificacoes();
  }

  private buscarNotificacoes() {
    this.carreando = true;
    this.agentePush
      .listar(this.getPessoadId)
      .pipe(
        finalize((): void => {
          this.carreando = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.notificacoes = response;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  public get temNotificacoes(): boolean {
    return this.notificacoes.length > 0 ? true : false;
  }

  public global(id: any) {
    this.globalId = id;
  }
}
