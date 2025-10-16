import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject } from 'rxjs';
import { ListarComponent } from '../../listar/listar.component';
import { FicheiroService } from '@core/services/Ficheiro.service';

@Component({
  selector: 'app-sicgo-dinfop-ver-selecionados',
  templateUrl: './ver-selecionados.component.html',
  styleUrls: ['./ver-selecionados.component.css']
})
export class VerSelecionadosComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @Input() agentesSelecionados: any
  @ViewChild(ListarComponent) listarComponent!: ListarComponent;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  public isLoading: boolean = false  
  fotodfault='../../../../../../../../assets/assets_sicgo/img/logopolice.png';

  constructor(
    private ficheiroService: FicheiroService, 
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
 
  }

  removerAgenteSelecionado(item: any) {
    const posicao = this.agentesSelecionados.findIndex((o: any) => o.id === item.id);
    this.agentesSelecionados.splice(posicao, 1)
  }

  removerTodos() {
    this.agentesSelecionados.splice(0, this.agentesSelecionados.length)
  }

  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  idade: number | null = null;

  calculateAge(birthData: string | number | Date) {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      let idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
      }

      this.idade = idade;
    } else {
      
    }
  }

    // Exibe as fotos e detalhes de todos os delituosos
    visualizarDelituoso() {
      const delituoso = this.agentesSelecionados
      // Verifique se delituoso e fotografias não são nulos
      if (!delituoso || !delituoso.fotografias) {
        console.error('Delituoso ou fotografias são null ou undefined');
        return; // Sai da função se os dados não estiverem disponíveis
      }
  
      // Exibe a foto frontal
      if (delituoso.fotografias.image_frontal) {
        this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_frontal)
          .pipe(finalize(() => { }))
          .subscribe((file) => {
            delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
            });
      } else {
        console.warn('Imagem frontal não disponível');
      }
  
      // Exibe a foto lateral direita
      if (delituoso.fotografias.image_lateral_direita) {
        this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
          .pipe(finalize(() => { }))
          .subscribe((file) => {
            delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
          });
      }
  
      // Exibe a foto lateral esquerda
      if (delituoso.fotografias.image_lateral_esquerda) {
        this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
          .pipe(finalize(() => { }))
          .subscribe((file) => {
            delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
          });
      }
    }
}
