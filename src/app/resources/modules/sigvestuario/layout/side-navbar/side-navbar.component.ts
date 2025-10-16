import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sigvest-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  flag = false;
  constructor() { }

  ngOnInit(): void {
    $(function () { $('[data-toggle="tooltip"]'); });
  }

  toggleGirarIcon_nmg() {

  }

  public callSideNavBar(): void {
    let sidenav : HTMLElement | any = document.querySelector('#sigvest-le');
    let main : HTMLElement | any = document.querySelector('#sigvest-lr');
    let textoJuntoAoIcones: HTMLElement | any = document.querySelectorAll('.nmg-hide-text')

    /* sidenav.style.transition = "all .5s ease-in"; 
    main.style.transition = "all .5s ease-in";
    sidenav.style.width = '17%';
    main.style.width = '83%'; */

    /* textoJuntoAoIcones.forEach((element: any) => {
      element.style.display = "block";
    }) */
    
    if (this.flag){
    }
  }

  public hideSideNavBar(): void {
    let sidenav : HTMLElement | any = document.querySelector('#sigvest-le');
    let main : HTMLElement | any = document.querySelector('#sigvest-lr');
    let textoJuntoAoIcones: HTMLElement | any = document.querySelectorAll('.nmg-hide-text')


    /* sidenav.style.transition = "all .5s ease-out";
    main.style.transition = "all .5s ease-out";
    sidenav.style.width = '5%';
    main.style.width = '95%'; */
    
    /* textoJuntoAoIcones.forEach((element: any) => {
      element.style.display = "none";
    }) */

    if (this.flag){
    }
  }
}
