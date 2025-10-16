import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor() {}

  public editar(
    data: FormGroup,
    index: any,
    object: any,
  ): void {
    object.actualizar(data).subscribe({
      next: () => {},
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  public registar(data: FormGroup, object: any, serviceType: any): void {
    object.registar(data).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  public AnyType(data: FormGroup, object: any, serviceType: any): void {
    object.serviceType(data).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  public eliminar(data: number, object: any, serviceType: any): void {
    object.eliminar(data).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  public listar(object: any, serviceType: any): void {
    object.listar({}).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  
  public filtrar(object: any): void {
    object.filtrar({}).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }

  public VerUm(index: number, object: any, serviceType: any): void {
    object.um(index).subscribe({
      next: () => {
        console.log('\u001b[0,32m sucesso ao executar a accao');

        return null;
      },
      error: () => {
        console.error('\u001b[0,31m erro ao executar a accao');
      },
    });
  }
}
