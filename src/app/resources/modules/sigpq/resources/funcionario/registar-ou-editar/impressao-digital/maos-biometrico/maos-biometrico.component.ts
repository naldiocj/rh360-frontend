import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, SimpleChanges, Renderer2, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import iziToast from 'izitoast';

interface IThumb {
  name: string;
  active: boolean;
}

@Component({
  selector: 'sigpq-maos-biometrico',
  templateUrl: './maos-biometrico.component.html',
  styleUrls: ['./maos-biometrico.component.css']
})
export class MaosBiometricoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public fingers: HTMLElement[] = [];
  @Input() public filtro_id: string | null = null;
  @Output() public onClick = new EventEmitter<IThumb>();
  public currentSequenceIndex = 0; // Índice para controlar a sequência de dedos
  // Aqui o @ViewChildren é declarado
  @ViewChildren('.finger') fingersElements!: QueryList<ElementRef>;

  // Sequência de dedos para registro (mão direita -> mão esquerda)
  public readonly fingerSequence: string[] = [
    'polegar-right',
    'indicador-right',
    'medio-right',
    'anelar-right',
    'mindinho-right',
    'polegar-left',
    'indicador-left',
    'medio-left',
    'anelar-left',
    'mindinho-left'
  ];

  constructor(private fingerprintService: FingerprintService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initView();
    this.currentSequenceIndex = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtro_id'] && changes['filtro_id'].currentValue !== changes['filtro_id'].previousValue && this.filtro_id) {
      this.onReload();
    }
  }

  public onReload(): void {
    if (this.filtro_id) {
      this.checkFinger(this.filtro_id);
    }
  }

  private handleClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    // Validar se o elemento e atributos necessários estão presentes
    if (!target || !target.dataset['finger'] || !target.dataset['hand']) {
      console.warn('Elemento inválido ou atributos ausentes.');
      return;
    }

    const fingerName = `${target.dataset['finger']}-${target.dataset['hand']}`;
    const isExpectedFinger =
      this.currentSequenceIndex < this.fingerSequence.length &&
      fingerName === this.fingerSequence[this.currentSequenceIndex];

    // Validação de sequência (remova se não for necessária)
    if (!isExpectedFinger) {
      alert(
        `Por favor, siga a sequência correta. Próximo dedo esperado: ${this.fingerSequence[this.currentSequenceIndex]}`
      );
      return;
    }

    // Propagação do evento
    event.stopPropagation();

    // Alternar estado do dedo
    const isActive = target.classList.contains('active');
    this.toggleFingerState(target, isActive);

    // Emitir evento para o componente pai
    this.onClick.emit({
      name: fingerName,
      active: !isActive,
    });

    // Avançar sequência, se necessário
    if (!isActive) {
      this.currentSequenceIndex++;
    }

    // Checar se a captura foi concluída
    if (this.currentSequenceIndex === this.fingerSequence.length) {
      alert('Todas as impressões digitais foram capturadas com sucesso!');
      this.updateFeedback();
    }
  };

  private toggleFingerState(target: HTMLElement, isActive: boolean): void {
    if (isActive) {
      this.renderer.removeClass(target, 'active');
    } else {
      this.renderer.addClass(target, 'active');
    }
  }

  private initView(): void {
    this.fingers = Array.from(document.querySelectorAll('.finger'));
    this.fingers.forEach(finger => {
      this.renderer.listen(finger, 'click', this.handleClick);
    });
  }

  public checkFinger(filtroId: string): void {
    let fingerprints: any[] = [];
    this.fingerprintService.findAll({ filtro_id: filtroId })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          if (fingerprints && fingerprints.length > 0) {
            this.checkFingers_(fingerprints);
          } else {
            iziToast.warning({
              title: 'Aviso',
              message: 'Nenhuma impressão digital encontrada.',
              position: 'topRight',
            });
          }
        })
      )
      .subscribe({
        next: (response: any[] | null) => {
          fingerprints = response || []; // Garante que fingerprints sempre será um array
        },
        error: (err: any) => {
          const errorMessage = err?.message || 'Erro desconhecido';
          iziToast.error({
            title: 'Erro',
            message: `Ocorreu um erro: ${errorMessage}`,
            position: 'topRight',
          });
        }
      });
  }

  public showErrorToast(): void {
    iziToast.warning({
      title: 'Erro',
      message: 'Falha ao buscar impressões digitais. Tente novamente.',
    });
  }

  private checkFingers_(fingers_: any[]): void {
    fingers_.forEach(finger => {
      const datasetfinger = finger.thumb.split('-');
      const handElement = document.querySelector(`[data-hand='${datasetfinger[1]}']`);
      if (handElement) {
        const fingerElement = handElement.querySelector(`[data-finger='${datasetfinger[0]}']`);
        if (fingerElement) {
          this.renderer.addClass(fingerElement, 'active');
          fingerElement.removeEventListener('click', this.handleClick);
        }
      }
    });
  }

  private updateFeedback(): void {
    const totalFingers = this.fingerSequence.length;
    const activeFingersCount = this.fingers.filter(finger =>
      finger.classList.contains('active')
    ).length;

    const activeFingersList = this.fingers
      .filter(finger => finger.classList.contains('active'))
      .map(finger => {
        const [name, hand] = (finger.dataset['finger'] || '').split('-');
        const handText = hand === 'left' ? 'esquerda' : 'direita';
        return `${name} (mão ${handText})`;
      })
      .join(', ');

    console.log(`Progresso: ${activeFingersCount}/${totalFingers} dedos capturados.`);
    console.log('Dedos ativos:', activeFingersList);

    if (activeFingersCount === totalFingers) {
      console.log('Captura completa!');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public isFingerActive(fingerName: string): boolean {
    const activeFingers = this.fingers.filter(finger =>
      finger.classList.contains('active')
    ).map(finger => finger.dataset['finger']);
    return activeFingers.includes(fingerName);
  }
  
}
