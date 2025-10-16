import { Component, Input, OnInit } from '@angular/core';
import { RelatorioLicencaService } from '../../../core/service/Relatorio-licenca.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-dados-clinicos',
  templateUrl: './dados-clinicos.component.html',
  styleUrls: ['./dados-clinicos.component.css']
})
export class DadosClinicosComponent implements OnInit {

  @Input() public pessoaId: any = 5
  carregando:boolean=false
  constructor(
      private relatorioService: RelatorioLicencaService) { }

  ngOnInit() {
  }

  public get getPessoaId(): number {
    return this.pessoaId as number;
  }

  fileUrl: any = null
   visualizarDocumento()
     {
      this.carregando=true
        this.showModal('modalGerarModeloGuiaMedica')
        const options = {
          pessoafisica_id: this.getPessoaId
        }
        this.relatorioService.gerarModeloClinico(options)
              .pipe(
                first(),
                finalize(() => {
                  this.carregando = false;
                })
              ).subscribe((response:any) => {
                this.fileUrl = this.relatorioService.createImageBlob(response);
              });
     }

     showModal(modalName:string) {
      const modal = document.getElementById(modalName);
      if (modal) {
        modal.style.display = 'block';

      }
    }

    closeModal(modalName:string) {
      const modal = document.getElementById(modalName);
      if (modal) {
        modal.style.display = 'none'; // Fecha o modal
      }
    }

    fecharModalRelatorio() {
      this.fileUrl = null
      this.relatorioService.cancelarGeracaoRelatorio()
    }

}
