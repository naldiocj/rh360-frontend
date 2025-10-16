import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sicgo-preview-img',
  templateUrl: './preview-img.component.html',
  styleUrls: ['./preview-img.component.css']
})
export class PreviewImgComponent implements OnInit {
  @Input() photoUrl: string = ''; // URL da foto a ser visualizada
  @Input() photoId?: number; // ID da foto (opcional)
  @Input() altText: string = 'Image Preview'; // Texto alternativo da imagem
  @Input() showDownloadButton: boolean = true; // Exibir botão de download
  @Output() closeViewer = new EventEmitter<void>();

  ngOnInit(): void {
  }
  /**
   * Método para fechar o visualizador de fotos
   */
  onClose() {
    this.closeViewer.emit();
  }

  /**
   * Método para fazer o download da imagem
   */
  downloadImage() {
    const link = document.createElement('a');
    link.href = this.photoUrl;
    link.download = `image-${this.photoId || 'download'}`;
    link.click();
  }
}
