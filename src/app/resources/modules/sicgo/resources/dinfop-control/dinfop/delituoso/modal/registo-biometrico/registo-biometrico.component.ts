import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { ZKService } from '@core/services/zk.service';
import { MaosBiometricoComponent } from '../maos-biometrico/maos-biometrico.component';
import iziToast from 'izitoast';
import Swal from 'sweetalert2';

@Component({
  selector: 'sicgo-registo-biometrico',
  templateUrl: './registo-biometrico.component.html',
  styleUrls: ['./registo-biometrico.component.css'],
})
export class RegistoBiometricoComponent implements OnInit, OnDestroy {
  @Input() delituosoId: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();
  @ViewChild(MaosBiometricoComponent) maosBiometric!: MaosBiometricoComponent;
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef<HTMLButtonElement>;

  registeredFingers: any = {
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

  selectedFinger: any = {};
  isCapturing: boolean = false;

  public simpleForm!: FormGroup;
  public imageThumb: SafeUrl | null = null;
  public capturedFingerprints: any[] = [];
  public isLoading: boolean = true;
  public isOpen: boolean = false;
  public hasPrint: boolean = false;
  public canStartScan: boolean = false;
  public isClosed: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private zkService: ZKService,
    private cdr: ChangeDetectorRef,
    private fingerprintService: FingerprintService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.hideLoaderAfterTimeout(9000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['delituosoId'] && this.delituosoId) {
      this.updateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get getIsOpen(): boolean {
    return this.isOpen;
  }

  private initForm(): void {
    this.simpleForm = this.fb.group({
      thumb: [null, Validators.required],
      finger: [null, Validators.required],
      url: [null, Validators.required],
      filtro_id: [this.delituosoId, Validators.required],
    });
  }

  private updateForm(): void {
    this.simpleForm.patchValue({ filtro_id: this.delituosoId });
  }

  public restartScanner(): void {
    this.closeScanner();
    setTimeout(() => this.openScanner(), 500);
  }

  public openScanner(): void {
    this.zkService
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.togglePanel(),
        error: (err: any) => {
          console.log(err);

          const errorMessage = err?.message || 'Erro desconhecido';
          iziToast.error({
            title: 'Erro',
            message: `Erro ao abrir scanner: ${errorMessage}`,
            position: 'topRight',
          });
        },
      });
  }

  private cleanAll(): void {
    this.imageThumb = null;
    this.capturedFingerprints = [];
    this.simpleForm.reset();
    this.selectedFinger = {};
    for (const fingerKey in this.registeredFingers) {
      this.registeredFingers[fingerKey].template = null;
      this.registeredFingers[fingerKey].image = null;
    }
  }

