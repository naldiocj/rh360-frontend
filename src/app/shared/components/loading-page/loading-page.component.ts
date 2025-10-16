import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent implements OnInit {
  @Input() texto: string = '';

    constructor() { }

    ngOnInit() {
    }
}
