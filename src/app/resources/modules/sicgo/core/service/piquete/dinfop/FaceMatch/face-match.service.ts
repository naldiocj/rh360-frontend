import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

export interface Fotografia {
  id: number;
  facedata: string;          // string JSON dos descritores [[…]]
  // ... outros campos omitidos
}

@Injectable({ providedIn: 'root' })
export class FaceMatchService {
  /** Converte a string JSON em Float32Array */
  public parseFaceData(facedata: string): Float32Array {
    // JSON.parse vai resultar num array de arrays, extraímos o primeiro.
    const nested: number[][] = JSON.parse(facedata);
    const flat: number[] = nested[0];
    return new Float32Array(flat);
  }

  /** Retorna a distância euclidiana entre dois descritores */
  public computeDistance(
    d1: Float32Array,
    d2: Float32Array
  ): number {
    return faceapi.euclideanDistance(d1, d2);
  }

  /**
   * Recebe seu descriptor em tempo real e uma lista de registros,
   * devolve os matches abaixo do threshold, ordenados por similaridade.
   */
  public findBestMatches(
    liveDescriptor: Float32Array,
    registros: Fotografia[],
    threshold = 0.6
  ): { fotografia: Fotografia; distance: number }[] {
    const matches = registros
      .map((foto) => {
        const stored = this.parseFaceData(foto.facedata);
        const dist = this.computeDistance(liveDescriptor, stored);
        return { fotografia: foto, distance: dist };
      })
      .filter((m) => m.distance <= threshold)
      .sort((a, b) => a.distance - b.distance);
    return matches;
  }
}
