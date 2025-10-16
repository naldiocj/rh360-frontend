import { finalize } from 'rxjs';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';

@Component({
  selector: 'app-pa-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnChanges {

  @Input() public tratamento: any
  @Input() public funcionario: any
  @Input() public pessoaId: any

  public fileUrl: any

  constructor(private ficheiroService: FicheiroService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tratamento']?.currentValue != changes['tratamento']?.previousValue) {
      if (this.tratamento?.documento != null) {
        this.verArquivo(this.tratamento?.documento)
      }
    }
  }

  public verArquivo(url: any) {

    const opcoes: any = {
      pessoaId: this.getPessoaId,
      url: url
    }
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {

      })
    ).subscribe((file: any) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);

    });

  }
  private get getPessoaId() {
    return this.pessoaId
  }

}
