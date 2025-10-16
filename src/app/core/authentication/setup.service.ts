import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
// import { SetupInterface } from '@shared/models/setup.model';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SetupService {

  constructor(private http: HttpClient,
    // private auth: AuthService
  ) { }

  getSetupApplication() {
    // return this.http.get(environment.app_url + 'system/setup');
  }

  setSetupApplication(setupConfig:any) {
    // const token = this.auth.tokenValue.type + ' ' + this.auth.tokenValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: token,
    });
    // return this.http.put(
    // environment.app_url + 'system/setup',
    // {
    // setup: {
    // ...setupConfig
    // }
    // },
    // { headers }
    // );
  }
}
