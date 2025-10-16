import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() { }

  public autoAno(): Observable<any> {
    const anos: Array<number> = [];
    const data: Date = new Date();
    for (let x = 0; x <= 3; x++) {
      let data_ = new Date(data.setFullYear(data.getFullYear() + 1));
      anos.push((new Date(data_).getFullYear() - 1) as number);
    }
    return from([anos]);
  }

  public get dataActual(): string | Date {
    const data = new Date();
    let month =
      (data.getMonth() + 1).toString().length == 1
        ? `0${data.getMonth() + 1}`
        : `${data.getMonth() + 1}`;

    let day =
      data.getDate().toString().length == 1
        ? `0${data.getDate()}`
        : `${data.getDate()}`;

    return `${data.getUTCFullYear()}-${month}-${day}`;
  }

  public get enviado(): string {
    return 'rgb(64, 232, 22)';
  }

  public get pendente(): string {
    return 'rgb(254, 176, 25)';
  }

  public get reprovado(): string {
    return 'red';
  }

  public get aprovado(): string {
    return ' rgb(0, 143, 251)';
  }

  public dataNormal(d: any) {
    const data: Date = new Date(d);

    const dias = [
      {
        sigla: 'Seg',
        nome: 'Segunda - feira',
      },
      {
        sigla: 'Ter',
        nome: 'Terça - feira',
      },
      {
        sigla: 'Qua',
        nome: 'Quarta - feira',
      },
      {
        sigla: 'Qui',
        nome: 'Quinta- feira',
      },
      {
        sigla: 'Sex',
        nome: 'Sexta - feira',
      },
      {
        sigla: 'Sáb',
        nome: 'Sábado',
      },
      {
        sigla: 'Dom.',
        nome: 'Domingo',
      },
    ];

    const mes = [
      { sigla: 'Jan', nome: 'Janeiro' },
      { sigla: 'Fev', nome: 'Fevereiro' },
      { sigla: 'Mar', nome: 'Março' },
      { sigla: 'Abr', nome: 'Abril' },
      { sigla: 'Mai', nome: 'Maio' },
      { sigla: 'Jun', nome: 'Junho' },
      {
        sigla: 'Jul',
        nome: 'Julho',
      },
      {
        sigla: 'Ago',
        nome: 'Agosto',
      },
      {
        sigla: 'Ago',
        nome: 'Agosto',
      },
      {
        sigla: 'Set',
        nome: 'Setembro',
      },
      {
        sigla: 'Out',
        nome: 'Outubro',
      },
      {
        sigla: 'Nov',
        nome: 'Novembro',
      },
      {
        sigla: 'Dez',
        nome: 'Dezembro',
      },
    ];

    return {
      dia: dias[data.getDay() - 1],
      mes: mes[data.getMonth()],
      ano: data.getFullYear(),
    };
  }

  public estado = (key: any): any | null => {
    const estados: any = {
      E: {
        nome: 'Enviado',
        cor: this.enviado,
      },
      P: {
        nome: 'Pendente',
        cor: this.pendente,
      },
      R: {
        nome: 'Reprovado',
        cor: this.reprovado,
      },
      A: {
        nome: 'Aprovado',
        cor: this.aprovado,
      },
    };
    return estados[key?.toString().toUpperCase()];
  };
  public estado_escala = (key: any): any | null => {
    const estados: any = {
      E: {
        nome: 'Enviado',
        cor: this.enviado,
      },
      C: {
        nome: 'Cumprido',
        cor: this.aprovado,
      },
      NC: {
        nome: 'Não-Cumprido',
        cor: this.reprovado,
      },
    };
    return estados[key?.toString().toUpperCase()];
  };
  public turno = (key: any): any | null => {
    const estados: any = {
      M: {
        nome: 'MANHÃ',
      },
      T: {
        nome: 'TARDE',
      },
      N: {
        nome: 'NOITE',
      },
      D: {
        nome: '24 DIAS',
      },
    };
    return estados[key?.toString().toUpperCase()];
  };

  public extensao(tipo: any): any {
    const typeMap: any = {
      'image/jpg codecs=opus': 'jpg',
      'image/jpeg codecs=opus': 'jpeg',
      'image/png codecs=opus': 'png',
      'image/gif codecs=opus': 'gif',
      'image/svg+xml codecs=opus': 'svg',
      'image/webp codecs=opus': 'webp',
      'video/mp4 codecs=opus': 'mp4',
      'video/webcam codecs=opus': 'webcam',
      'application/pdf codecs=opus': 'pdf',
      'application/json codecs=opus': 'json',
      'application/x-zip-compressed  codecs=opus': 'zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document codecs=opus':
        'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet codecs=opus':
        'xlxs',
      'text/plain codecs=opus': 'txt',
      'text/html codecs=opus': 'html',
    };

    return typeMap[tipo];
  }

 

  public imprirBrower(div: HTMLDivElement | any) {
    const documento: HTMLDivElement = <HTMLDivElement>(
      document.querySelector(`#${div}`)
    );
    if (!documento) return;

    document.body.innerHTML = documento.outerHTML;
    window.print();
    window.location.reload();
  }

  public getCapitalize(text: string | any) {
    return text[0]?.toString().toUpperCase() + text?.toString().slice(1, text?.toString().length).toLowerCase();
  }

  public redicionarNovaPagina(url: any) {
    const ancora: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement
    ancora.href = url
    ancora.target = "__blank"
    document.body.appendChild(ancora)
    ancora.click()
    document.body.removeChild(ancora)
  }

}
