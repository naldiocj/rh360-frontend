import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { ZKService } from '@core/services/zk.service';
import iziToast from 'izitoast';
import Swal from 'sweetalert2';

@Component({
  selector: 'sicgo-busca-biometrica',
  templateUrl: './busca-biometrica.component.html',
  styleUrls: ['./busca-biometrica.component.css'],
})
export class BuscaBiometricaComponent implements OnInit, OnDestroy {
  @Input() delituosoId: any;
  @Output() onMatchFound = new EventEmitter<any>();
  @Output() onSearchComplete = new EventEmitter<boolean>();

  public isLoading = false;
  public isOpen = false;
  public isClosed = true;
  public isSearching = false;

  public matchResult: any = null;
  public capturedFingerprint: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private zkService: ZKService,
    private cdr: ChangeDetectorRef,
    private fingerprintService: FingerprintService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openScanner(): void {
    this.zkService.open().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.togglePanel(),
      error: (err) => this.showError('Erro ao abrir scanner', err),
    });
  }

  public closeScanner(): void {
    this.isClosed = false;
    this.zkService.close().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isClosed = true;
      this.togglePanel();
      this.resetSearch();
    });
  }

  private togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

public verifyIfFingerprintIsRegistered(): void {
  if (this.isSearching) return;

  this.isSearching = true;
  this.matchResult = null;

  // 1. Captura a digital
  this.zkService.capture().pipe(
    takeUntil(this.destroy$),
    finalize(() => {
      this.isSearching = false;
      this.cdr.detectChanges();
    })
  ).subscribe({
    next: (captureRes) => {
      console.log('Resultado da captura:', captureRes);

      if (captureRes?.template && captureRes.image?.startsWith('data:image/')) {
        this.capturedFingerprint = captureRes;

        // 2. Após capturar, tenta identificar
        this.checkFingerprintInDatabase(captureRes.template);
      } else {
        this.showToast('warning', 'Nenhuma digital válida capturada');
      }
    },
    error: (err) => this.showError('Erro ao capturar digital', err),
  });
}


  private checkFingerprintInDatabase(template: string): void {
    this.isLoading = true;

    this.fingerprintService.searchFingerprint(template).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isLoading = false;
        this.onSearchComplete.emit(true);
      })
    ).subscribe({
      next: (result) => {
        if (result?.match) {
          this.matchResult = result;
          this.onMatchFound.emit(result);
          this.showToast('success', 'Digital registrada encontrada!');
        } else {
          this.showToast('info', 'Digital não registrada');
        }
      },
      error: (err) => this.showError('Erro ao buscar digital no banco', err),
    });
  }

  public resetSearch(): void {
    this.matchResult = null;
    this.capturedFingerprint = null;
    this.isSearching = false;
    this.onSearchComplete.emit(false);
  }

  public getFingerImage(): SafeUrl | null {
  const image = this.capturedFingerprint?.image;

  if (
    typeof image === 'string' &&
    image.startsWith('data:image/') &&
    image.length > 100
  ) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }

  console.warn('Imagem de digital inválida ou ausente:', image);
  return null;
}


  private showToast(type: 'success' | 'info' | 'warning' | 'error', message: string): void {
    iziToast[type]({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      position: 'topRight',
    });
  }

  private showError(message: string, error: any): void {
    console.error(message, error);
    this.showToast('error', `${message}: ${error?.message || 'Erro desconhecido'}`);
  }
}

