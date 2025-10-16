import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sigop-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

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
