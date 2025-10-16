import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ApiService } from "@core/providers/http/api.service";
import { finalize, map, Observable } from 'rxjs';
import { SecureService } from "./secure.service";


@Injectable({
    providedIn: 'root',
})
export class AuthService {


    constructor(
        private secureService: SecureService,
        private httpApi: ApiService,
        private jwtHelper: JwtHelperService,
    ) { }

    login(loginFormValue: { email: string, password: string }): Observable<any> {
        console.log('AuthService.login called with:', loginFormValue);
        return this.httpApi
            .post('/api/v1/login', loginFormValue)
            .pipe(
                map((response: any): void => {
                    console.log('AuthService.login response:', response);
                    this.secureService.setToken(response);
                    console.log('Token set successfully');
                    
                    // Aguardar um pouco para garantir que o token foi processado
                    setTimeout(() => {
                        console.log('AuthService - Token verification after login:');
                        console.log('Token value:', this.secureService.getTokenValue);
                        console.log('Is authenticated:', this.isAuthenticated());
                        console.log('User data:', this.user);
                        console.log('Modules:', this.modules);
                    }, 100);
                })
            );
    }

    alterarSenha(loginFormValue: any): Observable<any> {
        return this.httpApi
            .post(`/api/v1/sigpq/config/acl/utilizador/${loginFormValue.email}/forcar-alterar-senha`, loginFormValue)
            .pipe(
                map((response: Object): any => {
                    return Object(response).object;
                })
            );
    }

    logout(): void {
        this.httpApi
            .post('/api/v1/logout')
            .pipe(finalize((): void => { window.location.reload() }))
            .subscribe(
                (data: any): void => {
                    // remove user from local storage to log user out
                    this.secureService.removeTokenValue
                    localStorage.removeItem('currentUserLogin');
                    localStorage.clear();
                    window.location.reload()
                },
                (error: any): void => {
                    this.secureService.removeTokenValue
                    localStorage.removeItem('currentUserLogin');
                    localStorage.clear();
                    window.location.reload()
                }
            );
    }

    /**
     * @author 'pedrokondo20@gmail.com'
     * @description 'Permite verificar se o user tem permissão'
     * @param permission and route
     */
    public isPermission(permission: any = null, route: any = null): boolean {
        permission = permission == null ? route.data.expectedPermission : permission;
        const permissions: any = this.secureService
            .getTokenValueDecode()?.permissions
            .map((item: any): any => item.name);

        return permissions.includes(permission)
    }

    /**
     * @author 'pedrokondo20@gmail.com'
     * @description 'Retorna o estado da autenticação'
     */
    public getAuthStatus(): boolean {
        return this.secureService.getTokenValue ? true : false;
    }

    /**
     * @author 'pedrokondo20@gmail.com'
     * @description 'Retor false se o token é válido'
     */
    public isAuthenticated(): boolean {
        try {
            // Verifica se existe um token
            const tokenObj = this.secureService.getTokenValue;
            if (!tokenObj || !tokenObj.token) {
                console.log('No token found');
                return false;
            }

            // Verifica se o token é válido
            const token = tokenObj.token;
            if (!token || this.jwtHelper.isTokenExpired(token)) {
                console.log('Token is expired or invalid');
                // Limpa o token expirado
                this.secureService.removeTokenValue;
                return false;
            }

            // Verifica se consegue decodificar o token
            const decoded = this.secureService.getTokenValueDecode();
            if (!decoded || !decoded.user) {
                console.log('Token payload is invalid');
                return false;
            }

            console.log('Token is valid');
            return true;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }

    get tokenDecode() {
        return this.secureService.getTokenValueDecode()
    }

    get modules() {
        return this.secureService.getTokenValueDecode()?.modules
    }

    get orgao() {
        return this.secureService.getTokenValueDecode()?.orgao
    }

    get permissions() {
        return this.secureService.getTokenValueDecode()?.permissions
    }

    get pessoa() {
        return this.secureService.getTokenValueDecode()?.pessoa
    }

    get role() {
        return this.secureService.getTokenValueDecode()?.role
    }

    get user() {
        return this.secureService.getTokenValueDecode()?.user
    }

    get isAdmin() {
        return ['admin', 'root'].includes(this.role?.name?.toString().toLowerCase())
    }

    get secureServicePublic() {
        return this.secureService;
    }


}