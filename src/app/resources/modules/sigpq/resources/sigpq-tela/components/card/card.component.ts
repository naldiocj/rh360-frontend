import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() item: any = null

  ngOnInit(): void {
  }

  redicionar(item: any) {
    if (item.link) {
      if (item?.domain) {
        this.router.navigate([item?.link]);
      } else {
        window.location = item.link
      }
    }
  }

}