  public closeScanner(): void {
    this.isClosed = false;
    this.zkService
      .close()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isClosed = true;
        this.togglePanel();
        this.cleanAll();
        this.closeModal();
      });
  }

  private togglePanel(): void {
    const btn = document.querySelector('#btn-off') as HTMLLIElement;
    if (btn) {
      btn.classList.toggle('text-red-color');
      btn.classList.toggle('text-green-color');
    }

    this.isOpen = !this.isOpen;
  }

  private isValidBase64Image(base64: string): boolean {
    return /^data:image\/(png|jpeg|jpg);base64,/.test(base64);
  }

  public submitForm(): void {
    let allFingersCaptured = true;
    let hasFingersCaptured = false;
    for (const fingerKey in this.registeredFingers) {
      if (!this.registeredFingers[fingerKey].template)
        allFingersCaptured = false;
      else hasFingersCaptured = true;
    }
    if (!hasFingersCaptured) {
      iziToast.error({
        title: 'Erro',
        message: 'Sem dedos capturados',
        position: 'topRight',
      });
      return;
    }
    if (!allFingersCaptured) {
      Swal.fire({
        title: 'Salvar?',
        html: 'Nem todos os dedos foram capturados, deseja continuar mesmo assim?',
        icon: 'warning',
        cancelButtonText: 'Cancelar',
        // timer: 2000,
        showCancelButton: true,
        confirmButtonText: 'Sim, Salvar Apenas Estes!',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary px-2 mr-1',
          cancelButton: 'btn btn-danger ms-2 px-2',
        },
      }).then((result: any) => {
        if (result.value) {
          this.saveFingerprints();
        }
      });
    } else {
      this.saveFingerprints();
    }
    console.log(this.registeredFingers);

    return;
    if (this.simpleForm.invalid) {
      console.error('Formulário inválido:', this.simpleForm.errors);
      return;
    }

    const formData = this.createFormData();

    console.log('📤 Enviando dados para o backend:', formData);

    this.fingerprintService
      .register(formData)
      .pipe(finalize(() => this.resetForm()))
      .subscribe({
        next: (res) => console.log('✅ Dados enviados com sucesso:', res),
        error: (err) => console.error('❌ Erro ao enviar dados:', err),
      });
  }

  getSavedFingerprints(delituosoId: number) {
    this.fingerprintService
      .getSavedFingerprints(delituosoId)
      .subscribe((res) => {
        console.log(res);
        const { fingerprints } = res;
        for (let [finger, fingerData] of Object.entries(fingerprints)) {
          if (fingerprints[finger].template) {
            this.registeredFingers[finger].template =
              fingerprints[finger].template;
            this.registeredFingers[finger].image = fingerprints[finger].image;
          }
        }
      });
  }

  private saveFingerprints() {
    this.fingerprintService
      .saveFingerprints(this.delituosoId, this.registeredFingers)
      // .pipe(finalize(() => this.resetForm()))
      .subscribe(() => {});
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const { thumb, url, filtro_id } = this.simpleForm.value;

    formData.append('filtro_id', filtro_id.toString());
    if (url) formData.append('url', url);
    if (thumb) formData.append('thumb', thumb);

    if (!this.capturedFingerprints || this.capturedFingerprints.length === 0) {
      console.error('❌ Nenhuma impressão digital capturada!');
      return formData;
    }

    const fingerprintsArray = this.capturedFingerprints
      .map((fingerprint, index) => {
        let base64Data: string = this.sanitizeFingerprint(fingerprint);
        if (!this.isValidBase64Image(base64Data)) {
          console.error(
            `❌ Erro: fingerprint[${index}] não possui o formato Base64 esperado!`
          );
          return null;
        }

        const fingerNames = [
          'polegar-direito',
          'indicador-direito',
          'medio-direito',
          'anelar-direito',
          'mindinho-direito',
          'polegar-esquerdo',
          'indicador-esquerdo',
          'medio-esquerdo',
          'anelar-esquerdo',
          'mindinho-esquerdo',
        ];

        return {
          finger: base64Data,
          fingerName: fingerNames[index] || `finger-${index}`,
        };
      })
      .filter((f) => f !== null); // Remove valores inválidos

    // 🔥 Aqui está a mudança: Enviamos as digitais como JSON
    formData.append('fingerprints', JSON.stringify(fingerprintsArray));

    return formData;
  }

  sanitizeFingerprint(base64Data: any): string {
    if (
      typeof base64Data === 'object' &&
      'changingThisBreaksApplicationSecurity' in base64Data
    ) {
      return base64Data.changingThisBreaksApplicationSecurity;
    }
    return base64Data;
  }

  private base64ToBlob(base64: SafeUrl | string, type: string): Blob {
    const base64String =
      typeof base64 === 'string' ? base64 : base64.toString();

    if (!/^data:image\/(png|jpeg|jpg);base64,/.test(base64String)) {
      console.error('Invalid Base64 string:', base64String);
      throw new Error('Invalid Base64 string');
    }

    const base64Data = base64String.split(',')[1];

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type });
    } catch (error) {
      console.error('Failed to decode Base64 string:', error);
      throw new Error('Failed to decode Base64 string');
    }
  }

  public resetForm(): void {
    this.simpleForm.reset();
    this.imageThumb = null;
  }

  private startScanner(start: boolean = false): void {
    const thumb = document.querySelector('.thumb') as HTMLDivElement;
    const text = document.querySelector('#scaner') as HTMLDivElement;

    if (thumb) thumb.classList.toggle('off', !start);
    if (text) text.classList.toggle('on', start);
  }

  private hideLoaderAfterTimeout(ms: number): void {
    setTimeout(() => {
      this.isLoading = false;
    }, ms);
  }

  handleError(error: any) {
    const errorMessage = error?.message || 'Ocorreu um erro inesperado.';

    iziToast.warning({
      title: 'Atenção',
      message: errorMessage,
      position: 'topRight',
    });

    console.error('Erro capturado:', error);
  }

  onCapturedFingerprint(fingers: any) {
    const _fingers: any[] = [];
    for (const key of Object.keys(fingers)) {
      _fingers.push(fingers[key]);
    }
    this.capturedFingerprints = _fingers;
  }

  setCapturedFinger() {
    this.isCapturing = true;
    this.zkService
      .enroll(this.selectedFinger.fingerId)
      .pipe(
        finalize(() => {
          this.isCapturing = false;
        })
      )
      .subscribe((res) => {
        this.selectedFinger.template = res.template;
        this.selectedFinger.image = res.image;
        for (const fingerKey in this.registeredFingers) {
          if (
            this.registeredFingers[fingerKey].fingerId ===
            this.selectedFinger.fingerId
          ) {
            this.registeredFingers[fingerKey].template = res.template;
            this.registeredFingers[fingerKey].image = res.image;
          }
        }
      });
  }

  getRegisteredFingerKeys(): string[] {
    return Object.keys(this.registeredFingers);
  }

  closeModal() {
    this.closeModalBtn.nativeElement.click();
  }
}
