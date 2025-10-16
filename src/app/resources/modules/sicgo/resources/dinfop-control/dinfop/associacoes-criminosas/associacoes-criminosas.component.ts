import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-associacoes-criminosas',
  templateUrl: './associacoes-criminosas.component.html',
  styleUrls: ['./associacoes-criminosas.component.css']
})
export class AssociacoesCriminosasComponent implements OnInit {
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    const links = this.navigationMenu.nativeElement.querySelectorAll('a');

    // Adicionando evento de clique a todos os links
    links.forEach((link: HTMLElement) => {
      this.renderer.listen(link, 'click', (event: Event) => {
        event.preventDefault(); // Previne a navegação padrão

        // Remove a classe 'active' de todos os itens
        links.forEach((lnk: HTMLElement) =>
          this.renderer.removeClass(lnk.parentElement, 'active')
        );

        // Adiciona a classe 'active' ao item clicado
        this.renderer.addClass(link.parentElement, 'active');
      });
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
