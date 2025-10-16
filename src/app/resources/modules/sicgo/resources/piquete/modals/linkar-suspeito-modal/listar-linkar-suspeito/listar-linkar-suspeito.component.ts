import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarDelituosoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar_delituoso_ocorrencia/associar-delituoso-ocorrencia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopDelitousoOcorrenciaService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_ocorrencia.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-listar-linkar-suspeito',
  templateUrl: './listar-linkar-suspeito.component.html',
  styleUrls: ['./listar-linkar-suspeito.component.css']
})
export class ListarLinkarSuspeitoComponent implements OnInit {
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;

  fotodfault = './assets/assets_sicgo/img/logopolice.png';
  public delituoso: any[] = [];
  public isLoading: boolean = false
  isPhotoViewerOpen = false;
  selectedPhotoUrl = '';
  selectedPhotoId?: number;
  totalBase: number = 0
  NovoProcesso: any
  idade: number | null = null;
  @Input() dados:any;
  // Cria um EventEmitter para emitir o ID
  @Output() idEnviado: EventEmitter<number> = new EventEmitter<number>();


  constructor(private ficheiroService: FicheiroService,
    private AssociarDelituosoOcorrencia: AssociarDelituosoOcorrenciaService,
    private DinfopDelitouso: DinfopDelitousoService) { }



  ngOnInit() { 
    // Chama a verificação assim que o componente é carregado
    this.DinfopDelitouso.verificarDadosDelituoso(this.delituoso);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
       this.delituoso = this.dados.delituosos;
      // Exibe as fotos de todos os delituosos automaticamente
      this.delituoso.forEach((delituoso: any) => {
        this.visualizarDelituoso(delituoso);
      });
    }
  }



  enviarIds(idDelituoso: number) {
    this.DinfopDelitouso.enviarId(idDelituoso); // Atualiza o ID no serviço
  }

  encodeBase64(value: string): string {
    return btoa(value);
  }

  decodeBase64(value: string): string {
    return atob(value);
  }

  /**
   * Função para visualizar as fotos de todos os delituosos automaticamente ao carregar a página.
   * Exibe as imagens de acordo com o delituoso e as URLs de imagens cadastradas.
   */
     // Exibe as fotos e detalhes de todos os delituosos
     visualizarDelituoso(delituoso: any) {
      if (!delituoso || !delituoso.fotografias) {
        console.error('Delituoso ou fotografias não definidos');
        return;
      }
    
      const { image_frontal, image_lateral_direita, image_lateral_esquerda } = delituoso.fotografias;
    
      // Exibe a foto frontal
      if (image_frontal) {
        this.ficheiroService.getFileUsingUrl(image_frontal)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem frontal:', error)
          );
      }
    
      // Exibe a foto lateral direita
      if (image_lateral_direita) {
        this.ficheiroService.getFileUsingUrl(image_lateral_direita)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral direita:', error)
          );
      }
    
      // Exibe a foto lateral esquerda
      if (image_lateral_esquerda) {
        this.ficheiroService.getFileUsingUrl(image_lateral_esquerda)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral esquerda:', error)
          );
      }
    }
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

  verificar() { 
    this.DinfopDelitouso.verificarDadosDelituoso(this.delituoso);
  }
 


   /**
     * Método para abrir o visualizador de fotos de um delituoso específico
     * @param photoUrl URL da foto a ser visualizada
     * @param photoId ID da foto para referência
     */
   openPhotoViewer(photoUrl: string, photoId: number) {
    this.selectedPhotoUrl = photoUrl;
    this.selectedPhotoId = photoId;
    this.isPhotoViewerOpen = true;
  }
}
