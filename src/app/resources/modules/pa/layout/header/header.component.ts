import { finalize } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AgenteService } from '../../core/service/agente.service';
import { Perfil } from '../../shared/models/agente-perfil.model';
import { PerfilService } from '../../core/service/perfil.service';
import { SecureService } from '@core/authentication/secure.service';
import { SolicitaoSocketService } from '../../core/service/socket/solicitacao.service';
import { MeuOrgaoService } from '../../core/service/meu-orgao.service';
import { PushService } from '../../core/service/push.service';
import { Socket } from 'socket.io-client';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { FicheiroService } from '@core/services/Ficheiro.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public perfil!:any;
  public meuOrgao!: any;
  public notificacoes: any = [];
  public fileUrl: any
  private socket!: Socket;
  public pessoa: any

  constructor(
    private agenteService: AgenteService,
    private perfilServive: PerfilService,
    private secureService: SecureService,
    private socketService: SolicitaoSocketService,
    private meuOrgaoService: MeuOrgaoService,
    private funcionarioService: FuncionarioService,
    private notficacaoService: PushService,
    private ficheiroService: FicheiroService
  ) { }

  ngOnInit(): void {
    this.verPerfil();
    this.buscarOrgao();
    this.buscarNotificacao();
    this.socketRecebido();
    this.socketCancelado();
  }

  socketRecebido() {
    this.socketService.recebe().subscribe((response: any) => {
      this.jaRecebido(response);
    });
  }

  socketCancelado() {
    this.socketService.cancelado().subscribe((response: any) => {

      this.cancelado(response);
    });
  }

  cancelado(data: any) {
    this.socketService.jaCancelado(data);
    console.log(data);
    this.socket.on('solicitacao:aguardando', () => {
      console.log('helo');
      this.buscarNotificacao();
    });
  }

  jaRecebido(data: any) {
    this.socketService.jaRecebido(data);
    this.socket.on('solicitacao:aguardando', () => {
      this.buscarNotificacao();
    });
  }

  buscarNotificacao() {
    this.notificacoes = [];

    this.notficacaoService.alerta(this.getPessoaId).subscribe({
      next: (response: any) => {
        this.notificacoes = response;
      },
    });
  }
  get getPessoaId(): any {
    return this.agenteService?.id;
  }
  verPerfil() {
    this.funcionarioService.buscarUm(this.getPessoaId)
      .pipe()
      .subscribe((response) => {
        this.perfil = response;
        this.verFoto(response?.foto_efectivo)
      });

    setTimeout(() => {
      this.onSocket();
    }, 1500);
  }

  private onSocket() {
    this.join({
      pessoa: this.agenteService.id,
      room: this.meuOrgao.pessoajuridica_id,
    });

    this.socket = this.socketService.getSocket();
  }

  private verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

  }


  buscarOrgao() {
    this.meuOrgaoService
      .listarUm(this.agenteService?.id)
      .pipe()
      .subscribe((response: any) => {
        this.meuOrgao = response;
      });
  }

  join(data: any) {
    this.socketService.entrarSala(data);
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

  get temAlertas(): boolean {
    return this.notificacoes.length > 0 ? true : false;
  }

  get alertas() {
    return this.notificacoes.length;
  }

  public estilizaIcon(id: any, estado: any) {
    const element: any = document.querySelector(`#${id}`);

    if (element) {
      // element.classList.toString().split('');
      // element.style.fontSize = '18px';
      // element.style.marginRight = '10px';

      // element.style.lineHeight = '0';

      if (element) {
        switch (estado) {
          case 'recebido':
            element.classList.add('bi');
            element.classList.add('bi-check-circle');
            element.classList.add('text-primary');
        }
      }
    }
  }

  public estilizaTexto(id: any, estado: any) {
    const element: HTMLElement = document.querySelector(
      `#${id}`
    ) as HTMLElement;

    if (element) {
      switch (estado) {
        case 'recebido':
          element.classList.add('text-danger');
      }
    }
  }

  public maior(numero: any): string | number {
    return numero > 99 ? '+99' : numero;
  }

  public get poucaNotificacoes(): Array<any> {
    return this.notificacoes.filter(
      (value: any, index: number, array: any) => index < 3
    );
  }

  setFile(event: any) {
    this.pessoa = event
  }

  public setNullFile() {
    this.pessoa = null
  }




}
