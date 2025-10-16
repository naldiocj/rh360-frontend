import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../../shared/model/breadcumb.model';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const breadcrumbs = this.createBreadcrumbs(this.router.routerState.root);
      this.breadcrumbs$.next(breadcrumbs);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const data = child.snapshot.data;
      
      if (data['breadcrumb']) {
        const newBreadcrumb: Breadcrumb = {
          label: data['breadcrumb'],
          url: url,
          icon: data['icon'],
          parent: data['parent'],
          isHome: data['isHome']
        };

        // Verifica se já existe um breadcrumb com a mesma URL
        const existingIndex = breadcrumbs.findIndex(b => b.url === url);
        
        if (existingIndex === -1) {
          breadcrumbs.push(newBreadcrumb);
        } else {
          // Atualiza o breadcrumb existente se necessário
          breadcrumbs[existingIndex] = newBreadcrumb;
        }
      }

      // Processa rotas filhas
      this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  getBreadcrumbs() {
    return this.breadcrumbs$.asObservable();
  }
}