import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ficha-completa',
  templateUrl: './ficha-completa.component.html',
  styleUrls: ['./ficha-completa.component.css']
})
export class FichaCompletaComponent implements OnChanges {

  @Input() funcionario: any

  public fileUrl: any

  public ordens: any = []

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['funcionario'].previousValue != changes['funcionario'].currentValue) {
      this.verFoto(this.funcionario.foto_efectivo)
    }
  }

  constructor(private ficheiroService: FicheiroService) { }

  ngOnInit(): void {
  }

  private verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

  }



  public get getPessoaId() {
    return this.funcionario?.id
  }
}
