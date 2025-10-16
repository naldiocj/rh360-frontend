import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoresEstadoHelper {
  // Mapeamento de estados para cores
  private static readonly cor: { [key: string]: string } = {
    'P': '#FFC107', // Pendente - Amarelo
    'E': '#007BFF', // Em curso - Azul
    'A': '#6C757D', // Arquivado - Cinza
    'C': '#DC3545', // Cancelado - Vermelho
    'R': '#28A745', // Resolvido/Decidido - Verde
    '': '#000000', // Todos - Verde
  };

  private static readonly texto: { [key: string]: string } = {
    'P': 'Pendente',
    'E': 'Em curso',
    'A': 'Arquivado',
    'C': 'Cancelado',
    'R': 'Resolvido',
    '':'Todos'
  };

  public static buscarCor(estado: string): string {
    return this.cor[estado] || '#000000'; // Retorna preto se o estado não for encontrado
  }

  public static buscarTexto(letra: string): string {
    return this.texto[letra] || 'Pendente'; // Retorna preto se o estado não for encontrado
  }

}
