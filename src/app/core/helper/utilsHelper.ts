import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilsHelper {

  constructor(private location: Location) { }

  /**
   * @author 'noexcript@gmail.com'
   * @param {string} quadro
   * @returns {boolean}
   */

  public temQuadro = (quadro: string): boolean => {
    return ['I', 'II'].includes(quadro);
  };

  /**
   * @author 'noexcript@gmail.com'
   * @param {string} regime
   * @param {string} funcao
   * @param {string} cargo
   * @returns {string}
   */

  public buscarFuncao = (
    regime: string,
    funcao: string,
    cargo: string
  ): string => {
    
    if(!cargo && funcao) return funcao;
    else if(!funcao && cargo) return cargo;
    else return 'S/N'; 

    if (['especial'].includes(regime.toLowerCase())) {
      if (!cargo) return 'S/N';
      return cargo;
    } else if (['geral'].includes(regime.toLowerCase())) {
      if (!funcao) return 'S/N';
      return funcao;
    } else {
      return 'S/N';
    }
  };

  /**
   * @author 'noexcript@gmail.com'
   * @param {string} nome
   * @param {string} apelido
   * @param {string} apelid
   * @returns {string}
   */
  public criarApelido(
    nome: string,
    apelido: string | null,
    apelid: boolean = true
  ): string {
    if (!nome && !apelido) return 'S/N';

    let nome_completo: string | Array<string> = nome;
    if (apelido) {
      if (nome_completo.toString().includes(apelido))
        nome = nome_completo.toString().replace(apelido, '');
    } else {
      nome_completo = nome.split(' ');

      let apel = nome_completo[nome_completo.length - 1];
      if (
        ['da', 'de', 'do', 'das', 'dos'].includes(
          nome_completo[nome_completo.length - 2].toString()?.toLowerCase()
        )
      ) {
        apel = nome_completo[nome_completo.length - 2] + ' ' + apel;
      }

      nome = nome.replace(apel, '');
      apelido = apel;
    }
    return apelid ? apelido : nome;
  }

  /**
   * @author 'noexcript@gmail.com'
   * @param {string} text
   * @returns {string}
   */
  public capitalize = (text: string): string => {
    if (!text) return 'S/N';

    const prepositions = new Set(['da', 'de', 'do', 'das', 'e', 'o']);
    const values = text.split(' ');

    return values
      .map((val) => {
        val = val.toLowerCase();
        return prepositions.has(val)
          ? val
          : val.charAt(0).toUpperCase() + val.slice(1);
      })
      .join(' ');
  };

  /**
   *
   * @param {string} text
   * @returns {SafeHtml}
   */

  public sliceName(name: string): string {
    return name?.toString().replace(/\ /g, '').toLowerCase();
  }

  public split(name: any) {
    const name_ = name.toString().split('/');
    return name_[name_.length - 1];
  }

  public validarString(text: string, length: number = 18): string {
    return text?.toString()
      ? text?.toString()?.substring(0, length) + '...'
      : 'S/N';
  }

  public add244(numero: string) {
    if (!numero) return '+244';
    return numero.startsWith('+244') ? numero : '+244 ' + numero;
  }

  public buscarGenero(value: string): string {
    if (!value) return 'S/N';

    const genero: { [key: string]: string } = {
      M: 'Masculino',
      F: 'Feminino',
    };

    value = value.toUpperCase();

    return genero[value] || 'S/N';
  }

  /**
   * @author 'noexcript@gmail.com'
   * @param {string} value
   * @returns {boolean || null}
   */

  public isEspecial(value: string): boolean | null {
    if (!value) return null;
    return ['I'].includes(value);
  }

  public voltar(): void {
    this.location.back()
  }

  public eInscrito(valor: string | null): { texto: string; bg: string; inscrito: boolean, } {
    const isInscrito = valor !== null;

    return {
      texto:  isInscrito ? 'Inscrito' : 'Reformado',
      bg: isInscrito ? 'darkblue' : 'gray',
      inscrito: isInscrito
    };
  }



}
