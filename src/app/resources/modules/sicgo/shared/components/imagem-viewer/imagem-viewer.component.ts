import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-imagem-viewer',
  templateUrl: './imagem-viewer.component.html',
  styleUrls: ['./imagem-viewer.component.css']
})
export class ImagemViewerComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @Input() imageUrl: string = '';
  zoomLevel: number = 1;
  rotation: number = 0;

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  rotateClockwise() {
    this.rotation += 90;
  }

  rotateCounterClockwise() {
    this.rotation -= 90;
  }
}

