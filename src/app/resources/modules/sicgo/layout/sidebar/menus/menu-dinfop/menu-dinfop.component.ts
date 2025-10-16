import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { NotificacaoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/notificacao/notificacao.service';
import { finalize } from 'rxjs';



interface MenuItem {
  label: string;
  selected?: boolean;
  url: string;
  icon?: string;
  numero?: number;
  role?: string[];
  permissions?: string[];
  submenu?: MenuItem[];
  isOpen?: boolean; // Adicionamos esta propriedade para controlar o estado
}


@Component({
  selector: 'app-sicgo-menu-dinfop',
  templateUrl: './menu-dinfop.component.html',
  styleUrls: ['./menu-dinfop.component.css']
})
export class MenuDinfopComponent implements OnInit {
notifica: any[] = [];
  isLoading: boolean = false;
  menuOptions: MenuItem[] = [];
  public delituoso: any;
@Input() collapsed = true;


  private baseMenu: MenuItem[] = [
    {
      label: 'PEDIDOS',
      selected: false,
      url: '/piips/sicgo/dinfop/pedidos',
      icon: 'bi bi-file-earmark-text',
      numero: this.notifica.length,
      role: ['admin'],
      submenu: [
        {
          label: 'Novos Pedidos',
          url: '/piips/sicgo/dinfop/pedidos/novos',
          icon: 'bi bi-plus-circle',
          role: ['admin'],
          permissions: ['informante-create'] // Requer permissão específica
        },
        {
          label: 'Pedidos Pendentes',
          url: '/piips/sicgo/dinfop/pedidos',
          icon: 'bi bi-clock',
          role: ['admin']
        }
      ]
    },
    {
      label: 'DESPACHO',
      selected: false,
      url: '/piips/sicgo/dinfop/expedientes',
      icon: 'bi bi-file-earmark-text',
      role: ['admin'],
      submenu: [
        {
          label: 'Despachos Recentes',
          url: '/piips/sicgo/dinfop/expedientes/recentes',
          icon: 'bi bi-arrow-clockwise',
          role: ['admin']
        },
        {
          label: 'Arquivados',
          url: '/piips/sicgo/dinfop/expedientes/arquivados',
          icon: 'bi bi-archive',
          role: ['admin']
        }
      ]
    },
    {
      label: 'Informantes',
      selected: false,
      url: '#',
      icon: 'bi bi-file-earmark-text',
      role: ['admin', 'operador'],
      submenu: [
        {
          label: 'Registar',
          url: '/piips/sicgo/dinfop/informantes/novo',
          icon: 'bi bi-person-plus',
          role: ['admin', 'operador']
        },
        {
          label: 'Lista',
          url: '/piips/sicgo/dinfop/informantes',
          icon: 'bi bi-person-lines-fill',
          role: ['admin', 'operador']
        },
        {
          label: 'Ativos',
          url: '/piips/sicgo/dinfop/informantes/ativos',
          icon: 'bi bi-person-check',
          role: ['admin', 'operador']
        },
        {
          label: 'Inativos',
          url: '/piips/sicgo/dinfop/informantes/inativos',
          icon: 'bi bi-person-x',
          role: ['admin'] // Only admin can see inactive informants
        }
      ]
    },
    {
      label: 'Delituosos',
      selected: false,
      url: '/piips/sicgo/dinfop/delituosos',
      icon: 'bi bi-person-lock',
      role: ['admin', 'operador'],
      permissions: ['expediente-update'],
      submenu: [
        {
          label: 'Registros Ativos',
          url: '/piips/sicgo/dinfop/delituosos/ativos',
          icon: 'bi bi-exclamation-triangle',
          role: ['admin'],
          permissions: ['expediente-update']
        },
        {
          label: 'Histórico',
          url: '/piips/sicgo/dinfop/delituosos/historico',
          icon: 'bi bi-clock-history',
          role: ['admin'],
          permissions: ['expediente-update']
        }
      ]
    }
  ];

  constructor(
    public authService: AuthService,
    private notificacaoService: NotificacaoService) { }


  ngOnInit() {
    this.Notifica()

  }

  get role(): string {
    return this.authService.role?.name?.toLowerCase() || '';
  }

  get permissions(): string[] {
    return this.authService.permissions || [];
  }

  Notifica() {
    this.isLoading = true;
    this.notificacaoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.notifica = response;
          this.updateMenuOptions();
        },
        error: (err) => console.error('Erro ao carregar notificações:', err)
      });
  }


  private canShowItem(item: MenuItem): boolean {
    // Se não tem restrições de role ou permission, mostra para todos
    if (!item.role && !item.permissions) return true;
    
    // Verifica role
    if (item.role && !item.role.includes(this.role)) return false;
    
    // Verifica permissions (todas as permissions listadas devem estar presentes)
    if (item.permissions && !item.permissions.every(p => this.permissions.includes(p))) {
      return false;
    }
    
    return true;
  }

  private filterMenuByAccess(menu: MenuItem[]): MenuItem[] {
    return menu
      .filter(item => this.canShowItem(item)) // Filtra itens principais
      .map(item => {
        // Filtra subitens se existirem
        if (item.submenu) {
          return {
            ...item,
            submenu: this.filterMenuByAccess(item.submenu) // Recursão para submenus
          };
        }
        return item;
      })
      .filter(item => {
        // Remove itens principais que ficaram sem subitens (e não tem URL própria)
        if (item.submenu && item.submenu.length === 0 && item.url === '#') {
          return false;
        }
        return true;
      });
  }

  private updateMenuOptions() {
    // 1. Cria cópia do menu base
    this.menuOptions = JSON.parse(JSON.stringify(this.baseMenu));
    
    // 2. Atualiza dados dinâmicos (como notificações)
    this.updateDynamicData();
    
    // 3. Filtra por acesso
    this.menuOptions = this.filterMenuByAccess(this.menuOptions);
  }

  private updateDynamicData() {
    const pedidosItem = this.menuOptions.find(item => item.label === 'PEDIDOS');
    if (pedidosItem) {
      pedidosItem.numero = this.notifica.length;
    }
  }

  private hasPermission(item: MenuItem): boolean {
    // Verifica role
    if (item.role && !item.role.includes(this.role)) return false;
    
    // Verifica permissões
    if (item.permissions && !item.permissions.every(p => this.permissions.includes(p))) return false;
    
    return true;
  }

  private filterSubmenu(item: MenuItem): MenuItem {
    if (!item.submenu) return item;
    
    return {
      ...item,
      submenu: item.submenu
        .filter(subItem => this.hasPermission(subItem))
        .map(subItem => this.filterSubmenu(subItem))
    };
  }

  toggleSubmenu(tab: MenuItem, event: Event): void {
    if (tab.submenu?.length) {
      event.preventDefault();
      event.stopPropagation();
      tab.isOpen = !tab.isOpen;
    }
  }


  closeOtherMenus(currentTab: MenuItem) {
    this.menuOptions.forEach(item => {
      if (item !== currentTab) {
        item.isOpen = false;
      }
    });
  }

  get filteredMenuOptions() {
    return this.menuOptions.filter(option => {
      // Filter main menu items
      if (option.role && !option.role.includes(this.role)) {
        return false;
      }

      // Filter submenu items if they exist
      if (option.submenu) {
        option.submenu = option.submenu.filter(subItem => {
          if (subItem.role && !subItem.role.includes(this.role)) {
            return false;
          }
          // Uncomment if using permissions
          // if (subItem.permissions && !this.hasPermission(subItem.permissions)) {
          //   return false;
          // }
          return true;
        });

        // Hide parent if no subitems remain (optional)
        // if (option.submenu.length === 0) {
        //   return false;
        // }
      }

      return true;
    });
  }
 
}
