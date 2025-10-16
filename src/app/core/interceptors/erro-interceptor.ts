// @ts-nocheck
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NgxIzitoastService } from "ngx-izitoast";
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
@Injectable()
export class ErroInterceptor implements HttpInterceptor {
  protected errorHandler;
  private loginFailCount: number = 0;
  constructor(private router: Router, public iziToast: NgxIzitoastService) {
    this.iziToast.settings({
      timeout: 10000,
      displayMode: 'once',
      pauseOnHover: false,
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      position: 'topRight',
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap((evt) => {
        this.loginFailCount = 0;
        if (evt instanceof HttpResponse) {
          if (evt.body.message) {
            this.iziToast.success({
              title: 'Sucesso: ',
              message: evt.body.message,
            });
          }
        }
      }),
      catchError(({ error: err, status }: HttpErrorResponse) => {
        let errorMessage =
          err instanceof Array
            ? err[0].message
            : err?.message ?? err?.error?.message;

        // Lista de erros de token
        const tokenErrors = [
          'E_INVALID_JWT_TOKEN',
          'E_JWT_TOKEN_EXPIRED',
          'InvalidJwtToken',
          'ExpiredJwtToken',
          'E_MISSING_TOKEN'
        ];

        // Se for erro de token
        if (status === 401 && tokenErrors.includes(err.code || err.error?.name)) {
          this.handleTokenError(err.code || err.error?.name);
          return throwError(err);
        }

        const error = this.createErrorHandler(errorMessage)[status];
        if (!error) {
          this.iziToast.error({
            title: 'Erro desconhecido',
            message: 'Contacte o Administrador',
          });
        } else {
          error();
        }
        return throwError(err);
      })
    );
  }

  protected createErrorHandler(message: string) {
    const handleError = (
      title: string,
      callback: Function,
      type: string = 'error',
      notify: boolean = true,
      alternativeMessage?: string
    ) => {
      if (notify) {
        this.iziToast[type]({
          title: title || '',
          message: alternativeMessage || message,
        });
      }
      if (callback) {
        callback();
      }
    };

    return {
      400: () => {
        handleError(null, null, 'warning');
      },
      401: () => {
        handleError(
          'Não autorizado:',
          () => {
            if (this.loginFailCount < 4 && window.location.pathname !== '/login') {
              localStorage.removeItem('currentUserId');
              this.router.navigate(['/login']);
              this.authService.forceLogout();
            } else {
              this.loginFailCount++;
            }
          },
          'error',
          true
        );
      },
      403: () => {
        handleError(
          null,
          () => {
            this.router.navigate(['/403']);
          },
          null,
          false
        );
      },
      404: () => {
        handleError('Não encontrado', null, 'warning');
      },
      500: () => {
        handleError(
          'Erro Interno:',
          null,
          'error',
          true,
          'Contacte o administrador.'
        );
      },
    };
  }

  private handleTokenError(errorCode: string) {
    let message = 'Sessão expirada. Por favor, faça login novamente.';

    switch (errorCode) {
      case 'E_INVALID_JWT_TOKEN':
      case 'InvalidJwtToken':
        message = 'Token inválido. Por favor, faça login novamente.';
        break;
      case 'E_MISSING_TOKEN':
        message = 'Token não encontrado. Por favor, faça login novamente.';
        localStorage.clear();
        break;
      case 'Unauthorized':
        localStorage.clear();
        break
    }

    this.iziToast.warning({
      title: 'Autenticação',
      message: message,
    });

    // Faz logout e redireciona
    this.authService.forceLogout();
  }
}
