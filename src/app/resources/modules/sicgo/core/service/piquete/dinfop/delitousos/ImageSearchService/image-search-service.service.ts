import { Injectable } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  constructor(private ficheiroService: FicheiroService) {}

  searchImagesForDelituoso(delituoso: any): Observable<any> {
    const totalImages = 4;  // 4 imagens (frontal, lateral direita, lateral esquerda, nuca)
    let loadedImages = 0;

    return new Observable((observer) => {
      const updateProgress = () => {
        loadedImages++;
        const progress = Math.round((loadedImages / totalImages) * 100);
        this.progressSubject.next(progress);

        if (loadedImages === totalImages) {
          observer.complete();  // Conclui a busca quando todas as imagens forem carregadas
        }
      };

      // Carregar cada imagem
      const images = [
        { imageUrl: delituoso.fotografias.image_frontal, field: 'fileUrlFrontal' },
        { imageUrl: delituoso.fotografias.image_lateral_direita, field: 'fileUrlLateralDireita' },
        { imageUrl: delituoso.fotografias.image_lateral_esquerda, field: 'fileUrlLateralEsquerda' },
        { imageUrl: delituoso.fotografias.image_nuca, field: 'fileUrlNuca' },
      ];

      images.forEach((image) => {
        if (image.imageUrl) {
          this.ficheiroService.getFileUsingUrl(image.imageUrl).pipe(
            finalize(() => updateProgress())  // Atualiza o progresso quando a imagem for carregada
          ).subscribe(
            (file) => {
              delituoso[image.field] = this.ficheiroService.createImageBlob(file);
            },
            (error) => {
              console.error(`Erro ao carregar a imagem: ${image.field}`, error);
              updateProgress();  // Se houver erro, ainda assim atualizamos o progresso
            }
          );
        } else {
          updateProgress();  // Se não houver a imagem, ainda assim atualiza o progresso
        }
      });
    });
  }
}
