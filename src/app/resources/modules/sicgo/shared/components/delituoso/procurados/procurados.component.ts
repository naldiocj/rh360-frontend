import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProcuradosService } from '@resources/modules/sicgo/core/service/piquete/dinfop/procurados/procurados.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Delituoso {
  delituoso: {
    id: number;
    nome?: string;
    nomePai: string;
    alcunha?: string;
    genero: string;
    dataNascimento?: string;
    fotografias?: {
      image_frontal?: string;
      image_lateral_direita?: string;
      image_lateral_esquerda?: string;
    };
    fileUrlFrontal?: string;
    fileUrlLateralDireita?: string;
    fileUrlLateralEsquerda?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
@Component({
  selector: 'app-dinfop-procurados',
  templateUrl: './procurados.component.html',
  styleUrls: ['./procurados.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProcuradosComponent implements OnInit, OnDestroy {

  public delituosos: any[] = [];
  public groupedDelituosos: any[] = [];
  public currentSlideIndex = 0;
  public pagination: Pagination = {
    page: 1,
    perPage: 50, // Carrega blocos de 50 registros (25 slides)
    total: 0,
    totalPages: 1
  };
  public isPhotoViewerOpen = false;
  public selectedPhotoUrl = '';
  public selectedPhotoId?: number;
  public isLoading = false;
  public fotodfault = '../../../../../../../../assets/assets_sicgo/img/logopolice.png';
  private autoSlideInterval: any;
  private destroy$ = new Subject<void>();
  public animationState = 'none';

  constructor(
    private cdRef: ChangeDetectorRef,
    private readonly procuradosService: ProcuradosService,
    private readonly ficheiroService: FicheiroService
  ) { }

  ngOnInit(): void {
    this.buscarDelituoso(true);
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.destroy$.next();
    this.destroy$.complete();
  }

  buscarDelituoso(initialLoad = false): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.procuradosService.listarTodos({
      page: this.pagination.page,
      perPage: this.pagination.perPage,
      regime: 1,
      search: ''
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      ).subscribe({
        next: (response: Delituoso[]) => {
          this.delituosos = response;


          this.groupItems();
          this.preloadNextPageImages();
          if (initialLoad) this.startAutoSlide();
          this.delituosos.forEach(delituoso => this.carregarFotosDelituoso(delituoso.delituoso));
          if (this.delituosos.length > 0) {
            this.startAutoSlide();
          }
        },
        error: (error) => {
          console.error('Erro ao buscar delituosos:', error);
        }
      });
  }

  private groupItems(): void {
    this.groupedDelituosos = [];
    for (let i = 0; i < this.delituosos.length; i += 2) {
      this.groupedDelituosos.push(this.delituosos.slice(i, i + 2));
    }
  }

  private preloadNextPageImages(): void {
    if (this.pagination.page < this.pagination.totalPages) {
      const nextPage = this.pagination.page + 1;
      this.procuradosService.listarTodos({
        page: nextPage,
        perPage: this.pagination.perPage,
        regime: 1,
        search: ''
      }).subscribe(response => {
        response.data.forEach((item: any) => this.carregarFotosDelituoso(item.delituoso));
      });
    }
  }
  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Muda a cada 5 segundos
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    if (this.currentSlideIndex + 1 >= this.groupedDelituosos.length - 5) {
      this.loadMoreIfNeeded();
    }

    if (this.currentSlideIndex < this.groupedDelituosos.length - 1) {
      this.currentSlideIndex++;
      this.cdRef.detectChanges();
    }
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.cdRef.detectChanges();
    }

    this.stopAutoSlide();
    this.startAutoSlide();
  }

  private loadMoreIfNeeded(): void {
    if (this.pagination.page < this.pagination.totalPages && !this.isLoading) {
      this.pagination.page++;
      this.buscarDelituoso();
    }
  }

  goToSlide(index: number): void {
    const current = this.currentSlideIndex;
    const total = this.delituosos.length;

    // Calculate the shortest path direction
    const difference = index - current;
    const direction = (difference > 0 || (difference < 0 && -difference >= total / 2)) ? 'right' : 'left';

    this.animationState = direction;
    this.currentSlideIndex = index;
    this.cdRef.detectChanges();
  }

  // Adicione estas propriedades:
 
private currentDelituoso?: any;

// Função para abrir o visualizador
openPhotoViewer(photoUrl: string, delituosoId: number): void {
  this.stopAutoSlide();
  this.selectedPhotoUrl = photoUrl;
  this.selectedPhotoId = delituosoId;
  
  // Encontra o delituoso completo para mostrar mais informações
  this.currentDelituoso = this.delituosos.find(d => d.delituoso.id === delituosoId)?.delituoso;
  
  this.isPhotoViewerOpen = true;
  document.body.style.overflow = 'hidden'; // Impede scroll da página

    this.stopAutoSlide();
  }

  // Função para fechar o visualizador
closePhotoViewer(event: MouseEvent): void {
  event.stopPropagation();
  if ((event.target as HTMLElement).classList.contains('photo-viewer-modal') || 
      (event.target as HTMLElement).classList.contains('close-btn')) {
    this.isPhotoViewerOpen = false;
    document.body.style.overflow = '';
    this.startAutoSlide();
  }
}

// Seleciona uma foto diferente
selectPhoto(photoUrl: string, event: MouseEvent): void {
  event.stopPropagation();
  this.selectedPhotoUrl = photoUrl;
}

// Verifica se há fotos adicionais
hasMultiplePhotos(): boolean {
  return this.getAvailablePhotos().length > 1;
}

// Obtém todas as fotos disponíveis
getAvailablePhotos(): {url: string, type: string}[] {
  if (!this.currentDelituoso) return [];
  
  const photos = [];
  if (this.currentDelituoso.fileUrlFrontal) {
    photos.push({url: this.currentDelituoso.fileUrlFrontal, type: 'Frontal'});
  }
  if (this.currentDelituoso.fileUrlLateralDireita) {
    photos.push({url: this.currentDelituoso.fileUrlLateralDireita, type: 'Lateral Direita'});
  }
  if (this.currentDelituoso.fileUrlLateralEsquerda) {
    photos.push({url: this.currentDelituoso.fileUrlLateralEsquerda, type: 'Lateral Esquerda'});
  }
  
  return photos;
}

// Obtém o delituoso atual
getCurrentDelituoso(): any {
  return this.currentDelituoso;
}

  removeDelituoso(delituosoId: number): void {
    if (!confirm('Tem certeza que deseja remover este delituoso?')) return;

    this.isLoading = true;
    this.procuradosService.removeDelituosoById(delituosoId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => this.buscarDelituoso(),
        error: (error) => {
          console.error('Erro ao remover delituoso:', error);
        }
      });
  }

  private carregarFotosDelituoso(delituoso: Delituoso['delituoso']): void {
    if (!delituoso?.fotografias) return;

    const fotos = [
      { key: 'image_frontal', target: 'fileUrlFrontal' },
      { key: 'image_lateral_direita', target: 'fileUrlLateralDireita' },
      { key: 'image_lateral_esquerda', target: 'fileUrlLateralEsquerda' },
    ];

    fotos.forEach(foto => this.loadPhoto(delituoso, foto));
  }

  private loadPhoto(delituoso: Delituoso['delituoso'], foto: { key: string, target: string }): void {
    const photoUrl = delituoso.fotografias?.[foto.key as keyof typeof delituoso.fotografias];
    if (!photoUrl) return;

    this.ficheiroService.getFileUsingUrl(photoUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (file) => {
          delituoso[foto.target] = this.ficheiroService.createImageBlob(file);
          this.cdRef.detectChanges();
        },
        error: (error) => console.error(`Erro ao carregar ${foto.key}:`, error)
      });
  }

  calculateAge(birthDate?: string | number | Date): number | null {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    if (today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fotodfault;
  }
  trackByGroup(index: number, group: any[]): string {
    return group.map(item => item.delituoso.id).join('-');
  }
}