import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';


import { finalize } from 'rxjs';

@Component({
  selector: 'pa-zoom-foto',
  templateUrl: './zoom-foto.component.html',
  styleUrls: ['./zoom-foto.component.css']
})
export class ZoomFotoComponent implements OnInit, OnChanges {

  @Input() pessoa: any
  public isLoading: boolean = false;
  @Output() public onSair: EventEmitter<any>
  @Input() isEfectivo: boolean = false

  public fileUrl: any = null
  constructor(private ficheiroService: FicheiroService) {
    this.onSair = new EventEmitter<any>()
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pessoa']?.previousValue != changes['pessoa']?.currentValue && this.pessoa != null) {

      if (this.isEfectivo) {
        this.verFoto(this.pessoa?.foto_efectivo)
      } else {
        this.verFoto(this.pessoa?.foto_civil)
      }

    }
  }

  private verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    console.log(opcoes)

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
        this.showImage()
        console.log(this.fileUrl)
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }


  public get getPessoaId() {
    return this.pessoa?.id
  }

  private showImage() {
    if (this.fileUrl) {
      const paModal: HTMLDivElement = document.querySelector('#pa-modal') as HTMLDivElement
      if (paModal) {
        paModal.style.display = 'flex'
        paModal.style.transition = 'all .6s'
        document.body.style.overflow = "hidden";

      }
    }
  }

  public fechar() {
    // if (this.fileUrl) {
      const paModal: HTMLDivElement = document.querySelector('#pa-modal') as HTMLDivElement
      if (paModal) {
        paModal.style.display = 'none'
        document.body.style.overflowY = "scroll";

      // }

      this.onSair.emit({ sair: true })
    }
  }
}
