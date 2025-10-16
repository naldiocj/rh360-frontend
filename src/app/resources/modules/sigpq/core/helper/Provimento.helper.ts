import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export default class ProvimentoHelper {
  public static buscarClasseSuperior(efectivos: any[]) {
    return efectivos.find(
      (item) => item.patente_classe <= 8 && item.patente_classe >= 7
    );
  }
  public static buscarPatentEfectivos(efectivos: any[]) {
    return efectivos.find(
      (item) => item.patente_classe <= 8 && item.patente_classe >= 7
    );
  }

  public static buscarPatentesValidaPorPatente(
    efectivos: any[],
    patentes: any[]
  ) {
    const patentesEfectivos = efectivos.map((item) => item.patente_id);

    return patentes.filter((item) => patentesEfectivos.includes(item?.id));
  }

  public static buscarPatentesValidaPorClasses(
    efectivos: any[],
    patentes: any[]
  ) {
    const classesEfectivos = efectivos.map((item) => item.patente_classe);

    return patentes.filter((item) => classesEfectivos.includes(item?.id));
  }

  public static ordemPatente(patentes: any[], ascender: boolean = true) {
    if (!(patentes instanceof Array)) return [];
    if (ascender) {
      return patentes.sort((a: any, b: any) => a.id - b.id);
    } else {
      return patentes.sort((a: any, b: any) => b.id - a.id);
    }
  }

  public static patenteSeguinte(patentes: any[], patentesOrdena: any[]) {
    return patentes.find(
      (item) => item.id == String(Number(patentesOrdena[0].id) - 1)
    );
  }

  public static patenteAnterior(patentes: any[], patentesOrdena: any[]) {
    return patentes.find(
      (item) => item.id == String(Number(patentesOrdena[0].id) + 1)
    );
  }
}
