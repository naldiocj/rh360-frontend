import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioValidation {
  errorMessages: any;
  formRegras: any;

  constructor() {

    this.formRegras = {
      nonEmpty: '^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$',
      nome_completo_min: 5,
      apelido_minimo: 1,
    //   dataPattern: '^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|' +
    //     '(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|' +
    //     '[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|' +
    //     '[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]' +
    //     '|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])' +
    //     '|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$'
    };

    this.errorMessages = {
      nome_completo: {
        required: 'Este campo é obrigatório',
        minLength: `O nome completo tem de ter no mínimo ${this.formRegras.nome_completo_min} caracteres`,
        number: `O nome não deve conter número`
      },
      // email: {
      // required: 'O email é obrigatório'//,
      // minLength: `Asigla tem de ter no mínimo ${this.formRegras.sobrenomeMin} caracteres`
      // },
      // contato: {
      //   maxLength: 'O campo contacto deve ter 9 caracteres',
      //   minLength: `O campo contacto deve ter 9 caracteres`
      // },
      // roles: {
      //   required: 'A sigla é obrigatória',
      //   minLength: `Asigla tem de ter no mínimo ${this.formRegras.sobrenomeMin} caracteres`
      // },
      // is_active: {
      //   required: 'O estado é obrigatória'
      // }
    };

  }

  // Headers
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // } 


  // Manipulação de erros
  // handleError(error: HttpErrorResponse) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // Erro ocorreu no lado do client
  //     errorMessage = error.error.message;
  //   } else {
  //     // Erro ocorreu no lado do servidor
  //     errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
  //   }
  //   console.log(errorMessage);
  //   return throwError(errorMessage);
  // };
}
