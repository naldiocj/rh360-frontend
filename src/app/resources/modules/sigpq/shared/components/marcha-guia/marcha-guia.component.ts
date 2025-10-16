import { Component, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';

@Component({
  selector: 'sigpq-marcha-guia',
  templateUrl: './marcha-guia.component.html',
  styleUrls: ['./marcha-guia.component.css']
})
export class MarchaGuiaComponent implements OnInit {

  constructor(private ficheiroService: FicheiroService) { }

  ngOnInit(): void {
  }


  public async imprimir(idElement: any) {

    await this.ficheiroService.imprimir(idElement)
  }
  public async download(idElement: any) {

    await this.ficheiroService.download_(idElement)
  }

}
