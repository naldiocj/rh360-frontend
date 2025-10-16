import { Injectable } from '@angular/core';
import { SidebarItem } from '../../shared/model/sidebar.model';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  getMenuItems(): SidebarItem[] {
    // Aqui, você pode também buscar os itens de uma API.
    return [
      { title: 'Painel Controlo', icon: 'fa-dashboard', link: ['/piips/sigpg/dashboard'] },
      // ... Outros itens
    ];
  }
}
