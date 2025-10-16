import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  private shapesSubject = new Subject<{ type: string; coordinates: any }>();
  shapes$ = this.shapesSubject.asObservable();

  sendShapeCoordinates(type: string, coordinates: any): void {
    this.shapesSubject.next({ type, coordinates });
  }
}
