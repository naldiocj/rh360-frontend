import { Component, HostListener, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-femenino',
  templateUrl: './femenino.component.html',
  styleUrls: ['./femenino.component.css']
})
export class FemeninoComponent implements OnInit {
  mouseX: number = 0;
    mouseY: number = 0;
    animationFrameId: any;

    constructor(private ngZone: NgZone) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        const clientX = event.clientX;
        const clientY = event.clientY;
        this.queueAnimation(clientX, clientY, window.innerWidth, window.innerHeight);
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        const touch = event.touches[0];
        this.queueAnimation(touch.clientX, touch.clientY, window.innerWidth, window.innerHeight);
    }

    queueAnimation(clientX: number, clientY: number, width: number, height: number): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(() => {
            this.ngZone.run(() => this.calculateParallax(clientX, clientY, width, height));
        });
    }

    calculateParallax(clientX: number, clientY: number, width: number, height: number): void {
        this.mouseX = (clientX / width) - 0.5;
        this.mouseY = (clientY / height) - 0.5;
    }

    getLayerStyle(depth: number): { [key: string]: string } {
        return {
            transform: `translate(${this.mouseX * depth * 100}px, ${this.mouseY * depth * 100}px)`
        };
    }
}
