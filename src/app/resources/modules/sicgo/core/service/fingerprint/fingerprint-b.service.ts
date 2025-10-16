import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintBService {
  private device: USBDevice | undefined = undefined;

  constructor() {}


  // Solicita o dispositivo USB
  public requestDevice(): Observable<USBDevice> {
    return new Observable(observer => {
      navigator.usb.requestDevice({ filters: [{ vendorId: 0x1491, productId: 0x0020 }] })
        .then(device => {
          this.device = device;
          return this.device.open();  // Abre o dispositivo
        })
        .then(() => {
          if (this.device) {
            return this.device.selectConfiguration(1);  // Seleciona a configuração
          } else {
            throw new Error('Dispositivo não encontrado');
          }
        })
        .then(() => {
          if (this.device) {
            return this.device.claimInterface(0);  // Reivindica a interface
          } else {
            throw new Error('Dispositivo não encontrado');
          }
        })
        .then(() => {
          observer.next(this.device);  // Envia o dispositivo para o frontend
          observer.complete();
        })
        .catch(error => {
          observer.error('Erro ao conectar: ' + error);
        });
    });
  }

  // Envia um comando de controle ao dispositivo
  public sendControlCommand(): Observable<void> {
    return new Observable(observer => {
      if (this.device) {
        const setup: USBControlTransferParameters = {
          requestType: 'vendor',  // 'vendor', 'standard', 'class'
          recipient: 'device',    // 'device', 'interface', 'endpoint', 'other'
          request: 0x01,          // Código do pedido
          value: 0x00,            // Valor do pedido
          index: 0x00             // Índice
        };
        const data = new Uint8Array([0x01, 0x02, 0x03]);  // Dados fictícios

        // Envia os dados de controle
        this.device.controlTransferOut(setup, data).then(() => {
          observer.next();  // Sucesso ao enviar comando
          observer.complete();
        }).catch(error => {
          observer.error('Erro ao enviar comando: ' + error);
        });
      } else {
        observer.error('Dispositivo não encontrado');
      }
    });
  }

  // Recebe dados do dispositivo
  public receiveData(endpointNumber: number): void {
    this.device!.transferIn(endpointNumber, 64)
      .then(transferResult => {
        const data = transferResult.data;
        console.log('Dados recebidos:', new Uint8Array(data.buffer));
      })
      .catch(error => {
        console.error('Erro ao transferir dados:', error);
      });
  }

  // Fecha o dispositivo
  public closeDevice(): void {
    if (this.device) {
      this.device.close().then(() => {
        console.log('Dispositivo desconectado com sucesso');
      }).catch(error => {
        console.error('Erro ao desconectar dispositivo:', error);
      });
    }
  }

  public captureFingerprint() {
    if (this.device) {
      // Comando para capturar a impressão digital
      const setup: USBControlTransferParameters = {
        requestType: 'vendor',  // 'vendor' é o tipo de comando para comandos personalizados
        recipient: 'device',    // O destinatário do comando (geralmente 'device')
        request: 0x01,          // O código do comando (isso depende do dispositivo)
        value: 0x00,            // Valor do comando
        index: 0x00             // Índice do comando
      };

      const data = new Uint8Array([0x01, 0x02, 0x03]); // Dados, se necessário, dependendo do comando

      // Enviar o comando de captura de impressão digital
      this.device.controlTransferOut(setup, data).then(() => {
        console.log('Comando de captura de impressão digital enviado com sucesso');
      }).catch(error => {
        console.error('Erro ao enviar comando de captura:', error);
      });
    } else {
      console.error('Dispositivo não conectado');
    }
  }

// Recebe os dados biométricos do dispositivo
public receiveBiometricData(endpointNumber: number): Observable<Uint8Array> {
  return new Observable(observer => {
    if (this.device) {
      console.log(`Recebendo dados do endpoint ${endpointNumber}`);
      // Recebe os dados do endpoint de entrada
      this.device.transferIn(endpointNumber, 64)
        .then(transferResult => {
          const data = new Uint8Array(transferResult.data.buffer);  // Converte para Uint8Array
          console.log('Dados recebidos:', data);
          observer.next(data);  // Envia os dados recebidos
          observer.complete();
        })
        .catch(error => {
          observer.error('Erro ao receber dados biométricos: ' + error);
        });
    } else {
      observer.error('Dispositivo não conectado');
    }
  });
}

// Converte os dados para Base64 (caso sejam imagens ou dados binários)
public convertToBase64(biometricData: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(biometricData);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

}
