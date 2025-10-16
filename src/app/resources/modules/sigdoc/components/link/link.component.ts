import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() content!:string
  @Input() link!:string
  @Input() icon!:string

  @Input() count!:string
  constructor() { }

  ngOnInit(): void {
  }

}
