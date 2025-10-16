import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastNotificationService, ToastMessage } from '../service/toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11;">
      <div 
        *ngFor="let toast of toasts" 
        class="toast show" 
        [ngClass]="{
          'bg-success text-white': toast.type === 'success',
          'bg-danger text-white': toast.type === 'error',
          'bg-warning text-dark': toast.type === 'warning',
          'bg-info text-white': toast.type === 'info'
        }"
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">
            {{ toast.type === 'success' ? 'Sucesso' : 
               toast.type === 'error' ? 'Erro' : 
               toast.type === 'warning' ? 'Aviso' : 'Informação' 
            }}
          </strong>
          <button 
            type="button" 
            class="btn-close" 
            (click)="removeToast(toast)"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast {
      margin-bottom: 10px;
    }
  `]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription | null = null;

  constructor(private toastService: ToastNotificationService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toastState$
      .subscribe(toast => {
        const newToast = { ...toast };
        this.toasts.push(newToast);

        // Auto-remove toast after specified duration
        if (newToast.duration) {
          setTimeout(() => this.removeToast(newToast), newToast.duration);
        }
      });
  }

  removeToast(toastToRemove: ToastMessage): void {
    this.toasts = this.toasts.filter(toast => toast !== toastToRemove);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
