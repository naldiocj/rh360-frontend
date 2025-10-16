import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { Observable, from } from 'rxjs';
type DateFormat = 'dd/mm/yyyy' | 'yyyy-mm-dd' | 'unknown';
@Injectable({
  providedIn: 'root',
})
export class FormatarDataHelper {
  constructor(@Inject(LOCALE_ID) public locale: string) { }

  /**
   * @author 'pedro.kondo@ideiasdinamicas.com'
   */
  public formatDate(data: any = null, format: string = 'yyyy-MM-dd'): any {
    if (!data) return;

    if (!data) {
      return formatDate(new Date(), format, this.locale);
    }
    if (typeof data === 'string' && /^(\d{2}\/\d{2}\/\d{4})$/.test(data)) {
      data = data.split('/').reverse().join('-');
    }
    return formatDate(data, format, this.locale);
  }

  private getDia(dia: any): string {

    return dia.toString().length == 2 ? dia as string : `0${dia}`
  }


  public dataExtensao(dat: any, ano: boolean = true) {
    let meses: any = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    dat = this.formatDate(dat, 'yyyy-MM-dd')
    const data = new Date(dat)

    return ano == true ? `${this.getDia(data.getDate())} de ${meses[data.getMonth()]} de ${data.getFullYear()}` : `${this.getDia(data.getDate())} de ${meses[data.getMonth()]}`
  }



  public getPreviousDate(
    yearsAgo: number = 0,
    monthsAgo: number = 0,
    daysAgo: number = 0,
    format: any = null
  ): any {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);

    if (yearsAgo) {
      previousDate.setFullYear(currentDate.getFullYear() - yearsAgo);
    }

    if (monthsAgo) {
      previousDate.setMonth(currentDate.getMonth() - monthsAgo);
    }

    if (daysAgo) {
      previousDate.setDate(currentDate.getDate() - daysAgo);
    }

    return this.formatDate(previousDate, format);

  }

  public convertDateDefault(str: any) {
    const [day, month, year] = str.split('/');
    const result = [year, month, day].join('-');
    return result;
  }

  public compareDate(firstDate: any, secondDate: any = null) {
    if (!firstDate || secondDate) return;

    try {
      let first = this.formatDate(new Date(firstDate), 'yyyy-MM-dd');
      let second = this.formatDate(new Date(secondDate), 'yyyy-MM-dd');

      if (!secondDate) {
        second = this.formatDate(new Date(), 'yyyy-MM-dd');
      }

      if (first > second) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }


  public validarMinusAdesao(date: Date) {
    date = this.formatDate(date, 'yyyy-MM-dd')

    const data = new Date(date)
    var year = data.getFullYear();
    var month = data.getMonth();
    var day = data.getDate();
    var c = new Date(year + 18, month, day);
    return c
  }


  public subtractMonths(numOfMonths: any, date = new Date(), format = "yyyy-MM-dd") {
    date.setMonth(date.getMonth() - numOfMonths);
    return this.formatDate(date, format);
  }

  validaDataAdesao(dateString: string, format: DateFormat): boolean {
    let day: number, month: number, year: number;

    switch (format) {
      case 'dd/mm/yyyy':
        if (!/^(0[1-9]|1[0-9]|2[0-8]|29|30|31)\/(0[1-9]|1[0-2])\/\d{4}$/.test(dateString)) {
          return false;
        }
        [day, month, year] = dateString.split("/").map(Number);
        break;

      case 'yyyy-mm-dd':
        if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8]|29|30|31)$/.test(dateString)) {
          return false;
        }
        [year, month, day] = dateString.split("-").map(Number);
        break;

      default:
        throw new Error("Unsupported date format");
    }

    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() + 1 === month;
  }

  public autodate(): Observable<any> {
    const arryOfYear: Array<number> = [];
    const date: Date = new Date();
    for (let x = 0; x <= 3; x++) {
      let data_ = new Date(date.setFullYear(date.getFullYear() + 1));
      arryOfYear.push((new Date(data_).getFullYear() - 1) as number);
    }
    return from([arryOfYear]);
  }

  public detectDateFormat(dateString: string): DateFormat {
    if (
      /^(0[1-9]|1[0-9]|2[0-8]|29|30|31)\/(0[1-9]|1[0-2])\/\d{4}$/.test(
        dateString
      )
    ) {
      return 'dd/mm/yyyy';
    } else if (
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8]|29|30|31)$/.test(dateString)
    ) {
      return 'yyyy-mm-dd';
    } else {
      return 'unknown';
    }
  }

  public getData(data_: any): any {
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

  // Método para formatar a data no formato DD-MM-YYYY
  /*formatDateIso(date: string, format: string = 'DD-MM-YYYY'): string {
   const dateObj = new Date(date);
   const day = String(dateObj.getDate()).padStart(2, '0');
   const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
   const year = dateObj.getFullYear();

   if (format === 'DD-MM-YYYY') {
     return `${day}-${month}-${year}`;
   } else {
     return date; // Retorna a data original se o formato não for reconhecido
   }
 }*/

  // Exemplo de implementação segura do formatDateIso
  formatDateIso(dateString: string, format: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';

    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('DD', date.getDate().toString().padStart(2, '0'));
  }


  public formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  public getAnos(data: string): number {
    const dat = this.formatDate(data, 'yyyy-MM-dd')

   


    const dataInicial = new Date(dat);
    const dataAtual = new Date();

    let anos = dataAtual.getFullYear() - dataInicial.getFullYear();

    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();
    const mesAniversario = dataInicial.getMonth();
    const diaAniversario = dataInicial.getDate();

    if (
      mesAtual < mesAniversario ||
      (mesAtual === mesAniversario && diaAtual < diaAniversario)
    ) {
      anos--;
    }

    return anos < 0 ? 0 : anos;
  }

}

