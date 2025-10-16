import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private url = 'http://localhost:3334';

  constructor(private secureService: SecureService) {
    this.socket = io(this.url, {
      transports: ['websocket'],
      reconnection: true,
      path: '/socket.io',
    });

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
      const orgaoId = this.secureService.getTokenValueDecode()?.orgao?.id;
      if (orgaoId) {
        this.socket.emit('join', orgaoId);
        console.log(`Enviado join para orgaoId: ${orgaoId}`);
      } else {
        console.warn('orgaoId não encontrado ao conectar');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
    });

    this.socket.on('conversas_listadas', (response) => {
      console.log('Evento conversas_listadas recebido:', response);
    });

    this.socket.on('mensagens_conversa_listadas', (response) => {
      console.log('Evento mensagens_conversa_listadas recebido:', response);
    });

    this.socket.on('nova_mensagem', (data) => {
      console.log('Nova mensagem recebida:', data);
    });
  }

  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      console.log('Convertendo arquivo para ArrayBuffer:', file.name, 'Tamanho:', file.size);
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Leitura do arquivo concluída:', file.name);
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = (error) => {
        console.error('Erro ao ler arquivo:', file.name, error);
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async enviarMensagem(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      console.log('Socket conectado?', this.socket.connected);

      if (data.file && data.file.length > 0) {
        try {
          console.log('Processando arquivos:', data.file);
          const filesBinary = await Promise.all(
            data.file.map(async (file: File) => ({
              name: file.name,
              data: await this.fileToArrayBuffer(file),
              type: file.type
            }))
          );
          console.log('Arquivos convertidos para binário:', filesBinary.map(f => ({ name: f.name, size: f.data.byteLength })));
          data.file = filesBinary.length === 1 ? filesBinary[0] : filesBinary;
        } catch (error) {
          console.error('Erro ao converter arquivos para binário:', error);
          reject('Erro ao processar arquivos');
          return;
        }
      }

      console.log('Enviando mensagem para o backend:', ['enviar_mensagem', data]);
      this.socket.emit('message', ['enviar_mensagem', data]);

      this.socket.once('response', (response) => {
        console.log('Resposta do backend:', response);
        if (response.status === 'success') {
          resolve(response.mensagens);
        } else {
          reject(response.error);
        }
      });

      setTimeout(() => {
        console.error('Timeout: Nenhuma resposta do backend em 10 segundos');
        reject('Timeout: Nenhuma resposta do backend');
      }, 10000);
    });
  }

  receberMensagens(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('nova_mensagem', (data) => {
        observer.next(data);
      });
      this.socket.on('error', (error) => {
        observer.error(error);
      });
    });
  }

  listarConversas(params: any): Observable<any> {
    return new Observable((observer) => {
      console.log('Listando conversas com params:', params);
      this.socket.emit('message', ['listar_conversas', params]);

      const listener = (response: any) => {
        console.log('Resposta de conversas_listadas:', response);
        if (response.status === 'success') {
          observer.next(response.data);
          observer.complete();
        } else {
          observer.error(response.message);
        }
        this.socket.off('conversas_listadas', listener);
      };

      this.socket.on('conversas_listadas', listener);
    });
  }

  listarMensagensConversa(params: any): Observable<any> {
    return new Observable((observer) => {
      console.log('Listando mensagens da conversa com params:', params);
      this.socket.emit('message', ['listar_mensagens_conversa', params]);

      const listener = (response: any) => {
        console.log('Resposta de mensagens_conversa_listadas:', response);
        if (response.status === 'success') {
          observer.next(response.data);
          observer.complete();
        } else {
          observer.error(response.message);
        }
        this.socket.off('mensagens_conversa_listadas', listener);
      };

      this.socket.on('mensagens_conversa_listadas', listener);
    });
  }

  /*marcarComoLida(mensagemId: number): void {
    this.socket.emit('message', ['marcar_como_lida', { mensagemId }]);
  }*/

  disconnect() {
    this.socket.disconnect();
  }
}