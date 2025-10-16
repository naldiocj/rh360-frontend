import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { UtilsHelper } from '../core/Utils.helper';
// import { ActionsService } from '@core/services/actions.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('asidebar', { static: false }) asidebarContainer!: ElementRef;
  @ViewChild('mainContainer', { static: false }) mainContainer!: ElementRef;
  @ViewChild('btnToggleContainer', { static: false })
  btnToggleContainer!: ElementRef;

  asidebarContainerElement!: HTMLElement;
  mainContainerElement!: HTMLElement;
  btnToggleContainerElement!: HTMLElement;

  constructor(
    private utilHelper: UtilsHelper,
    private authService: AuthService,
    private secureService: SecureService
  ) {}
  get username() {
    return this.secureService.getTokenValueDecode().user.email;
  }
  ngAfterViewInit(): void {
    this.btnToggleContainerElement = this.btnToggleContainer.nativeElement;
    this.asidebarContainerElement = this.asidebarContainer.nativeElement;
    this.mainContainerElement = this.mainContainer.nativeElement;
    this.btnToggleContainerElement.addEventListener('click', () => {
      this.utilHelper.toogleContainer(
        this.asidebarContainerElement,
        this.mainContainerElement
      );
    });
  }
  ngOnInit(): void {}
  onLogout() {
    // this.authService.signout();
  }

  sair() {
    this.authService.logout();
  }

}
