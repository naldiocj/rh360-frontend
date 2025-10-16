import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PartilhaDadosService{
  private data: any[] = [];  // Armazena os dados de utilizadores

   

  // Método para definir (enviar) os utilizadores
  setUsers(users: any[]): void {
    this.data = users;
  }

  // Método para obter (receber) os utilizadores
  getUsers(): any[] {
    return this.data;
  }
}