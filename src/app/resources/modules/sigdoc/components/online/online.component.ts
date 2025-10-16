import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent {

  @ViewChild('btnLogout', { static: false }) btnLogout!: ElementRef;
  @Input() image!: string;
  @Input() username!: string;
  @Output() emitLogout!: EventEmitter<any>;

  btnLogoutElement!: HTMLElement;

  constructor() {
    this.emitLogout = new EventEmitter<any>();
  }

  ngAfterViewInit() {
    this.btnLogoutElement = this.btnLogout.nativeElement;

    this.btnLogoutElement.addEventListener('click', () => {
      this.emitLogout.emit({});
    });
  }

  public toggleChevron = (event: any) => {
    const toggleUser = document.querySelector('.btn-toggle-user');
    if (toggleUser) {
      const icon = toggleUser.querySelector('.bx');
      if (icon) {
        icon.classList.toggle('rotate');
      }
    }
  };

}
