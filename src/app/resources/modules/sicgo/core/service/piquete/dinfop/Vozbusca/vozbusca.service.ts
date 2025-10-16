import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VozbuscaService {
  private recognition: SpeechRecognition;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode;
 
  private isListening: boolean = false;
  
  constructor() {
    const { webkitSpeechRecognition }: any = window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'pt-PT';
    this.recognition.interimResults = false;

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    const SpeechRecognitionConstructor = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      alert('Este navegador não suporta a Web Speech API!');
      return;
    }
    this.recognition = new SpeechRecognitionConstructor();
    this.recognition.lang = 'pt-PT';
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.interimResults = false; // Não retornar resultados parciais
  }
 

  startAudioCapture(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.microphone) {
        resolve();  // Já está capturando áudio
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.microphone = this.audioContext.createMediaStreamSource(stream);
          this.microphone.connect(this.analyser);
          this.analyser.connect(this.gainNode);
          this.gainNode.connect(this.audioContext.destination);  // O áudio não será emitido porque o ganho está em 0
          resolve();
        })
        .catch((error) => {
          reject('Erro ao acessar o microfone: ' + error);
        });
    });
  }

  // Função para detectar a inatividade (silêncio) e atualizar a página
  listenForInactivity(): Observable<void> {
    return new Observable<void>((observer) => {
      this.detectSilence(0.01, 5000).subscribe({
        next: () => {
          // Atualizar a página após 5 segundos de inatividade
          window.location.reload();
          observer.complete();
        },
        error: (err) => {
          console.error('Erro ao detectar silêncio: ', err);
          observer.error(err);
        }
      });
    });
  }

   
 
  /**
   * Obtém o volume atual da voz.
   */
  getVolume(): number {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    return average;
  }

/**
   * Inicia o reconhecimento de voz.
   */
startListening(): Observable<string> {
  return new Observable<string>((observer) => {
    if (!this.recognition) {
      observer.error('Reconhecimento de fala não está disponível.');
      return;
    }

    if (this.isListening) {
      console.log('Já está escutando...');
      observer.complete();
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Texto detectado:', transcript);
      observer.next(transcript);
    };

    this.recognition.onerror = (error: any) => {
      console.error('Erro no reconhecimento:', error);
      observer.error(error);
    };

    this.recognition.onend = () => {
      console.log('Reconhecimento finalizado.');
      this.isListening = false;
      observer.complete();
    };

    this.recognition.start();
    console.log('Reconhecimento de voz iniciado.');
  });
}

/**
   * Para o reconhecimento de voz.
   */
stopListening(): void {
  if (this.recognition && this.isListening) {
    this.recognition.stop();
    this.isListening = false;
    console.log('Reconhecimento de voz parado.');
  }
}


/**
   * Detecta silêncio baseado em um limiar de volume.
   */
detectSilence(threshold: number = 0.01, timeout: number = 3000): Observable<void> {
  return new Observable<void>((observer) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const analyser = this.audioContext.createAnalyser();
      const microphone = this.audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart = Date.now();

      const checkSilence = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;

        if (volume < threshold) {
          if (Date.now() - silenceStart > timeout) {
            console.log('Silêncio detectado.');
            observer.next();
            observer.complete();
          }
        } else {
          silenceStart = Date.now();
        }

        requestAnimationFrame(checkSilence);
      };

      checkSilence();
    }).catch((error) => observer.error(error));
  });
}

 /**
   * Escuta continuamente por palavras-chave.
   */
 listenForKeywords(keywords: string[]): Observable<string> {
  return new Observable<string>((observer) => {
    if (!this.recognition) {
      observer.error('Reconhecimento de fala não está disponível.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Texto detectado:', transcript);

      if (keywords.some(keyword => transcript.toLowerCase().includes(keyword.toLowerCase()))) {
        observer.next(transcript);
      }
    };

    this.recognition.onerror = (error: any) => {
      console.error('Erro no reconhecimento:', error);
      observer.error(error);
    };

    this.recognition.start();
    console.log('Escuta por palavras-chave iniciada.');
  });
}

 
  
}
