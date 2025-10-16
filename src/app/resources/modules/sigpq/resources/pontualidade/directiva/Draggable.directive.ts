import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggablePontualidade]'
})
export class DraggablePontualidadeDirective {
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  constructor(private element: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX - this.element.nativeElement.getBoundingClientRect().left;
    this.startY = event.clientY - this.element.nativeElement.getBoundingClientRect().top;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (this.isDragging) {
      this.element.nativeElement.style.position = 'absolute';
      this.element.nativeElement.style.left = `${event.clientX - this.startX}px`;
      this.element.nativeElement.style.top = `${event.clientY - this.startY}px`;
    }
  };

  private onMouseUp = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
