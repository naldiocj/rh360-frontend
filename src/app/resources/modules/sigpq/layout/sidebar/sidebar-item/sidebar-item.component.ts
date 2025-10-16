import { Component, Input } from '@angular/core';
import { MenuStore } from '@core/services/store/modules/menu.state';

@Component({
  selector: 'app-sidebar-item',
  styles: [
    `
      .slide.is-expanded .side-menu__label,
      .sub-slide.is-expanded .sub-side-menu__item {
        color: var(--text-anchor-color) !important;
      }

      .slide.is-expanded .side-menu__label:hover {
        color: var(--primary-color) !important;
      }

      .active,
      .side-menu__item.active .side-menu__label,
      .side-menu__item.active .side-menu__icon,
      .sub-slide.is-expanded .sub-side-menu__item.active {
        color: var(--text-active-anchor-color) !important;
      }

      .slide .side-menu__item.active::before {
        background-color: var(--text-active-anchor-color) !important;
      }

      .side-menu__icon {
        /* line-height: 1 !important; */
        height: 100%;
      }
    `,
  ],
  templateUrl: './sidebar-item.component.html',
})
export class SideItemComponent {
  @Input('item') item?: MenuStore;
  @Input('index') index: number = 1;
  @Input('sub-slide') subSlide: boolean = false;

  iconFontSize: string = '16px';
}
