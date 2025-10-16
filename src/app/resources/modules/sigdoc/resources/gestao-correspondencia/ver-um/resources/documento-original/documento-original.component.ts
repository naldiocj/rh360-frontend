import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-documento-original',
  templateUrl: './documento-original.component.html',
  styleUrls: ['./documento-original.component.css'],
})
export class DocumentoOriginalComponent implements OnInit, OnChanges {
  @Input() correspondenciaId: any;
  public documento: any;
  public isLoading: boolean = false;
  public fileUrl: any

  constructor(
    private correspondenciaService: CorrespondenciaService,
    private ficheiroService: FicheiroService,
    utilService: UtilService
  ) { }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['correspondenciaId'].previousValue !=
      changes['correspondenciaId'].currentValue
    ) {
      this.buscarCorrrespondencia();
    }
  }

  private buscarCorrrespondencia() {
    this.correspondenciaService.listarUm(this.getId).pipe(
      finalize((): void => {
        this.verFicheiro(this.documento?.anexo);
      })
    ).subscribe({
      next: (response: any) => {
        this.documento = response
      }
    })
  }

  private verFicheiro(urlAgente: any): boolean | void {

    const opcoes = {
      pessoaId: this.documento?.rementente_id,
      url: urlAgente,
    };

    this.isLoading = true;

    this.ficheiroService
      .getFileStore(opcoes)
      .pipe(
        finalize(() => {
          this.isLoading = false;
     
        })
      )
      .subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });
  }
  public get getId() {
    return this.correspondenciaId;
  }


}
