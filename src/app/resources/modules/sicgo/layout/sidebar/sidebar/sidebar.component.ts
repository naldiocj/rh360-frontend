import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';

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
  selector: 'sicgo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('blob', { static: true }) blob!: ElementRef;
  @ViewChild('blobPath', { static: true }) blobPath!: ElementRef;
  @ViewChild('hamburger', { static: true }) hamburger!: ElementRef;
  @Output() toSidebar = new EventEmitter<boolean>();
  
  @Input() collapsed = true; // Define se a classe será aplicada
  menuActive: string = "dashboard";
  height = window.innerHeight;
  x = 0;
  y = this.height / 2;
  curveX = 10;
  curveY = 0;
  targetX = 0;
  xitteration = 0;
  yitteration = 0;
  menuExpanded = true;
  toggleSidebar() {
    this.collapsed = true;  
    this.toSidebar.emit(this.collapsed);
    const contentEl = document.querySelector('#content') as HTMLElement;
    const sidebarEl = document.querySelector('#sidebar') as HTMLElement;
  
    if (!sidebarEl || !contentEl) return;
  
    sidebarEl.classList.toggle('collapsed', this.collapsed);
    contentEl.classList.toggle('collapsed', this.collapsed);
    contentEl.classList.toggle('blurred', !this.collapsed);
  }
  
 
  constructor(
    private router: Router,
    public authService: AuthService
  ) { this.router.events.subscribe(() => {
    this.toggleSidebar(); // Fecha o sidebar quando a navegação acontece
  });}

  ngOnInit(): void {
this.svgCurve();
    document.body.classList.remove('mini-sidebar');
    // @ts-ignore
    window.initSlideMenu();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.collapsed = true;
    }, 0);
  }
  
  onRouterLinkActive(event: any) {
    this.menuActive = event;
  }

   get role() {
    
    return this.authService?.role?.name?.toString().toLowerCase()
  }
  public get isAdmin() {
    return ['admin', 'root'].includes(this.role)
  }

  menuOptions: MenuItem[] = [];
  public delituoso: any;


 

  menuItems: MenuItem[] = [
    {
      label: 'Piquetes',
      // selected: false,
      url: '/piips/sicgo/piquete',
      icon: 'bi-broadcast-pin',
      role: ['admin', 'operador'],
      // numero: 0, // pode ser undefined também
      // submenu: [
      //   {
      //     label: 'Visão Geral',
      //     url: '/modulo/principal/visao',
      //     icon: 'bi bi-eye',
      //     role: ['admin']
      //   },
      //   {
      //     label: 'Estatísticas',
      //     url: '/modulo/principal/estatisticas',
      //     icon: 'bi bi-graph-up',
      //     role: ['admin', 'operador']
      //   }
      // ]
    }, 
    { label: 'Mapas de eventos', url: '/piips/sicgo/mapas', icon: 'bi-map' },
    { 
      label: 'Relatórios', 
      url: '/piips/sicgo/piquete/relatorio',
      icon: 'bi bi-file-earmark-pdf',
      selected: false, 
      submenu: [
        {
          label: 'Relatorio Estatísticas',
          url: '/piips/sicgo/piquete/relatorio',
          icon: 'bi bi-graph-up',
          role: ['admin', 'operador'], 
        },
        {
          label: 'Relatorio diario',
          url: '/piips/sicgo/piquete/relatorio',
          icon: 'bi bi-list-ul',
          role: ['admin']
        }
      ] },
    {
      label: 'Intervenientes',   
      url: '/piips/sicgo/piquete/interveniente',
      icon: 'bi bi-people',  
    }
  ];
  
  currentUser = {
    role: 'admin', // ou 'operador'
    permissions: ['user-create', 'user-view']
  };
  
  toggleSubmenu(tab: MenuItem, event: Event): void {
    if (tab.submenu?.length) {
      event.preventDefault();
      event.stopPropagation();
      tab.isOpen = !tab.isOpen;
    }
  }
  hasPermission(permission: string): boolean {
    return this.authService?.isPermission(permission);
  }

  // private hasPermission(item: MenuItem): boolean {
  //   // Verifica role
  //   if (item.role && !item.role.includes(this.role)) return false;
    
  //   // Verifica permissões
  //   if (item.permissions && !item.permissions.every(p => this.permissions.includes(p))) return false;
    
  //   return true;
  // }
  hasAccess(item: any): boolean {
    const userRole = this.authService?.role?.name?.toString().toLowerCase(); // ex: 'admin'
    const userPermissions = this.authService.permissions(); // ex: ['informante-create', 'user-create']
  
    if (item.role && !item.role.includes(userRole)) {
      return false;
    }
  
    if (item.permissions) {
      return item.permissions.every((p: string) => userPermissions.includes(p));
    }
  
    return true;
  }
  
 

@HostListener('window:mousemove', ['$event'])
onMouseMove(event: MouseEvent): void {
  this.x = event.pageX;
  this.y = event.pageY;
}

onMouseEnter(): void {
  this.menuExpanded = true;
}

onMouseLeave(): void {
  this.menuExpanded = false;
}

easeOutExpo(currentIteration: number, startValue: number, changeInValue: number, totalIterations: number): number {
  return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
}

svgCurve(): void {
  const hoverZone = 150;
  const expandAmount = 20;
  const height = this.height;
  const animate = () => {
    if ((this.curveX > this.x - 1) && (this.curveX < this.x + 1)) {
      this.xitteration = 0;
    } else {
      if (this.menuExpanded) {
        this.targetX = 0;
      } else {
        this.xitteration = 0;
        if (this.x > hoverZone) {
          this.targetX = 0;
        } else {
          this.targetX = -(((60 + expandAmount) / 100) * (this.x - hoverZone));
        }
      }
      this.xitteration++;
    }

    if ((this.curveY > this.y - 1) && (this.curveY < this.y + 1)) {
      this.yitteration = 0;
    } else {
      this.yitteration = 0;
      this.yitteration++;
    }

    this.curveX = this.easeOutExpo(this.xitteration, this.curveX, this.targetX - this.curveX, 100);
    this.curveY = this.easeOutExpo(this.yitteration, this.curveY, this.y - this.curveY, 100);

    const anchorDistance = 200;
    const curviness = anchorDistance - 40;

    const newCurve2 = `M60,${height}H0V0h60v${(this.curveY - anchorDistance)}c0,${curviness},${this.curveX},${curviness},${this.curveX},${anchorDistance}S60,${(this.curveY)},60,${(this.curveY + (anchorDistance * 2))}V${height}z`;

    this.blobPath.nativeElement.setAttribute('d', newCurve2);
    this.blob.nativeElement.style.width = `${this.curveX + 60}px`;

    if (this.hamburger.nativeElement) {
      this.hamburger.nativeElement.style.transform = `translate(${this.curveX}px, ${this.curveY}px)`;
    }
    
    const h2 = document.querySelector('h2');
    if (h2) {
      h2.style.transform = `translateY(${this.curveY}px)`;
    }

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
}
}