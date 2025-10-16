import { environment, server_config } from '@environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '@core/authentication/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, debounceTime, finalize, map } from 'rxjs';
import { FicheiroService } from '@core/services/Ficheiro.service';
@Injectable({
  providedIn: 'root',
})
export class HelpingService {
  public numeroValue!: number;
  public nomeValue!: string;
  public ObjectValue!: object;
  public anyValue: any;
  public username: any;
  public getPathCaminho: any;
  public users = ['admin', 'operador', 'Root'];
  constructor(
    private sanitizer: DomSanitizer,
    private userService: AuthService,
    private httpApi: HttpClient,
    private files: FicheiroService
  ) {
    this.DataPorIp();
  }

  public pegarFicheiroCaminho(id: number, caminho: any) {
    let fileurl, url;

    var op = {
      pessoaId: id,
      url: caminho,
    };
    //this.getPathCaminho = this.fileservice.createImageBlob(file)

    url = this.isTest(server_config.port);

    let file: any =
      url +
      ':' +
      server_config.port +
      environment.api_url_by_version +
      '/files?' +
      'PessoaId=' +
      op.pessoaId +
      '&url=' +
      op.url;
    fileurl = this.sanitizer.bypassSecurityTrustResourceUrl(file);
    return fileurl;
  }

  pegarFicheiroCaminho2(id: number, caminho: any) {
    if (!caminho) return false;

    const opcoes = {
      pessoaId: id,
      url: caminho,
    };

    console.log(opcoes);

    this.files
      .getFile(opcoes)
      .pipe()
      .subscribe((file) => {
        const fileUrl: any = this.files.createImageBlob(file);
        const urlsec: any =
          this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);

        console.log(fileUrl.changingThisBreaksApplicationSecurity);
        console.log(urlsec.changingThisBreaksApplicationSecurity);

        return urlsec;
      });

    return null; // Retorna null enquanto a chamada assíncrona não é concluída
  }

  public hasAcess(permission: string) {
    if (this.userService.isPermission(permission)) {
      return true;
    } else {
      return false;
    }
  }

  public isTest(port: any) {
      //porta de producao

    //porta de teste
    if (port == '3333') {
      return 'http://10.110.2.15';
    } else {
      //porta de teste
      return 'http://127.0.0.1';
    }

    
  }

  public get isUser(): any {
    var is;
    switch (this.userService.role.name) {
      case this.users[0]:
        is = 1;
        break;
      case this.users[1]:
        is = -1;
        break;
      case this.users[2]:
        is = 0;
        break;
    }
    return is;
  }

  public get getRandomData() {
    var data = new Date();
    var cloneData = null;
    cloneData =
      data +
      '' +
      data.getMinutes() +
      '-' +
      data.getMilliseconds() +
      Math.random();
    return cloneData;
  }

  public DataPorIp(): Observable<any> {
    return this.httpApi.get(`http://ip-api.com/json`);
  }

  public tornarFormData(formValue: any): FormData {
    const formData = new FormData();
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        formData.append(key, formValue[key]);
      }
    }
    return formData;
  }
}
