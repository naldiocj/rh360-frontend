import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize, Subject, Subscriber, takeUntil } from 'rxjs';

@Component({
  selector: 'ver-pdf-orgao',
  templateUrl: './pdf-orgao-arequivo.component.html',
  styleUrls: ['./pdf-orgao-arequivo.component.css']
})
export class PdfOrgaoArequivoComponent implements OnChanges, OnDestroy {

  @Input() public fileUrl: any = null

  @Input() public fileId: any = null

  public documento: any = null

  public carregarDocumento: boolean = false

  private destroy$ = new Subject<void>()


  constructor(private ficheiroService: FicheiroService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileUrl'].currentValue !== changes['fileUrl'].previousValue && this.fileId !== null) {
      this.visualizar();
    }
  }

  public visualizar() {

    if(!this.fileUrl || !this.fileId) return

    this.carregarDocumento =  true

    console.log(this.fileUrl)
    console.log(this.fileId)
    const opcoes = {
      pessoaId: this.fileId,
      url: this.fileUrl,
    };

    this.ficheiroService.getFileStore(opcoes).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.carregarDocumento = false;
    
      })
    ).subscribe((file: any) => {
      this.documento = this.ficheiroService.createImageBlob(file)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
