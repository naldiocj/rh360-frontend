import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Token, TokenData } from "@shared/models/token.model";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@environments/environment";
import { catchError, map } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Auth } from "@shared/models/auth.model";


@Injectable({
  providedIn: 'root',
})
export class SecureService {

  private tokenSubject: BehaviorSubject<Token>;
  public token: Observable<Token>;
  private current: string = 'currentUserLogin';

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient
  ) {
    const local: string | null = localStorage.getItem(this.current);
    let localToObject: any = null;
    try {
      localToObject = local ? JSON.parse(local) : null;
      // Verifica se o token está no formato correto
      if (localToObject && (!localToObject.token || !localToObject.type)) {
        localStorage.removeItem(this.current);
        localToObject = null;
      }
    } catch (e) {
      localStorage.removeItem(this.current);
      localToObject = null;
    }
    const initialToken = localToObject ? new Token().deserialize(localToObject) : new Token();
    this.tokenSubject = new BehaviorSubject<Token>(initialToken);
    this.token = this.tokenSubject.asObservable();
  }

  get getHeaders(): HttpHeaders {
    const token = this.getTokenValue;
    const headersConfig: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    if (token && token.token && token.type) {
      headersConfig['Authorization'] = `${token.type} ${token.token}`;
    }

    return new HttpHeaders(headersConfig);
  }

  get getZKHeaders(): HttpHeaders {
    const headersConfig = {
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }



  setToken(token: any): void {
    console.debug('SecureService.setToken called');
    
    try {
      // Normaliza o formato do token
      let tokenData = typeof token === 'string' ? JSON.parse(token) : token;
      
      // Extrai dados do objeto de resposta se necessário
      if (tokenData.object && typeof tokenData.object === 'object') {
        tokenData = tokenData.object;
      }
      
      // Extrai token e tipo
      const tokenValue = tokenData.token || tokenData.access_token || tokenData;
      const tokenString = typeof tokenValue === 'string' ? tokenValue : tokenValue.token;
      const tokenType = tokenData.type || tokenData.token_type || 'Bearer';
      
      if (!tokenString) {
        throw new Error('Token inválido: string do token não encontrada');
      }

      // Decodifica o token para verificar sua estrutura
      const decoded = jwtDecode(tokenString);
      
      // Cria uma nova instância do Token
      const tokenInstance = new Token();
      
      // Processa os dados decodificados
      const decodedData = Object(decoded);
      
      // Deserializa com os dados completos
      tokenInstance.deserialize({
        token: tokenString,
        type: tokenType,
        refreshToken: tokenData.refreshToken || tokenData.refresh_token,
        user: decodedData.user || decodedData.data?.user,
        orgao: decodedData.orgao || decodedData.data?.orgao,
        role: decodedData.role || decodedData.data?.role,
        permissions: decodedData.permissions || decodedData.data?.permissions,
        modules: decodedData.modules || decodedData.data?.modules,
        pessoa: decodedData.pessoa || decodedData.data?.pessoa,
        data: decodedData.data
      });

      // Valida se os dados essenciais foram extraídos
      if (!tokenInstance.user || !tokenInstance.orgao) {
        console.warn('Token data incomplete after deserialization:', {
          hasUser: !!tokenInstance.user,
          hasOrgao: !!tokenInstance.orgao
        });
      }

      // Armazena o token processado
      const tokenJson = JSON.stringify(tokenInstance);
      localStorage.setItem(this.current, tokenJson);
      this.tokenSubject.next(tokenInstance);
      
      console.debug('Token processed and stored successfully');
    } catch (error) {
      console.error('Error processing token:', error);
      localStorage.removeItem(this.current);
      this.tokenSubject.next(new Token());
      throw error; // Propaga o erro para tratamento adequado
    }
  }

  get getTokenValue(): Token {
    const emptyToken = new Token();
    let token = this.tokenSubject.value;
    
    // Se não tiver token no subject, tenta recuperar do localStorage
    if (!token || !token.token) {
      const storedToken = localStorage.getItem(this.current);
      if (storedToken) {
        try {
          const parsedToken = JSON.parse(storedToken);
          if (parsedToken && parsedToken.token) {
            // Cria uma nova instância do Token com os dados armazenados
            token = new Token().deserialize(parsedToken);
            this.tokenSubject.next(token);
          } else {
            return emptyToken;
          }
        } catch (e) {
          console.error('Erro ao parse do token:', e);
          return emptyToken;
        }
      } else {
        return emptyToken;
      }
    }
    
    // Verifica se o token está expirado
    if (token && token.token) {
      try {
        const decoded = jwtDecode(token.token);
        const expiration = Object(decoded).exp * 1000; // converte para milissegundos
        
        if (expiration > Date.now()) {
          // Se o token ainda é válido, atualiza os dados se necessário
          if (!token.data) {
            const decodedObj = Object(decoded);
            token = new Token().deserialize({
              ...token,
              user: decodedObj.user || decodedObj.data?.user,
              orgao: decodedObj.orgao || decodedObj.data?.orgao,
              role: decodedObj.role || decodedObj.data?.role,
              permissions: decodedObj.permissions || decodedObj.data?.permissions,
              modules: decodedObj.modules || decodedObj.data?.modules,
              pessoa: decodedObj.pessoa || decodedObj.data?.pessoa,
              data: decodedObj.data
            });
            this.tokenSubject.next(token);
          }
          return token;
        } else {
          console.log('Token expired, removing...');
          this.removeTokenValue;
          return emptyToken;
        }
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
        return emptyToken;
      }
    }
    
    return emptyToken;
  }

  public refreshToken(): Observable<any> {
    const tokenObj = this.getTokenValue;
    if (!tokenObj || !tokenObj.token) {
      return throwError('No token available');
    }

    return this.http.post(environment.app_url + '/auth/refresh', {
      token: tokenObj.refreshToken || tokenObj.token // usa o token atual se não houver refresh token
    }).pipe(
      map((response: any) => {
        if (response && response.token) {
          this.setToken(response);
          return response;
        }
        return null;
      }),
      catchError(error => {
        this.removeTokenValue;
        return throwError(error);
      })
    );
  }

  get removeTokenValue(): boolean {

    if (this.getTokenValue) {
      const emptyToken = new Token();
      this.tokenSubject.next(emptyToken);
      localStorage.removeItem(this.current);
      localStorage.clear();
      return true;
    }
    return false;
  }

  public getTokenValueDecode(): TokenData {
    try {
      const tokenValue = this.getTokenValue;
      if (!tokenValue?.token) {
        console.debug('No token available for decoding');
        return this.createEmptyTokenData();
      }

      // Se já temos os dados do token desserializados e válidos, retorna eles
      if (tokenValue.data?.user && tokenValue.data?.orgao) {
        return this.ensureTokenDataFields(tokenValue.data);
      }

      // Decodifica o token
      const decoded = jwtDecode(tokenValue.token);
      console.debug('Token decoded successfully');

      // Converte para objeto e extrai os dados
      const tokenData = Object(decoded);
      const extractedData = {
        user: this.ensureUserFields(tokenData.user || tokenData.data?.user),
        orgao: this.ensureOrgaoFields(tokenData.orgao || tokenData.data?.orgao),
        permissions: tokenData.permissions || tokenData.data?.permissions || [],
        modules: tokenData.modules || tokenData.data?.modules || {},
        role: tokenData.role || tokenData.data?.role || { id: 0, name: '' },
        pessoa: tokenData.pessoa || tokenData.data?.pessoa || { id: 0 }
      };

      // Valida dados essenciais
      if (!extractedData.user || !extractedData.orgao) {
        console.warn('Token data is incomplete:', {
          hasUser: !!extractedData.user,
          hasOrgao: !!extractedData.orgao
        });
      }

      // Atualiza o token com os dados extraídos
      tokenValue.data = extractedData;
      tokenValue.user = extractedData.user;
      tokenValue.orgao = extractedData.orgao;

      // Salva o token atualizado
      localStorage.setItem(this.current, JSON.stringify(tokenValue));
      this.tokenSubject.next(tokenValue);

      return extractedData;
    } catch (error) {
      console.error('Error decoding token:', error);
      return this.createEmptyTokenData();
    }
  }

  public converteTimestampParaData(timestamp: number): Date {
    const data = new Date(timestamp * 1000);
    // data.toISOString()
    return data;
  }

  public getTokenExpira(): any {
    if (!this.getTokenValue.token) return
    const decode = jwtDecode(this.getTokenValue.token)
    const object = Object(decode)
    return {
      exp: this.converteTimestampParaData(object.exp),
      iat: this.converteTimestampParaData(object.iat)
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getTokenValue;
    if (!token || !token.token) return false;
    
    try {
      const decoded = jwtDecode(token.token);
      const expiration = Object(decoded).exp * 1000; // converte para milissegundos
      return expiration > Date.now();
    } catch (e) {
      return false;
    }
  }

  private createEmptyTokenData(): TokenData {
    return {
      user: {
        id: 0,
        username: '',
        email: '',
        activo: false,
        nome_completo: '',
        aceder_todos_agentes: false,
        aceder_painel_piips: false
      },
      orgao: {
        id: 0,
        nome: '',
        sigla: ''
      },
      role: {
        id: 0,
        name: ''
      },
      permissions: [],
      modules: {},
      pessoa: {
        id: 0
      }
    };
  }

  private ensureUserFields(user: any): import('@shared/models/token.model').User {
    return {
      id: user?.id || 0,
      nome_completo: user?.nome_completo || '',
      email: user?.email || '',
      username: user?.username,
      pessoas_id: user?.pessoas_id,
      activo: user?.activo || 0,
      aceder_todos_agentes: !!user?.aceder_todos_agentes,
      aceder_painel_piips: !!user?.aceder_painel_piips,
      ...user
    };
  }

  private ensureOrgaoFields(orgao: any): import('@shared/models/token.model').Orgao {
    return {
      id: orgao?.id || 0,
      nome: orgao?.nome || '',
      sigla: orgao?.sigla || '',
      ...orgao
    };
  }

  private ensureTokenDataFields(data: Partial<TokenData>): TokenData {
    return {
      user: this.ensureUserFields(data.user),
      orgao: this.ensureOrgaoFields(data.orgao),
      role: data.role || { id: 0, name: '' },
      permissions: data.permissions || [],
      modules: data.modules || {},
      pessoa: data.pessoa || { id: 0 }
    };
  }

  private refreshTokenIfNeeded(): void {
    const token = this.getTokenValue;
    if (!token || !token.token) return;

    try {
      const decoded = jwtDecode(token.token);
      const expiration = Object(decoded).exp * 1000;
      const timeUntilExpiry = expiration - Date.now();
      
      // Se faltar menos de 5 minutos para expirar, tenta renovar
      if (timeUntilExpiry > 0 && timeUntilExpiry < 300000) {
        this.refreshToken().subscribe(
          () => console.log('Token refreshed successfully'),
          error => console.error('Error refreshing token:', error)
        );
      }
    } catch (e) {
      console.error('Erro ao verificar expiração do token:', e);
    }
  }

}
