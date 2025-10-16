import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  SimpleChanges,
  Renderer2,
  QueryList,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import iziToast from 'izitoast';
import { ZKService } from '@core/services/zk.service';

interface IThumb {
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-maos-biometrico',
  templateUrl: './maos-biometrico.component.html',
  styleUrls: ['./maos-biometrico.component.css'],
})
export class MaosBiometricoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public fingers: HTMLElement[] = [];
  @Input() public filtro_id: string | null = null;
  @Output() public onClick = new EventEmitter<IThumb>();
  @Output() public onCapturedFingerprint = new EventEmitter<any>();
  @Output() public onSelectedFinger = new EventEmitter<any>();
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
    'mindinho-left',
  ];
  selectedFinger: any;

  // @Output() registeredFingersChange = new EventEmitter<any>();
  @Input() registeredFingers: any = {
    rightThumb: {
      template: null,
      image: '',
      fingerId: 11,
      description: 'Polegar Direito',
    },
    rightIndex: {
      template: null,
      image: '',
      fingerId: 12,
      description: 'Indicador Direito',
    },
    rightMiddle: {
      template: null,
      image: '',
      fingerId: 13,
      description: 'Médio Direito',
    },
    rightRing: {
      template: null,
      image: '',
      fingerId: 14,
      description: 'Anelar Direito',
    },
    rightLittle: {
      template: null,
      image: '',
      fingerId: 15,
      description: 'Mindinho Direito',
    },
    leftThumb: {
      template: null,
      image: '',
      fingerId: 21,
      description: 'Polegar Esquerdo',
    },
    leftIndex: {
      template: null,
      image: '',
      fingerId: 22,
      description: 'Indicador Esquerdo',
    },
    leftMiddle: {
      template: null,
      image: '',
      fingerId: 23,
      description: 'Médio Esquerdo',
    },
    leftRing: {
      template: null,
      image: '',
      fingerId: 24,
      description: 'Anelar Esquerdo',
    },
    leftLittle: {
      template: null,
      image: '',
      fingerId: 25,
      description: 'Mindinho Esquerdo',
    },
  };
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCapturedFinger(finger: any) {
    this.selectedFinger = finger;
    this.onSelectedFinger.emit(this.selectedFinger);
    this.onCapturedFingerprint.emit(true);
  }

  getCapturedFingersCount() {
    let count = 0;
    for (const fingerKey in this.registeredFingers) {
      if (this.registeredFingers[fingerKey].template) {
        count++;
      }
    }
    return count;
  }
}
