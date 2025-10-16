import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sigpj-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

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
