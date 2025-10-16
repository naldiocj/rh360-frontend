import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsHelper {
  constructor() {}
  showSenha(input: string) {
    return input === 'password' ? 'text' : 'password';
  }

  public firstLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  public roundomColor = () => {
    const colors = [
      'rgb(55, 61, 63)',
      'rgb(0, 227, 150)',
      'rgb(254, 176, 25)',
      'rgb(255, 69, 96)',
      'rgb(119, 93, 208)',
      'rgb(0, 143, 251)',
      'var(--bgColor)',
      'var(--red)',
    ];

    let index: number = Math.floor(Math.random() * 8);

    return colors[index];
  };

  public isEnter = (key: any): boolean => key?.key == 'Enter';

  public sliceNameFile(name: string) {
    return name.length > 60
      ? `...${name.toString().slice(40, name.length)}`
      : name;
  }

  public getDevNames = (): string => {
    const names = [
      'Joselana Manuel',
      'Josefina Tiago',
      'Eng.ª Sonhadora',
      'Zelana Dev',
    ];

    return names[Math.trunc(Math.random() * 4)];
  };

  public getDevEmail = (): string => {
    const emails = [
      'joselanamanuel.cgpna@pna.gov.ao',
      'josefinatiago.cgpna@pna.gov.ao',
      'root.cgpna@pna.gov.ao',
    ];

    return emails[Math.trunc(Math.random() * 3)];
  };

  public get monthAndYear(): any {
    const date: Date = new Date();
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Augusto',
      'Setembro',
      'Outubro',
      'Nevembro',
      'Dezembro',
    ];
    return {
      month: meses[date.getMonth()],
      year: date.getFullYear(),
    };
  }

  public closeModal(id: any) {
    document.body?.classList.toggle('modal-open');
    const modal: HTMLDivElement = document.querySelector(
      `#${id}`
    ) as HTMLDivElement;
    const backdrop: HTMLDivElement = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;
    modal.style.display = 'none';
    modal.classList.remove('show');
    backdrop.classList.remove('show');

    document.body.removeChild(backdrop);
  }

  public provincies = (): Observable<any> => {
    let provincy = [
      { name: 'Bie' },
      { name: 'Benguela' },
      { name: 'Bengo' },
      { name: 'Cabinda' },
      { name: 'Cuanza-Norte' },
      { name: 'Cuanza-Sul' },
      { name: 'Cuando-Cubango' },
      { name: 'Cunene' },
      { name: 'Huambo' },
      { name: 'Huíla' },
      { name: 'Lunda-Norte' },
      { name: 'Lunda-Sul' },
      { name: 'Luanda' },
      { name: 'Malange' },
      { name: 'Móxico' },
      { name: 'Namibe' },
      { name: 'Uíge' },
      { name: 'Zaíre' },
    ];

    provincy = provincy.sort();

    return from([provincy]);
  };
  public status(status: any): any {
    if (status?.toString().toLowerCase() == 'd') {
      return {
        text: 'Perdido',
        color: '#FFA500',
      };
    } else if (status?.toString().toLowerCase() == 'a') {
      return {
        text: 'Achado',
        color: '#84F1AB',
      };
    }
  }
  public equipament = (): Observable<any> => {
    let equipaments = [
      { name: 'Computador desktop' },
      { name: 'Computador portátil' },
      { name: 'Ar condicionado' },
      { name: 'Router' },
      { name: 'Servidor' },
      { name: 'Telefone' },
      { name: 'Rádio' },
      { name: 'Lâmpadas' },
      { name: 'Candeia' },
      { name: 'Mobilário diversos' },
    ];

    equipaments = equipaments.sort();

    return from([equipaments]);
  };
  public listPatents = (): Observable<any> => {
    let patents = [
      { name: 'Comissário-Geral' },
      { name: 'Comissário-Chefe' },
      { name: 'Comissário' },
      { name: 'Subcomissário' },
      { name: 'Superintendente-chefe' },
      { name: 'Superintendente' },
      { name: 'Intendente' },
      { name: 'Inspector-Chefe' },
      { name: 'Inspector' },
      { name: 'Subinsperctor' },
      { name: '1.º Subchefe' },
      { name: '2.º Subchefe' },
      { name: '3.º Subchefe' },
      { name: 'Agente de 1.º Classe' },
      { name: 'Agente de 2.º Classe' },
      { name: 'Técnico Cívil' },
      { name: 'Alistado' },
      { name: 'Sem patente' },
    ];
    return from([patents]);
  };
  public listFunctions = (): Observable<any> => {
    let functions = [
      { name: 'Gestor (a)' },
      { name: 'Especialista' },
      { name: 'Programador (a)' },
    ];
    return from([functions]);
  };
  public listCargos = (): Observable<any> => {
    let cargos = [
      { name: 'Director Nacional' },
      { name: 'Director Adjunto' },
      { name: 'Chefe de Departamento' },
      { name: 'Chefe de Secção' },
      { name: 'Oficial Especialista' },
      { name: 'Subchefe Especialista' },
      { name: 'Especialista' },
    ];
    return from([cargos]);
  };
  public estadoCivil = (): Observable<any> => {
    let estadoCivis = [
      { name: 'Solteiro (a)' },
      { name: 'Casado (a)' },
      { name: 'Viúvo (a)' },
      { name: 'Divórsiado (a)' },
      { name: 'Outro' },
    ];
    return from([estadoCivis]);
  };

  public dirs = (): Observable<any> => {
    let dir = [{ name: 'DTTI' }, { name: 'DCII' }, { name: 'DAS' }];

    dir = dir.sort();

    return from([dir]);
  };

  public configTinymce = (): any => {
    return {
      base_url: '/tinymce',
      preffix: '.min',
      plugins: 'list image list',
      encoding: 'UTF-8',
      branding: false,
      menubar: false,
      statusbar: false,
      toolbar:
        ' blocks | fontsize | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
    };
  };
  public toogleContainer = (aside: HTMLElement, main: HTMLElement): void => {
    aside.classList.toggle('hidden');
    main.classList.toggle('larger');
  };
  public adicionarGrid = (div: HTMLDivElement): void => {
    const cameras: Array<HTMLDivElement> = Array.from(
      div.querySelectorAll('.camera')
    );
    const classes = [
      'grid-1',
      'grid-2',
      'grid-4',
      'grid-6',
      'grid-8',
      'grid-9',
      'grid-10',
      'grid-11',
      'grid-13',
      'grid-15',
      'grid-17',
      'grid-19',
      'grid-full',
    ];

    if (cameras.length) {
      div.classList.remove(...classes);
      if (cameras.length == 1) {
        div.classList.add('grid-1');
      } else if (cameras.length == 2) {
        div.classList.add('grid-2');
      } else if (cameras.length > 2 && cameras.length <= 4) {
        div.classList.add('grid-4');
      } else if (cameras.length > 4 && cameras.length <= 6) {
        div.classList.add('grid-6');
      } else if (cameras.length > 6 && cameras.length <= 8) {
        div.classList.add('grid-8');
      } else if (cameras.length == 9) {
        div.classList.add('grid-9');
      } else if (cameras.length == 10) {
        div.classList.add('grid-10');
      } else if (cameras.length == 11) {
        div.classList.add('grid-11');
      } else if (cameras.length > 11 && cameras.length <= 13) {
        div.classList.add('grid-13');
      } else if (cameras.length > 13 && cameras.length <= 16) {
        div.classList.add('grid-15');
      } else if (cameras.length > 16 && cameras.length <= 19) {
        div.classList.add('grid-17');
      } else if (cameras.length > 19) {
        div.classList.add('grid-full');
      }
    }
  };

  public usuarioActivo = (obj: any) => {
    return { ...obj };
  };

  public getDate(data_: any): any {
    const data = new Date(data_);
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

  public dataActual = (): string => {
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
  };

  public gerarID = (): string => {
    return `${Math.trunc(Math.random() * 9999)}-${Math.trunc(
      Math.random() * 9999
    )}-${Math.trunc(Math.random() * 9999)}-${Math.trunc(Math.random() * 9999)}`;
  };

  public letras = (): string => {
    return 'd5M2XG7GFDADUg5EOGDu9Obo6VQjheZqgXlGdya9OEUMYgErICAlsA5ZjRBxLeZGBUII9oiIhHc4jeWRTmLuy87iDZNaEfXvoQUQAiD2N9L5n3CuR51lJXykqOOxQizDV8R98Mhk80xFkW5ebLfQI89NEmo5C2uSaX5ymxgw2TIhWQzq3dWWuwpzQ2OEgA1CukOEHPEfmtjmuBnB6dJD24sMAaERh0Mfok9LynftshcA16fKhfMDY1VCjJlSfUw2nvtjbhsgjWf7rCRILyAa6cWJiwUd35LtUuEyaf0pKwHb0N2PFAKc3757k1rkBjiO6EWHtiNjvg90ANufuuZj158PwkjSPJgmDBiFNVS4KKC4lxBjqOSQHglVAf243K0eYeblWWjR2CRESezZCi1A4pJXqEaiG3xqmHwyuMmxeRZ439OJea6jUp41EPYQYeQa4ORFSivnOgWmvgjpzVwkGEpm3fRMzLS8EUFwvKH7Tno28nB9euteOiUwLPOTOkwGKroISrBQIDAQABAoICAAkBXxoeup6DUswhcSYgCmYglKynssyCQXYQ8MhLcjuxTAzhshzZjy3h0baM6ueMRYsXJQ18HagCQHsYooIDF8FMrb1BSAI64UpsBM33fMZ8hJlmqsFiH4wNApuknX37UaBZttmlD7fWLANkh8fSsHavWIdJqwiV3kA9wcUCs27JUjIwH4BrkHHBIZz72X06TRYJweRo5bzkSFQFBkysEdozIp6Q0CwvnKYPHqBnINUqh3vON9PtNhAd6vDk81tR6orqME5UNF2Zhs6RiEi84vtntRtKKMLfgorETpYBOf6hB7l3xRe58mFr8crb1Hdtn1K979y5Tf1S73XPfLgO1efMgjdX2AznffH6H8bBjnAvlmYcIpmoubdplb73SPUp2MqRHNBJvlxkpITP6ZA0ghpVkHs6q9rwPey9QiT5QXRyE9awXG9YaltC5kt2UxdOGZS0aQjHe9vSz9TPTrfgpkIaD2';
  };
  public gerarSenha = (): string => {
    let senha: string = '';

    for (let index = 0; index <= 10; index++) {
      senha += this.letras().charAt(
        Math.trunc(Math.random() * this.letras().length)
      );
    }

    return senha;
  };

  public gerarLink = (): string => {
    return `${environment.app_url}`;
  };

  public getYear(date: any, formato: any = '/'): number | null {
    if (date == '' || date == null) return null;
    const data_ = date.toString().split('-');
    const data_1 = `${data_[2]}/${data_[1]}/${data_[0]}`;
    const data: any = new Date(data_1);

    let anos = new Date().getFullYear() - data.getFullYear();
    return anos;
  }
  public formatarData = (date: any, formato: any): string => {
    if (date == '' || date == null) return '';
    const data = new Date(date);
    let month =
      (data.getMonth() + 1).toString().length == 1
        ? `0${data.getMonth() + 1}`
        : `${data.getMonth() + 1}`;

    let day =
      data.getDate().toString().length == 1
        ? `0${data.getDate()}`
        : `${data.getDate()}`;

    let ano = data.getFullYear();
    formato = formato !== '/' && formato !== '-' ? '-' : formato;

    return `${day}${formato}${month}${formato}${ano}`;
  };

  public formatarHora = (hora: any) => {
    if (hora == '' || hora == null) {
      return '';
    } else if (hora.toString().includes(':')) {
      hora = hora.toString().split(':');
    } else if (hora.toString().includes('-')) {
      hora = hora.toString().split('-');
    }

    return `${hora[0]}h ${hora[1]}min`;
  };

  public estado = (valor: any): string => {
    const color = [
      'color-mix(in srgb, red 60%, white)',
      'color-mix(in srgb, green 80%, white)',
    ];
    return color[valor];
  };

  public storeOpennedChat = () => {
    if (this.hasChat) {
      localStorage.removeItem('chat-openned');
      localStorage.setItem('chat-openned', `${new Date()}`);
    } else {
      localStorage.setItem('chat-openned', `${new Date()}`);
    }
  };
  public removeOpennedChat = () => {
    if (this.hasChat) {
      localStorage.removeItem('chat-openned');
    }
  };

  get hasChat(): boolean {
    const chat = localStorage.getItem('chat-openned');
    return chat != null && chat != undefined ? true : false;
  }

  public passwordValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordConfirm = formGroup.get('password_confirm')?.value;

    if (password !== passwordConfirm) {
      formGroup.get('password_confirm')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('password_confirm')?.setErrors(null);
    }
  }

  public sliceName(name: string): string {
    return name.toString().replace(/\ /g, '').toLowerCase();
  }

  public split(name: any) {
    const name_ = name.toString().split('/');
    return name_[name_.length - 1];
  }
}
