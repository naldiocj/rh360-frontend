import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject } from 'rxjs';

interface Delituoso {
  id: number;
  nome: string;
  foto: string;
  datanascimento: string;
}
interface Grupo {
  id: number;
  nome: string;
  datacriada: string;
  provincia: string;
}

@Injectable({
  providedIn: 'root',
})
export class DelituosoService {
  private delituosoData = {
    delituosos: [] as Delituoso[],
    total: 0,
  };

  private grupoData = {
    grupos: [] as Grupo[],
    total: 0,
  };

    delituosoDataObs$ = new BehaviorSubject(this.delituosoData);
    grupoDataObs$ = new BehaviorSubject(this.grupoData);

  constructor(private _api: ApiService) {
    const localDelituosoData = JSON.parse(localStorage.getItem('delituoso') || 'null');
    if (localDelituosoData) this.delituosoData = localDelituosoData;

    this.delituosoDataObs$.next(this.delituosoData);

    //Grupos

    const localGrupoData = JSON.parse(localStorage.getItem('grupo') || 'null');
    if (localGrupoData) this.delituosoData = localGrupoData;

    this.delituosoDataObs$.next(this.delituosoData);
  }



  addDelituoso(params: Delituoso): void {
    const { id, nome, foto, datanascimento } = params;
    const delituoso = { id, nome, foto, datanascimento };

    if (!this.isDelituosoInList(id)) {
      this.delituosoData.delituosos.push(delituoso);
    } else {
      const updatedDelituosos = [...this.delituosoData.delituosos];
      const delituosoIndex = updatedDelituosos.findIndex((d) => d.id === id);
      updatedDelituosos[delituosoIndex] = { ...delituoso };
      this.delituosoData.delituosos = updatedDelituosos;
    }

    this.delituosoData.total = this.getDelituosoTotal();
    this.delituosoDataObs$.next({ ...this.delituosoData });
    localStorage.setItem('delituoso', JSON.stringify(this.delituosoData));
  }

  updateDelituoso(id: number, updatedData: Partial<Delituoso>): void {
    const updatedDelituosos = [...this.delituosoData.delituosos];
    const delituosoIndex = updatedDelituosos.findIndex((d) => d.id === id);

    if (delituosoIndex !== -1) {
      updatedDelituosos[delituosoIndex] = {
        ...updatedDelituosos[delituosoIndex],
        ...updatedData,
      };

      this.delituosoData.delituosos = updatedDelituosos;
      this.delituosoData.total = this.getDelituosoTotal();
      this.delituosoDataObs$.next({ ...this.delituosoData });
      localStorage.setItem('delituoso', JSON.stringify(this.delituosoData));
    }
  }

  removeDelituoso(id: number): void {
    const updatedDelituosos = this.delituosoData.delituosos.filter((d) => d.id !== id);
    this.delituosoData.delituosos = updatedDelituosos;
    this.delituosoData.total = this.getDelituosoTotal();
    this.delituosoDataObs$.next({ ...this.delituosoData });
    localStorage.setItem('delituoso', JSON.stringify(this.delituosoData));
  }

  clearDelituoso(): void {
    this.delituosoData = {
      delituosos: [],
      total: 0,
    };
    this.delituosoDataObs$.next({ ...this.delituosoData });
    localStorage.setItem('delituoso', JSON.stringify(this.delituosoData));
  }

  getDelituosoTotal(): number {
    return this.delituosoData.delituosos.length;
  }

  isDelituosoInList(id: number): boolean {
    return this.delituosoData.delituosos.some((d) => d.id === id);
  }


  // Grupos


  addGrupo(params: Grupo): void {
    const { id, nome, datacriada, provincia } = params;
    const grupo = {id, nome, datacriada, provincia };

    if (!this.isDelituosoInList(id)) {
      this.grupoData.grupos.push(grupo);
    } else {
      const updatedGrupos = [...this.grupoData.grupos];
      const delituosoIndex = updatedGrupos.findIndex((d) => d.id === id);
      updatedGrupos[delituosoIndex] = { ...grupo };
      this.grupoData.grupos = updatedGrupos;
    }

    this.grupoData.total = this.getDelituosoTotal();
    this.grupoDataObs$.next({ ...this.grupoData });
    localStorage.setItem('grupo', JSON.stringify(this.grupoData));
  }

  updateGrupo(id: number, updatedData: Partial<Grupo>): void {
    const updatedGrupos = [...this.grupoData.grupos];
    const grupoIndex = updatedGrupos.findIndex((d) => d.id === id);

    if (grupoIndex !== -1) {
      updatedGrupos[grupoIndex] = {
        ...updatedGrupos[grupoIndex],
        ...updatedData,
      };

      this.grupoData.grupos = updatedGrupos;
      this.grupoData.total = this.getDelituosoTotal();
      this.grupoDataObs$.next({ ...this.grupoData });
      localStorage.setItem('grupo', JSON.stringify(this.grupoData));
    }
  }

  removeGrupo(id: number): void {
    const updatedDelituosos = this.grupoData.grupos.filter((d) => d.id !== id);
    this.grupoData.grupos = updatedDelituosos;
    this.grupoData.total = this.getDelituosoTotal();
    this.grupoDataObs$.next({ ...this.grupoData });
    localStorage.setItem('grupo', JSON.stringify(this.grupoData));
  }

  clearGrupo(): void {
    this.grupoData = {
      grupos: [],
      total: 0,
    };
    this.grupoDataObs$.next({ ...this.grupoData });
    localStorage.setItem('grupo', JSON.stringify(this.grupoData));
  }

  getGrupoTotal(): number {
    return this.grupoData.grupos.length;
  }

  isGrupoInList(id: number): boolean {
    return this.grupoData.grupos.some((d) => d.id === id);
  }
}
