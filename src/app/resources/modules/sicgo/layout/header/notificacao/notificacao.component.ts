import { Component, OnInit } from '@angular/core';
import { NotificacaoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/notificacao/notificacao.service';
import { NgxIzitoastService } from 'ngx-izitoast';
// src/app/models/notificacao.model.ts
 interface Notificacao {
  _id: string;
  tipo: 'email' | 'success' | 'warning' | 'danger' | 'info' | 'error'; // pode expandir
  mensagem: string;
  orgao: string | null;
  user_id: number;
  ocorrencia_id: string | null;
  destinatario_email: string;
  lida?: boolean; // Adiciona a propriedade opcional 'lida'
  createdAt: string;  // ou Date, se você converter depois
  updatedAt: string;
}


@Component({
  selector: 'app-sicgo-notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.css']
})
export class NotificacaoComponent implements OnInit {
  message: string | null = null;
  unreadNotifications: any[] = [];  // Lista de notificações não lidas
notificacoes: Notificacao[] = [];  // Lista de notificações não lidas
  constructor(private notificacaoService: NotificacaoService, private iziToast: NgxIzitoastService) { }


ngOnInit(): void {
  this.ouvirNovasNotificacoes();
  this.carregarNotificacoesNaoLidas();
  this.notificacaoService.listarTodos().subscribe({
      next: (res) => this.notificacoes = res,
      error: (err) => console.error('Erro ao buscar notificações:', err)
    });
}

 ouvirNovasNotificacoes(): void {
   this.notificacaoService.notification$.subscribe((msg) => {
      this.message = msg.mensagem;
      this.unreadNotifications.unshift(msg);
      const tipoNotificacao = msg.tipo === 'danger' ? 'error' : msg.tipo;
      this.mostrarNotificacao(msg.mensagem, tipoNotificacao);
      this.playSound();

      setTimeout(() => {
        this.message = null;
      }, 5000);
    });

   
}

 carregarNotificacoesNaoLidas(): void {
 this.notificacaoService.listarTodos().subscribe((notificacoes: Notificacao[]) => {
      this.unreadNotifications = notificacoes.filter(n => !n.lida);
    });
}

  private playSound(): void {
    const audio = new Audio('assets/audio/notificacao.mp3');
    audio.play().catch((err) => {
      console.warn('Som não pôde ser tocado:', err);
    });
  }
 
  // Método para marcar uma notificação como lida
  markAsRead(notificationId: string): void {
    this.unreadNotifications = this.unreadNotifications.filter(
      (notif) => notif._id !== notificationId
    );
   // Chama o serviço para marcar como lida no backend
  this.notificacaoService.marcarComoLida(notificationId).subscribe({
    next: () => {
      console.log(`Notificação ${notificationId} marcada como lida.`);
    },
    error: (err) => {
      console.error('Erro ao marcar notificação como lida:', err);
      // Opcional: reverter a mudança local se falhar
      this.carregarNotificacoesNaoLidas(); // ou restaurar localmente a notificação
    }
  });
  }

  // Classe CSS baseada no tipo de notificação
  getStatusClass(tipo: string): string {
    switch (tipo) {
      case 'success':
        return 'status-success';
      case 'warning':
        return 'status-warning';
      case 'email':
        return 'status-danger';
      default:
        return 'status-info';
    }
  
    
  }


  // Método para exibir a notificação
  mostrarNotificacao(message: string, tipo: 'success' | 'error' | 'info' | 'warning'| 'email') {
    this.iziToast.show({
      message: message,
      position: 'topRight',  // Você pode mudar a posição se preferir
      color: tipo,  // Exemplo: success, error, info, warning
      timeout: 5000, // Duração da notificação em milissegundos
      close: true, // Mostrar botão de fechar
      transitionIn: 'fadeInUp', // Animação de entrada
      transitionOut: 'fadeOutDown' // Animação de saída
    });
  }


 searchTerm: string = '';

filteredNotifications(): Notificacao[] {
  if (!this.searchTerm) return this.unreadNotifications;
  const term = this.searchTerm.toLowerCase();
  return this.unreadNotifications.filter(n =>
    n.mensagem.toLowerCase().includes(term)
  );
}

}