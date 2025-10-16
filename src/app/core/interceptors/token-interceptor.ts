import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecureService } from '../authentication/secure.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private secureService: SecureService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não adiciona o token para requisições que não precisam de autenticação
    if (request.url.includes('/auth/login') || request.url.includes('/auth/refresh')) {
      return next.handle(request);
    }

    let token = null;
    
    // Primeiro tenta pegar o token do service
    const tokenObj = this.secureService.getTokenValue;
    if (tokenObj && tokenObj.token && tokenObj.type) {
      token = tokenObj;
    }
    
    // Se não encontrou no service, tenta do localStorage
    if (!token) {
      const savedToken = localStorage.getItem('currentUserLogin');
      if (savedToken) {
        try {
          const parsedToken = JSON.parse(savedToken);
          if (parsedToken && parsedToken.token && parsedToken.type) {
            token = parsedToken;
            // Atualiza o service com o token encontrado
            this.secureService.setToken(parsedToken);
          }
        } catch (e) {
          console.error('Erro ao parse do token:', e);
        }
      }
    }
    
    // Se encontrou um token válido, adiciona no header
    if (token && token.token && token.type) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token.type} ${token.token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
    }
    
    return next.handle(request);
  }
} 