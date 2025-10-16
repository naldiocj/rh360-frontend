import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { ModalService } from '@core/services/config/Modal.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private modalService:ModalService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard.canActivate called for route:', state.url);
    console.log('Is authenticated:', this.auth.isAuthenticated());
    
    console.log('LocalStorage currentUserLogin:', localStorage.getItem('currentUserLogin'));
    
    this.modalService.fecharTodos()
    if (!this.auth.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    console.log('User authenticated, allowing access to:', state.url);
    return true;
  }
}
