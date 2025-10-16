import { Component, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.css']
})
export class TypewriterComponent implements OnInit, AfterViewInit {
  @Input() text: string = ''; // Texto a ser digitado
  @Input() speed: number = 100; // Velocidade da digitação
  @Input() delay: number = 0; // Atraso para iniciar a animação
  @Input() autoBlink: boolean = true; // Controla se o cursor pisca
  @Input() onComplete: Function = () => {}; // Função de callback ao terminar a digitação

  private elementId = 'typewriter-text';
  private index = 0;
  private element: HTMLElement | any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.element = this.el.nativeElement.querySelector(`#${this.elementId}`);
    this.startTyping();
  }

  private startTyping(): void {
    if (!this.element) return;

    let cursor = document.createElement('span');
    cursor.innerHTML = '|';
    this.element.appendChild(cursor);

    let index = 0;

    // Função recursiva para digitar o texto
    const type = () => {
      if (index < this.text.length) {
        this.element.innerHTML = this.text.slice(0, index) + cursor.outerHTML;
        index++;
        setTimeout(type, this.speed);
      } else if (this.onComplete) {
        this.onComplete();
      }
    };

    // Controla o atraso
    if (this.delay > 0) {
      setTimeout(type, this.delay);
    } else {
      type();
    }

    // Controla a animação de piscar do cursor
    if (this.autoBlink) {
      cursor.style.animation = 'blinkCaret 0.75s step-end infinite';
    } else {
      cursor.style.animation = 'none';
    }
  }
}
