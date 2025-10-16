// import { PerfilComponent } from '@resources/prerfil/perfil.component';
// import { DefinicoesComponent } from '@resources/definicoes/definicoes.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxIziToastModule } from 'ngx-izitoast';
// import { ToastrModule } from "ngx-toastr";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { RouterModule } from '@angular/router';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { environment } from '@environments/environment';
import { ErroInterceptor } from '@core/interceptors/erro-interceptor';
import { ApiService } from '@core/providers/http/api.service';
import { AppComponent } from './app.component';
import { LoginComponent } from '@resources/login/login.component';
import { Error404Component } from '@resources/error/error404/error404.component';
import { Error500Component } from '@resources/error/error500/error500.component';
import { Error403Component } from '@resources/error/error403/error403.component';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from '@resources/modules/sigpq/layout/default/default.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { ApiZKService } from '@core/providers/http/apiZK.service';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
export function tokenGetter() {
  const tokenObj = localStorage.getItem('currentUserLogin');
  if (tokenObj) {
    try {
      const parsed = JSON.parse(tokenObj);
      return parsed.token;
    } catch (e) {
      console.error('Erro ao recuperar token:', e);
      return null;
    }
  }
  return null;
}
import { SocketService } from '@core/providers/socket/socket.service';
import { SocketIoModule } from 'ngx-socket-io';
import { PaginaRestritaComponent } from './resources/error/pagina-restrita/pagina-restrita.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Error404Component,
    Error500Component,
    Error403Component,
    DefaultComponent,
    PaginaRestritaComponent,
  ],
  imports: [
    SocketIoModule.forRoot({
      url: environment.app_url,
      options: {},
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxIziToastModule,
    ReactiveFormsModule,
    CommonModule,
    EditorModule,
    LoadingPageModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }), // resolve erro ao chamar componentes
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.defaultHost, environment.defaultZK],
        disallowedRoutes: [
          `${environment.app_url}/auth/login`,
          `${environment.app_url}/auth/refresh`,
          environment.app_zk_url
        ],
      },
    }),
    // ToastrModule.forRoot({
    //   timeOut: 2000, // Toast duration inn milliseconds
    //   progressBar: true,
    //   progressAnimation: 'increasing',
    //   positionClass: 'toast-top-right', // Toast position
    //   preventDuplicates: true // Prevent dupicate toasts
    // })
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErroInterceptor, multi: true },
    ApiService,
    FingerprintService,
    ApiZKService,
    SocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
