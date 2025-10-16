import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelpserviceService {
  constructor() {}

  public recarregarPagina() {
    return () => {
      setInterval(() => {
        location.reload();
      }, 3000);
    };
  }

  public recarregarPaginaComStatus() {
    return () => {
      // setInterval(() => {
      //   location.reload();
      // }, 3000);
      // console.log("reloaded")
    };
  }
}
