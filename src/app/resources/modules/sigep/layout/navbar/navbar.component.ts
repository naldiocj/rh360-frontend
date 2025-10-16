import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sigop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuActive:string = "dashboard";

  constructor() { }

  ngOnInit(): void {
    // setTimeout(() => {
      // @ts-ignore
      window.initSlideMenu();
    // }, 200);
  }
  onRouterLinkActive(event:any){
    console.log(event);
    this.menuActive = event;
    
  }

}
