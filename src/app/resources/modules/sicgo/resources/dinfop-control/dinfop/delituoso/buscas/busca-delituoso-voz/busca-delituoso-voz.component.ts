import { Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize, timer } from 'rxjs';
import { VozbuscaService } from '@resources/modules/sicgo/core/service/piquete/dinfop/Vozbusca/vozbusca.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';

@Component({
  selector: 'app-busca-delituoso-voz',
  templateUrl: './busca-delituoso-voz.component.html',
  styleUrls: ['./busca-delituoso-voz.component.css']
})
export class BuscaDelituosoVozComponent implements OnInit, OnDestroy {
  @ViewChild('animationElement') animationElement!: ElementRef;
  
  isListening = false;
  isLoading = false;
  transcribedText = '';
  result: any[] = [];
  errorMessage = '';
  currentVolume = 0;
  animationScale = 1;
  
  private destroy$ = new Subject<void>();
  private speechSynth = window.speechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(
    private voiceSearchService: VozbuscaService,
    private dinfopDelitousoService: DinfopDelitousoService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.loadVoices();
  }

  ngOnInit(): void {
    this.speechSynth.onvoiceschanged = () => this.loadVoices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAllAudio();
    this.speechSynth.cancel();
  }

  startOrStopVoiceSearch(): void {
    this.isListening ? this.stopVoiceSearch() : this.startVoiceSearch();
  }

  private async startVoiceSearch(): Promise<void> {
    if (!await this.checkMicrophoneAccess()) return;

    this.isListening = true;
    this.isLoading = true;
    this.resetState();
    // this.playAudioFeedback('listening');

    timer(500).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.voiceSearchService.startListening().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (transcript) => this.processTranscript(transcript),
        error: (err) => this.handleVoiceError(err)
      });
    });

    this.voiceSearchService.detectSilence(0.01, 5000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.stopVoiceSearch());

    this.startVolumeAnimation();
  }

  private stopVoiceSearch(): void {
    this.voiceSearchService.stopListening();
    this.isListening = false;
    this.isLoading = false;
    this.stopVolumeAnimation();
  }

  private async processTranscript(transcript: string): Promise<void> {
    this.transcribedText = transcript.trim();
    
    if (!this.transcribedText) {
      this.playAudioFeedback('error');
      return;
    }

    await this.speakText(`Pesquisando por: ${this.transcribedText}`);
    this.searchBackend(this.transcribedText);
  }

  private searchBackend(searchTerm: string): void {
    this.dinfopDelitousoService.vozbusca(searchTerm).pipe(
      finalize(() => (this.isLoading = false)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => this.handleSearchSuccess(response),
      error: (err) => this.handleError(err)
    });
  }

  private handleSearchSuccess(response: any): void {
    this.result = response || [];
    
    if (this.result.length > 0) {
      this.playAudioFeedback('success');
      this.navigateToDetails(this.result[0]?.id);
    } else {
      this.playAudioFeedback('error');
      this.speakText('Nenhum resultado encontrado.');
    }
  }

  private navigateToDetails(delituosoId: number | undefined): void {
    if (delituosoId) {
      this.router.navigate(['#/piips/sicgo/dinfop/delituosos', delituosoId]);
    }
  }

  private async checkMicrophoneAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error('Acesso ao microfone negado:', err);
      this.handleVoiceError(err);
      return false;
    }
  }

  private loadVoices(): void {
    this.voices = this.speechSynth.getVoices();
  }

  private async speakText(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voices.find(v => v.lang === 'pt-BR') || this.voices[0];
      utterance.onend = () => resolve();
      this.speechSynth.speak(utterance);
    });
  }

  private playAudioFeedback(type: 'success' | 'error' | 'listening'): void {
    const audioMap = {
      listening: './assets/assets_sicgo/audio/ouvindo.mp3',
      success: './assets/assets_sicgo/audio/sucesso.mp3',
      error: './assets/assets_sicgo/audio/erro.mp3'
    };

    const audio = new Audio(audioMap[type]);
    audio.play();
  }

  private startVolumeAnimation(): void {
    const update = () => {
      this.currentVolume = this.voiceSearchService.getVolume();
      this.animationScale = 1 + (this.currentVolume / 255) * 0.5;
      this.updateAnimation();
      if (this.isListening) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  private stopVolumeAnimation(): void {
    this.animationScale = 1;
    this.updateAnimation();
  }

  private updateAnimation(): void {
    if (this.animationElement) {
      this.renderer.setStyle(
        this.animationElement.nativeElement,
        'transform',
        `scale(${this.animationScale})`
      );
    }
  }

  private handleVoiceError(error: any): void {
    console.error('Erro de voz:', error);
    this.isListening = false;
    this.isLoading = false;
    this.playAudioFeedback('error');
    
    const errorMessage = error.error === 'not-allowed' 
      ? 'Permissão de microfone necessária. Por favor, habilite no seu navegador.'
      : 'Erro ao acessar o microfone. Verifique seu dispositivo.';
    
    this.errorMessage = errorMessage;
    this.speakText(errorMessage);
  }

  private handleError(error: any): void {
    console.error('Erro na busca:', error);
    this.errorMessage = 'Erro ao processar a solicitação. Tente novamente.';
    this.playAudioFeedback('error');
    this.speakText(this.errorMessage);
  }

  private resetState(): void {
    this.errorMessage = '';
    this.result = [];
    this.transcribedText = '';
  }

  private stopAllAudio(): void {
    this.speechSynth.cancel();
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => audio.pause());
  }
}