import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pa-folha-pdf',
  templateUrl: './folha-pdf.component.html',
  styleUrls: ['./folha-pdf.component.css']
})
export class FolhaPdfComponent implements  OnChanges {

  @Input() public imprimir: boolean = false
  @Input() public conteudo: any

  public podeImprimir: boolean = false


  ngOnChanges(changes: SimpleChanges): void {
    if (this.imprimir == true) {
      this.podeImprimir = true
      setTimeout(() => {
        this.imprima()

      }, 300)
    } else {
      this.podeImprimir = false;
    }
  }


  public imprima() {
    const documento: HTMLDivElement = <HTMLDivElement>document.querySelector('#wrapper-pdf')

    if (documento) {
      document.body.innerHTML = documento.outerHTML
      window.print()
      window.location.reload()
    } else {
      this.podeImprimir = false;
    }
  }



}
