/*import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { ChatService } from '@resources/modules/sigdoc/core/service/chat.service';
import { TipoCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Correspondencia.service';
import { Select2OptionData } from 'ng-select2';
import { Subscription } from 'rxjs';
import { Pagination } from '@shared/models/pagination';

interface Conversa {
  id: number;
  nome: string;
  avatar: string;
  online: boolean;
  ultimaMensagem: string;
  hora: string;
}

interface Mensagem {
  remetente: 'eu' | 'outro';
  texto: string;
  hora: string;
  lido?: boolean; // Adicionar campo lido
  arquivo?: {
    url: string;
    tipo: 'imagem' | 'pdf';
  };
  mensagemRespondida?: Mensagem;
}

interface MensagemBackend {
  remetente_id: number;
  destinatario_id: number;
  mensagem: string;
  created_at: string;
  lido: boolean; // Adicionar campo lido
  arquivo_url?: string;
  arquivo_tipo?: 'imagem' | 'pdf';
  anexo?: string;
  mensagem_respondida?: MensagemBackend;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  arquivosSelecionados: File[] = [];
  conversas: Conversa[] = [];
  mensagens: Mensagem[] = [];
  mensagensCarregadas: boolean = false;
  conversaSelecionada: Conversa | null = null;
  destinatariosSelecionados: number[] = [];
  termoPesquisa: string = '';
  novaMensagem: string = '';
  mensagemParaResponder: Mensagem | null = null;
  private subscription: Subscription;
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public pagination: Pagination = new Pagination();
  
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  // Adicione no seu componente
destinatarios: any[] = [];
destinatariosPagination: any = {};
destinatariosBusca: string = '';

  constructor(
    private chatService: ChatService,
    private secureService: SecureService,
    private tipoCorrespondenciaService: TipoCorrespondenciaService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.carregarConversas();
    this.buscarTipoCorrespondencia();
  
    this.subscription.add(
      this.chatService.receberMensagens().subscribe({
        next: (data: MensagemBackend) => {
          if (this.conversaSelecionada && 
              ((data.remetente_id === this.getOrgaoId && data.destinatario_id === this.conversaSelecionada.id) ||
               (data.destinatario_id === this.getOrgaoId && data.remetente_id === this.conversaSelecionada.id))) {
            const novaMensagem: Mensagem = {
              remetente: data.remetente_id === this.getOrgaoId ? 'eu' : 'outro',
              texto: data.mensagem,
              hora: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            if (data.arquivo_url && data.arquivo_tipo) {
              novaMensagem.arquivo = {
                url: data.arquivo_url,
                tipo: data.arquivo_tipo
              };
            }
            this.mensagens.push(novaMensagem);
            this.scrollToBottom();
          }
        },
        error: (error) => {
          console.error('Erro ao receber mensagem:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private buscarTipoCorrespondencia() {
    this.tipoCorrespondenciaService.listar({}).subscribe({
      next: (response: any) => {
        this.tipoCorrespondencia = response.map((item: any) => ({
          id: item.id,
          text: item.nome.toString().toUpperCase(),
        }));
      },
    });
  }

  carregarConversas(): void {
    const params = {
      orgaoId: this.getOrgaoId,
      limite: this.filtro.perPage,
      offset: (this.filtro.page - 1) * this.filtro.perPage,
      ordenarPor: 'contato_nome',
      ordem: 'asc',
      busca: this.filtro.search
    };

    this.subscription.add(
      this.chatService.listarConversas(params).subscribe({
        next: (data) => {
          this.conversas = data.conversas;
          this.pagination = new Pagination().deserialize({
            current_page: this.filtro.page,
            per_page: this.filtro.perPage,
            total: data.total || this.conversas.length,
          });
          if (this.conversas.length > 0 && !this.conversaSelecionada) {
            this.selecionarConversa(this.conversas[0]);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar conversas:', error);
        }
      })
    );
  }

  selecionarConversa(conversa: Conversa): void {
    this.conversaSelecionada = conversa;
    this.mensagens = [];
    this.mensagensCarregadas = false;
    this.carregarMensagensAnteriores(conversa.id);
  }

  toggleDestinatario(conversa: Conversa): void {
    const index = this.destinatariosSelecionados.indexOf(conversa.id);
    if (index === -1) {
      this.destinatariosSelecionados.push(conversa.id);
    } else {
      this.destinatariosSelecionados.splice(index, 1);
    }
  }

  selecionarTodos(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.destinatariosSelecionados = this.conversas.map(conv => conv.id);
    } else {
      this.destinatariosSelecionados = [];
    }
  }

  todosSelecionados(): boolean {
    return this.conversas.every(conv => this.destinatariosSelecionados.includes(conv.id));
  }

  validarSelecionado(id: number): boolean {
    return this.destinatariosSelecionados.includes(id);
  }

  filtrarPagina(key: string, $event: any): void {
    if (key === 'page') {
      this.filtro.page = $event;
    } else if (key === 'perPage') {
      this.filtro.perPage = $event.target.value;
      this.filtro.page = 1;
    } else if (key === 'search') {
      this.filtro.search = $event;
      this.filtro.page = 1;
    }
    this.carregarConversas();
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  responderMensagem(mensagem: Mensagem): void {
    this.mensagemParaResponder = mensagem;
  }

  cancelarResposta(): void {
    this.mensagemParaResponder = null;
  }

  enviarMensagem(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      // Usar destinatariosSelecionados se houver mais de um, caso contrário usar conversaSelecionada
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
  
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId, // Pode ser "1,2,3" ou um único ID
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5
      };
  
      if (this.arquivosSelecionados.length > 0) {
        data.file = this.arquivosSelecionados[0]; // Ajustado para "file" conforme o backend espera
      }
  
      if (this.mensagemParaResponder) {
        data.mensagem_respondida = {
          remetente_id: this.mensagemParaResponder.remetente === 'eu' ? this.getOrgaoId : this.conversaSelecionada!.id,
          mensagem: this.mensagemParaResponder.texto,
          created_at: this.mensagemParaResponder.hora
        };
      }
  
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = []; // Limpar seleção após envio
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  filtrarConversas(): Conversa[] {
    return this.conversas.filter(conv => 
      conv.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase())
    );
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.arquivosSelecionados = [...this.arquivosSelecionados, ...Array.from(files)];
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files: FileList = event.dataTransfer!.files;
    this.arquivosSelecionados = [...this.arquivosSelecionados, ...Array.from(files)];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  removerArquivo(index: number): void {
    this.arquivosSelecionados.splice(index, 1);
  }

  carregarMensagensAnteriores(conversaId: number): void {
    this.chatService.listarMensagensConversa({
      orgaoId: this.getOrgaoId,
      conversaId: conversaId
    }).subscribe({
      next: (mensagens: MensagemBackend[]) => {
        this.mensagens = mensagens.map((msg: MensagemBackend) => {
          const mensagem: Mensagem = {
            remetente: msg.remetente_id === this.getOrgaoId ? 'eu' : 'outro',
            texto: msg.mensagem,
            hora: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          // Adicionar informações do arquivo, se existir
          if (msg.arquivo_url && msg.arquivo_tipo) {
            mensagem.arquivo = {
              url: msg.arquivo_url,
              tipo: msg.arquivo_tipo
            };
          }
          return mensagem;
        });
        setTimeout(() => {
          this.scrollToBottom();
          this.mensagensCarregadas = true;
        }, 0);
      },
      error: (error) => {
        console.error('Erro ao carregar mensagens anteriores:', error);
        this.mensagensCarregadas = true;
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessages && this.chatMessages.nativeElement) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    }, 0); // Timeout para garantir que o DOM esteja atualizado
  }

  /*marcarComoLida(mensagem: Mensagem, index: number): void {
  const mensagemId = this.mensagens[index].id;
  this.chatService.marcarComoLida(mensagemId);
  this.mensagens[index].lido = true;
}

  // Novo método para obter o nome da conversa pelo ID
  getNomeConversa(id: number): string | undefined {
    return this.conversas.find(c => c.id === id)?.nome;
  }

  abrirArquivo(url: string): void {
    window.open(url, '_blank'); // Abre o arquivo em uma nova aba
  }
}*/

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { ChatService } from '@resources/modules/sigdoc/core/service/chat.service';
import { TipoCorrespondenciaService } from '@resources/modules/sigdoc/core/service/config/Tipo-Correspondencia.service';
import { Select2OptionData } from 'ng-select2';
import { Subscription } from 'rxjs';
import { Pagination } from '@shared/models/pagination';

