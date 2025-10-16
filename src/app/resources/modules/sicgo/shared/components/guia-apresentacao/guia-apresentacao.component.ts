import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guia-apresentacao',
  templateUrl: './guia-apresentacao.component.html',
  styleUrls: ['./guia-apresentacao.component.css']
})
export class GuiaApresentacaoComponent implements OnInit {
  slideAtual = 0;
  private touchStartX = 0;

  slides = [
    { 
      titulo: 'Bem-vindo ao SICGO!', 
      texto: 'Sistema Integrado de Controlo e Gestão de Ocorrências.',
      imagem: 'assets/img/logopolice2.png' 
    },
    { 
      titulo: 'Interaja com facilidade', 
      texto: 'Você pode assistir, jogar e interagir em tempo real.',
      imagem: 'caminho/para/imagem2.jpg'
    },
    { 
      titulo: 'Vamos começar?', 
      texto: '',
      imagem: 'caminho/para/imagem3.jpg'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarPrimeiroAcesso();
  }

  private verificarPrimeiroAcesso(): void {
    if (!localStorage.getItem('guiaVisto')) {
      localStorage.setItem('guiaVisto', 'true');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        this.proximoSlide();
        break;
      case 'ArrowLeft':
        this.slideAnterior();
        break;
      case 'Escape':
        this.fecharGuia();
        break;
    }
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) > 50) {
      deltaX > 0 ? this.slideAnterior() : this.proximoSlide();
    }
  }

  slideAnterior(): void {
    if (this.slideAtual > 0) {
      this.slideAtual--;
    }
  }

  proximoSlide(): void {
    if (this.slideAtual < this.slides.length - 1) {
      this.slideAtual++;
    } else {
      this.fecharGuia();
    }
  }

  irParaSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.slideAtual = index;
    }
  }

  fecharGuia(): void {
    this.router.navigate(['/piips/sicgo/']);
    localStorage.setItem('guiaVisto', 'true');
  }

  get progresso(): number {
    return ((this.slideAtual + 1) / this.slides.length) * 100;
  }
}