import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MapaService } from '@resources/modules/sicgo/core/service/mapa/mapa.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import L from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private triangleMarkers: L.Marker[] = [];
  private shapes: Array<{ type: string; shape: L.Layer; info?: string }> = [];
  private angolaBounds = L.latLngBounds(
    L.latLng(-18.042076, 11.681435),
    L.latLng(-4.391868, 24.085626)
  );
  private mapClickHandler!: (e: L.LeafletMouseEvent) => void;

  public loadingLocation = false;
  public ocorrencias: any[] = [];
  public drawingMode: 'none' | 'circle' | 'triangle' = 'none';
  public circleRadius: number = 100; // Raio padrão em metros

  @Output() shapeCoordinatesEmitter = new EventEmitter<{ type: string; coordinates: any }>();
  @Input() public placeName!: string;
  @Input() public placeNameB!: string;

  public filtro = { search: '' };

  constructor(
    private mapaService: MapaService,
    private ocorrenciaService: OcorrenciaService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.buscarOcorrencias();
    this.locateUser();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.setView(this.angolaBounds.getCenter(), 6);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off('click', this.mapClickHandler);
      this.map.remove();
    }
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    this.map = L.map(mapElement, {
      maxBounds: this.angolaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(this.angolaBounds.getCenter(), 6);

    const baseMaps = {
      "Padrão": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 39, 
        attribution: '© Sicgo PNA'
      }),
      "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 45, 
        attribution: '© Sicgo PNA'
      }),
      "Escuro": L.tileLayer('https://tiles.stadiamaps.com/styles/dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 30, 
        attribution: '© Sicgo PNA'
      }),
    };

    baseMaps["Padrão"].addTo(this.map);
    L.control.layers(baseMaps).addTo(this.map);

    this.mapClickHandler = (e: L.LeafletMouseEvent) => this.handleMapClick(e.latlng);
    this.map.on('click', this.mapClickHandler);

    this.setupResponsiveResize(mapElement);
    this.addControlButtons();
  }

  private addControlButtons(): void {
    this.createControlButton('⭕ Marcar Círculo', () => this.startDrawing('circle'), 'circle-btn')
      .addTo(this.map);

    this.createControlButton('🔺 Marcar Triângulo', () => this.startDrawing('triangle'), 'triangle-btn')
      .addTo(this.map);

    const radiusControl = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control radius-control');
        container.style.display = 'none';
        
        const label = L.DomUtil.create('label', '', container);
        label.innerHTML = 'Raio (m):';
        
        const input = L.DomUtil.create('input', '', container);
        input.type = 'number';
        input.value = this.circleRadius.toString();
        input.min = '10';
        input.max = '1000';
        input.step = '10';
        
        input.addEventListener('change', (e) => {
          this.circleRadius = +(e.target as HTMLInputElement).value;
        });

        return container;
      }
    });
    
    new radiusControl({ position: 'topright' }).addTo(this.map);

    this.createControlButton('🗑️ Limpar Círculo', () => this.clearCircle(), 'clear-circle-btn')
      .addTo(this.map);
    this.createControlButton('🗑️ Limpar Triângulo', () => this.clearTriangle(), 'clear-triangle-btn')
      .addTo(this.map);
    this.createControlButton('✖️ Cancelar', () => this.cancelDrawing(), 'cancel-btn')
      .addTo(this.map);
  }

  private startDrawing(shapeType: 'circle' | 'triangle'): void {
    this.cancelDrawing();
    this.drawingMode = shapeType;
    this.toggleRadiusControl(shapeType === 'circle');
    
    if (shapeType === 'triangle') {
      this.showHelpTooltip('Clique em 3 pontos no mapa para definir o triângulo');
    } else {
      this.showHelpTooltip('Clique no mapa para posicionar o centro do círculo');
    }
  }

  private toggleRadiusControl(show: boolean): void {
    const radiusControl = document.querySelector('.radius-control') as HTMLElement;
    if (radiusControl) {
      radiusControl.style.display = show ? 'block' : 'none';
    }
  }

  private showHelpTooltip(message: string): void {
    const existingTooltip = document.getElementById('help-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = L.DomUtil.create('div', 'help-tooltip');
    tooltip.id = 'help-tooltip';
    tooltip.innerHTML = message;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 8px 16px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      z-index: 1000;
    `;

    this.map.getContainer().appendChild(tooltip);

    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 3000);
  }

  private handleMapClick(latlng: L.LatLng): void {
    if (!this.angolaBounds.contains(latlng)) {
      alert('A localização está fora de Angola!');
      return;
    }

    switch (this.drawingMode) {
      case 'circle':
        this.createCircle(latlng);
        break;
      case 'triangle':
        this.addTrianglePoint(latlng);
        break;
      default:
        break;
    }
  }

  private createCircle(center: L.LatLng): void {
    this.clearCircle();
    
    const circle = L.circle(center, {
      color: '#3388ff',
      fillColor: '#3388ff',
      fillOpacity: 0.2,
      radius: this.circleRadius
    }).addTo(this.map);

    circle.bindPopup(`
      <b>Círculo</b><br>
      Centro: ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}<br>
      Raio: ${this.circleRadius}m
    `).openPopup();

    this.shapes.push({ type: 'círculo', shape: circle });
    
    // Envia através do MapaService com o novo formato
    this.mapaService.sendShapeCoordinates(
      'círculo',
      center,          // Coordenadas do centro
      // this.circleRadius // Raio como parâmetro separado
    );
    
    this.drawingMode = 'none';
    this.toggleRadiusControl(false);
  }

  private addTrianglePoint(latlng: L.LatLng): void {
    if (this.triangleMarkers.length >= 3) {
      alert('Triângulo já completo. Limpe para criar um novo.');
      return;
    }

    const marker = L.marker(latlng, {
      draggable: true,
      icon: L.divIcon({
        className: 'triangle-marker',
        html: `<div>${this.triangleMarkers.length + 1}</div>`,
        iconSize: [24, 24]
      })
    }).addTo(this.map);

    marker.on('drag', () => this.updateTriangle());
    this.triangleMarkers.push(marker);

    if (this.triangleMarkers.length === 3) {
      this.createTriangle();
    }
  }

  private createTriangle(): void {
    const points = this.triangleMarkers.map(m => m.getLatLng());
    this.clearTriangle(false); // Não limpa os marcadores
    
    const triangle = L.polygon(points, {
      color: '#ff3333',
      fillColor: '#ff3333',
      fillOpacity: 0.2
    }).addTo(this.map);

    const popupContent = `
      <b>Triângulo</b><br>
      Vértices:<br>
      1: ${points[0].lat.toFixed(5)}, ${points[0].lng.toFixed(5)}<br>
      2: ${points[1].lat.toFixed(5)}, ${points[1].lng.toFixed(5)}<br>
      3: ${points[2].lat.toFixed(5)}, ${points[2].lng.toFixed(5)}
    `;

    triangle.bindPopup(popupContent).openPopup();
    this.shapes.push({ type: 'triângulo', shape: triangle });
    
    this.mapaService.sendShapeCoordinates('triângulo', points);
  }

  private updateTriangle(): void {
    if (this.triangleMarkers.length === 3) {
      const existing = this.shapes.find(s => s.type === 'triângulo');
      if (existing) {
        const polygon = existing.shape as L.Polygon;
        polygon.setLatLngs(this.triangleMarkers.map(m => m.getLatLng()));
        
        const points = this.triangleMarkers.map(m => m.getLatLng());
        const popupContent = `
          <b>Triângulo</b><br>
          Vértices:<br>
          1: ${points[0].lat.toFixed(5)}, ${points[0].lng.toFixed(5)}<br>
          2: ${points[1].lat.toFixed(5)}, ${points[1].lng.toFixed(5)}<br>
          3: ${points[2].lat.toFixed(5)}, ${points[2].lng.toFixed(5)}
        `;
        
        polygon.getPopup()?.setContent(popupContent);
        
        this.mapaService.sendShapeCoordinates('triângulo', points);
      }
    }
  }

  private createControlButton(html: string, onClick: () => void, className: string = ''): L.Control {
    const button = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const btn = L.DomUtil.create('button', className, container);
        btn.innerHTML = html;
        btn.style.cssText = `
          width: auto;
          max-width: 100%;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(204 202 202);
          background-color: rgb(248, 248, 248);
          box-shadow: rgb(184, 184, 184) 0px -5px 10px -5px inset;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          outline-style: none;
        `;
        
        L.DomEvent.on(btn, 'click', L.DomEvent.stop)
          .on(btn, 'click', onClick, this);
        
        return container;
      }
    });
    
    return new button({ position: 'topright' });
  }

  private setupResponsiveResize(container: HTMLElement): void {
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
      if (!this.map.getBounds().equals(this.angolaBounds)) {
        this.map.fitBounds(this.angolaBounds);
      }
    });
    resizeObserver.observe(container);
  }

  public buscarOcorrencias(): void {
    const options = { ...this.filtro };
    this.ocorrenciaService.listar(options).subscribe({
      next: (response: any) => {
        this.ocorrencias = response.data || [];
        this.clearShapes();

        this.ocorrencias.forEach((registro: any) => {
          try {
            const circleCoords = this.parseCoordinates(registro.coordinates_circle);
            const triangleCoords = this.parseCoordinates(registro.coordinates_triangle);
            const info = `
              <b>Descrição:</b> ${registro.descricao}<br>
              <b>Crime:</b> ${registro.categoria}<br>
              <b>Local:</b> ${registro.local}<br>
              <b>Data:</b> ${new Date(registro.created_at).toLocaleString()}
            `;
            this.displayCoordinates(circleCoords, triangleCoords, info);
          } catch (e) {
            console.error('Erro ao processar ocorrência:', e);
          }
        });
      },
      error: err => console.error('Erro ao buscar ocorrências:', err)
    });
  }

  private displayCoordinates(circle: any, triangle: any, info: string): void {
    if (circle?.center && circle?.radius) {
      const circleLayer = L.circle([circle.center.lat, circle.center.lng], {
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.2,
        radius: circle.radius
      }).addTo(this.map);
      
      circleLayer.bindPopup(info);
      this.shapes.push({ type: 'círculo', shape: circleLayer, info });
    }

    if (triangle?.length === 3) {
      const triangleLayer = L.polygon(triangle, {
        color: '#ff3333',
        fillColor: '#ff3333',
        fillOpacity: 0.2
      }).addTo(this.map);
      
      triangleLayer.bindPopup(info);
      this.shapes.push({ type: 'triângulo', shape: triangleLayer, info });
    }
  }

  private parseCoordinates(coordsString: string): any {
    try {
      return JSON.parse(coordsString);
    } catch (e) {
      console.error('Erro ao parsear coordenadas:', e);
      return null;
    }
  }

  public locateUser(): void {
    if (!navigator.geolocation) {
      this.centerMap(this.angolaBounds.getCenter());
      return;
    }

    this.loadingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.loadingLocation = false;
        const { latitude, longitude } = position.coords;
        const userLatLng = L.latLng(latitude, longitude);

        if (this.angolaBounds.contains(userLatLng)) {
          this.map.flyTo(userLatLng, 15, { animate: true, duration: 1.5 });
          L.marker(userLatLng, {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div class="pulse-marker"></div>',
              iconSize: [20, 20]
            }),
            title: 'Sua localização'
          }).addTo(this.map).bindPopup('<b>Você está aqui!</b>').openPopup();
        } else {
          this.centerMap(this.angolaBounds.getCenter());
        }
      },
      () => {
        this.loadingLocation = false;
        this.centerMap(this.angolaBounds.getCenter());
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  private centerMap(latlng: L.LatLng): void {
    this.map.flyTo(
      this.angolaBounds.contains(latlng) ? latlng : this.angolaBounds.getCenter(),
      13,
      { animate: true, duration: 1 }
    );
  }

  private cancelDrawing(): void {
    this.drawingMode = 'none';
    this.triangleMarkers.forEach(marker => this.map.removeLayer(marker));
    this.triangleMarkers = [];
    this.toggleRadiusControl(false);
  }

  private clearShapes(): void {
    this.shapes.forEach(s => this.map.removeLayer(s.shape));
    this.shapes = [];
  }

  public clearCircle(): void {
    this.shapes = this.shapes.filter(s => {
      if (s.type === 'círculo') {
        this.map.removeLayer(s.shape);
        return false;
      }
      return true;
    });
  }

  public clearTriangle(clearMarkers: boolean = true): void {
    if (clearMarkers) {
      this.triangleMarkers.forEach(m => this.map.removeLayer(m));
      this.triangleMarkers = [];
    }
    
    this.shapes = this.shapes.filter(s => {
      if (s.type === 'triângulo') {
        this.map.removeLayer(s.shape);
        return false;
      }
      return true;
    });
  }
}