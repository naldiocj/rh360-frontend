import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DelituosoDataService {
  private users: any[] = [];  // Armazena os dados de utilizadores

  constructor() {}

  // Método para definir (enviar) os utilizadores
  setUsers(users: any[]): void {
    this.users = users;
  }

  // Método para obter (receber) os utilizadores
  getUsers(): any[] {
    return this.users;
  }
}