interface Conversa {
  id: number;
  nome: string;
  avatar: string;
  online: boolean;
  ultimaMensagem: string;
  hora: string;
}

interface Mensagem {
  remetente: 'eu' | 'outro';
  texto: string;
  hora: string;
  lido?: boolean;
  arquivo?: {
    url: string;
    tipo: 'imagem' | 'pdf';
  };
  mensagemRespondida?: Mensagem;
}

interface MensagemBackend {
  remetente_id: number;
  destinatario_id: number;
  mensagem: string;
  created_at: string;
  lido: boolean;
  anexo?: string; // Ajustado para refletir o campo do backend
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  arquivosSelecionados: File[] = [];
  conversas: Conversa[] = [];
  mensagens: Mensagem[] = [];
  mensagensCarregadas: boolean = false;
  conversaSelecionada: Conversa | null = null;
  destinatariosSelecionados: number[] = [];
  termoPesquisa: string = '';
  novaMensagem: string = '';
  mensagemParaResponder: Mensagem | null = null;
  private subscription: Subscription;
  public tipoCorrespondencia: Array<Select2OptionData> = [];
  public pagination: Pagination = new Pagination();
  
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  constructor(
    private chatService: ChatService,
    private secureService: SecureService,
    private tipoCorrespondenciaService: TipoCorrespondenciaService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.carregarConversas();
    this.buscarTipoCorrespondencia();
  
    this.subscription.add(
      this.chatService.receberMensagens().subscribe({
        next: (data: MensagemBackend) => {
          if (this.conversaSelecionada && 
              ((data.remetente_id === this.getOrgaoId && data.destinatario_id === this.conversaSelecionada.id) ||
               (data.destinatario_id === this.getOrgaoId && data.remetente_id === this.conversaSelecionada.id))) {
            const novaMensagem: Mensagem = {
              remetente: data.remetente_id === this.getOrgaoId ? 'eu' : 'outro',
              texto: data.mensagem,
              hora: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            if (data.anexo) {
              const anexos = typeof data.anexo === 'string' && data.anexo.startsWith('[') ? JSON.parse(data.anexo) : [data.anexo];
              if (anexos.length > 0) {
                novaMensagem.arquivo = {
                  url: anexos[0], // Simplificação: usa o primeiro anexo como exemplo
                  tipo: anexos[0].endsWith('.pdf') ? 'pdf' : 'imagem'
                };
              }
            }
            this.mensagens.push(novaMensagem);
            this.scrollToBottom();
          }
        },
        error: (error) => {
          console.error('Erro ao receber mensagem:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private buscarTipoCorrespondencia() {
    this.tipoCorrespondenciaService.listar({}).subscribe({
      next: (response: any) => {
        this.tipoCorrespondencia = response.map((item: any) => ({
          id: item.id,
          text: item.nome.toString().toUpperCase(),
        }));
      },
    });
  }

  carregarConversas(): void {
    const params = {
      orgaoId: this.getOrgaoId,
      limite: this.filtro.perPage,
      offset: (this.filtro.page - 1) * this.filtro.perPage,
      ordenarPor: 'contato_nome',
      ordem: 'asc',
      busca: this.filtro.search
    };

    this.subscription.add(
      this.chatService.listarConversas(params).subscribe({
        next: (data) => {
          this.conversas = data.conversas;
          this.pagination = new Pagination().deserialize({
            current_page: this.filtro.page,
            per_page: this.filtro.perPage,
            total: data.total || this.conversas.length,
          });
          if (this.conversas.length > 0 && !this.conversaSelecionada) {
            this.selecionarConversa(this.conversas[0]);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar conversas:', error);
        }
      })
    );
  }

  selecionarConversa(conversa: Conversa): void {
    this.conversaSelecionada = conversa;
    this.mensagens = [];
    this.mensagensCarregadas = false;
    this.carregarMensagensAnteriores(conversa.id);
  }

  toggleDestinatario(conversa: Conversa): void {
    const index = this.destinatariosSelecionados.indexOf(conversa.id);
    if (index === -1) {
      this.destinatariosSelecionados.push(conversa.id);
    } else {
      this.destinatariosSelecionados.splice(index, 1);
    }
  }

  selecionarTodos(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.destinatariosSelecionados = this.conversas.map(conv => conv.id);
    } else {
      this.destinatariosSelecionados = [];
    }
  }

  todosSelecionados(): boolean {
    return this.conversas.every(conv => this.destinatariosSelecionados.includes(conv.id));
  }

  validarSelecionado(id: number): boolean {
    return this.destinatariosSelecionados.includes(id);
  }

  filtrarPagina(key: string, $event: any): void {
    if (key === 'page') {
      this.filtro.page = $event;
    } else if (key === 'perPage') {
      this.filtro.perPage = $event.target.value;
      this.filtro.page = 1;
    } else if (key === 'search') {
      this.filtro.search = $event;
      this.filtro.page = 1;
    }
    this.carregarConversas();
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  responderMensagem(mensagem: Mensagem): void {
    this.mensagemParaResponder = mensagem;
  }

  cancelarResposta(): void {
    this.mensagemParaResponder = null;
  }

  enviarMensagem(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
  
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5
      };
  
      if (this.arquivosSelecionados.length > 0) {
        data.file = this.arquivosSelecionados;
      }
  
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  enviarMensagemwer(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
  
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5
      };
  
      if (this.arquivosSelecionados.length > 0) {
        data.file = this.arquivosSelecionados;
      }
  
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  enviarMensageeem(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
  
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5,
        file: {
          name: 'teste.pdf',
          data: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+DQplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxPj4NCmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8L0ZvbnQgPDwvRjEgNCAwIFIgPj4gPj4gL0NvbnRlbnRzIDUgMCBSID4+DQplbmRvYmoKNCAwIG9iago8PC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYT4+DQplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggNDQ+PnN0cmVhbQovRjEgMjQgVGYgMTAwIDEwMCBUZCAoSGVsbG8gV29ybGQpIFRqIGVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago8PC9Qcm9kdWNlciAoUGRmSlMpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyMzEwMjAxMjAwMDBaKSA+Pg0KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDg5IDAwMDAwIG4gCjAwMDAwMDAxNzMgMDAwMDAgbiAKMDAwMDAwMDI3OSAwMDAwMCBuIAowMDAwMDAwMzcxIDAwMDAwIG4gCjAwMDAwMDA0NjkgMDAwMDAgbiAKdHJhaWxlcgo8PC9SaXplIDcgL1Jvb3QgMSAwIFIgL0luZm8gNiAwIFIgPj4Kc3RhcnR4cmVmCjU2NAolJUVPRgo=',
          type: 'application/pdf'
        }
      };
  
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  enviarMensageem(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
    
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5
      };
    
      if (this.arquivosSelecionados.length > 0) {
        data.file = this.arquivosSelecionados;
      }
    
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  enviarMensagemr(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
    
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5,
        file: {
          name: "teste.pdf",
          data: "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+DQplbmRvYmo=", // Base64 pequeno para teste
          type: "application/pdf"
        }
      };
    
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  enviarMensagemw(): void {
    if (this.novaMensagem.trim() || this.arquivosSelecionados.length > 0) {
      const destinatarioId = this.destinatariosSelecionados.length > 0 
        ? this.destinatariosSelecionados.join(',') 
        : this.conversaSelecionada!.id;
  
      const data: any = {
        remetente_id: this.getOrgaoId,
        destinatario_id: destinatarioId,
        mensagem: this.novaMensagem,
        tipo_correspondencia_id: 2,
        user_id: 5
      };
  
      if (this.arquivosSelecionados.length > 0) {
        data.file = this.arquivosSelecionados; // Passa todos os arquivos selecionados
      }
  
      if (this.mensagemParaResponder) {
        data.mensagem_respondida = {
          remetente_id: this.mensagemParaResponder.remetente === 'eu' ? this.getOrgaoId : this.conversaSelecionada!.id,
          mensagem: this.mensagemParaResponder.texto,
          created_at: this.mensagemParaResponder.hora
        };
      }
  
      this.chatService.enviarMensagem(data)
        .then((mensagens) => {
          this.novaMensagem = '';
          this.arquivosSelecionados = [];
          this.mensagemParaResponder = null;
          this.destinatariosSelecionados = [];
          if (this.conversaSelecionada) {
            this.carregarMensagensAnteriores(this.conversaSelecionada.id);
          }
          this.carregarConversas();
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  }

  filtrarConversas(): Conversa[] {
    return this.conversas.filter(conv => 
      conv.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase())
    );
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.arquivosSelecionados = [...this.arquivosSelecionados, ...Array.from(files)];
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files: FileList = event.dataTransfer!.files;
    this.arquivosSelecionados = [...this.arquivosSelecionados, ...Array.from(files)];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  removerArquivo(index: number): void {
    this.arquivosSelecionados.splice(index, 1);
  }

  carregarMensagensAnteriores(conversaId: number): void {
    this.chatService.listarMensagensConversa({
      orgaoId: this.getOrgaoId,
      conversaId: conversaId
    }).subscribe({
      next: (mensagens: MensagemBackend[]) => {
        this.mensagens = mensagens.map((msg: MensagemBackend) => {
          const mensagem: Mensagem = {
            remetente: msg.remetente_id === this.getOrgaoId ? 'eu' : 'outro',
            texto: msg.mensagem,
            hora: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          if (msg.anexo) {
            const anexos = typeof msg.anexo === 'string' && msg.anexo.startsWith('[') ? JSON.parse(msg.anexo) : [msg.anexo];
            if (anexos.length > 0) {
              mensagem.arquivo = {
                url: anexos[0], // Simplificação: usa o primeiro anexo
                tipo: anexos[0].endsWith('.pdf') ? 'pdf' : 'imagem'
              };
            }
          }
          return mensagem;
        });
        setTimeout(() => {
          this.scrollToBottom();
          this.mensagensCarregadas = true;
        }, 0);
      },
      error: (error) => {
        console.error('Erro ao carregar mensagens anteriores:', error);
        this.mensagensCarregadas = true;
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessages && this.chatMessages.nativeElement) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    }, 0);
  }

  getNomeConversa(id: number): string | undefined {
    return this.conversas.find(c => c.id === id)?.nome;
  }

  abrirArquivo(url: string): void {
    window.open(url, '_blank');
  }
}