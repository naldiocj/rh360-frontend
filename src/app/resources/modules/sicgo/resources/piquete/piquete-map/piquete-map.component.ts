import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import L, { ControlPosition, DomUtil, Map, Util, LatLng, LatLngBounds, Layer, Polygon, Circle, HeatLayer, Marker, DivIcon, LatLngExpression } from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import * as geocoder from 'leaflet-control-geocoder';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'piquete-map',
  templateUrl: './piquete-map.component.html',
  styleUrls: ['./piquete-map.component.css'],
})
export class PiqueteMapComponent implements OnInit, OnChanges, OnDestroy {
  private map!: Map;
  private shapes: Layer[] = [];
  private heatLayer!: HeatLayer;
  private autoRefreshInterval: any;
  private markerGroups: { [key: string]: L.LayerGroup } = {};
  private geocoderControl!: geocoder.Geocoder;

  @Input() dados: any;
  @Input() placeName!: string;
  @Input() placeNameB!: string;

  public ocorrencias: any[] = [];
  public totalOcorrenciasVisiveis = 0;
  public loadingLocation = false;
  public autoRefreshActive = true;
  public refreshInterval = 30000;
  public countsByStatus: { [key: string]: number } = {};

  private angolaBounds = new LatLngBounds(
    new LatLng(-18.042076, 11.681435),
    new LatLng(-4.391868, 24.085626)
  );

  public filtro = {
    search: '',
    page: 1,
    perPage: 100,
    categoria: '',
    estado: ''
  };

  constructor(private ocorrenciaService: OcorrenciaService) {
    this.initializeMarkerGroups();
  }

  ngOnInit(): void {
    this.initializeMap();
    this.addAngolaGeocoder();
    this.locateUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      const processedData = Array.isArray(this.dados) ? this.dados : [this.dados];
      this.processOcorrencias(processedData);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoNavigation();
    this.stopAutoRefresh();
    if (this.map) this.map.remove();
  }

  private initializeMarkerGroups(): void {
    this.markerGroups = {
      pendente: L.layerGroup(),
      em_andamento: L.layerGroup(),
      concluido: L.layerGroup(),
      usuario: L.layerGroup()
    };
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento do mapa não encontrado!');
      return;
    }

    this.map = L.map('map', {
      maxBounds: this.angolaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      scrollWheelZoom: true
    }).setView(this.angolaBounds.getCenter(), 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 45,
      attribution: '© SICGO | PN'
    }).addTo(this.map);

    this.fullScreenMap().addTo(this.map);
    this.setupResponsiveResize(mapElement);
    Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
  }

  private setupResponsiveResize(container: HTMLElement): void {
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.map.invalidateSize();
        if (!this.map.getBounds().contains(this.angolaBounds)) {
          this.map.fitBounds(this.angolaBounds);
        }
      }, 100);
    });
    resizeObserver.observe(container);
  }

  private addAngolaGeocoder(): void {
    this.geocoderControl = new geocoder.Geocoder({
      defaultMarkGeocode: false,
      position: 'topright',
      placeholder: 'Buscar local em Angola...',
      errorMessage: 'Local não encontrado em Angola',
      geocoder: new (geocoder.geocoders as any).Nominatim({
        countryCodes: 'ao',
        limit: 5
      }),
    });

    this.geocoderControl.on('markgeocode', (e: any) => {
      if (e.geocode?.bbox) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest()
        ]);

        this.map.fitBounds(poly.getBounds(), {
          maxZoom: 14,
          padding: [50, 50]
        });

        const marker = L.marker(e.geocode.center, {
          icon: L.divIcon({
            className: 'search-marker',
            html: '<div class="pulse-marker search"></div>',
            iconSize: [20, 20]
          })
        })
        .bindPopup(`<b>${e.geocode.name}</b>`)
        .addTo(this.map)
        .openPopup();

        setTimeout(() => this.map.removeLayer(marker), 5000);
      }
    });

    this.geocoderControl.addTo(this.map);
  }

  private autoMoveInterval: any;
  private occurrenceCoordinates: LatLng[] = [];
  private currentOccurrenceIndex = 0;
  private processOcorrencias(ocorrencias: any[]): void {
    this.clearAllMarkers();
    this.resetCounts();
    const heatData: [number, number][] = [];
    const bounds = new L.LatLngBounds(this.angolaBounds.getSouthWest(), this.angolaBounds.getNorthEast());
    this.occurrenceCoordinates = [];

    ocorrencias.forEach((registro, index) => {
      try {
        const coords = this.extractCoordinates(registro);
        if (!coords) {
          console.warn(`Ocorrência ${index} sem coordenadas válidas`);
          return;
        }

        const info = this.generatePopupContent(registro);
        const statusKey = this.getStatusKey(registro.status);
        this.countsByStatus[statusKey] = (this.countsByStatus[statusKey] || 0) + 1;

        if (coords.circle) {
          const latLng = new LatLng(coords.circle.lat, coords.circle.lng);
          this.occurrenceCoordinates.push(latLng);
          bounds.extend(latLng);
          this.addCircleMarker(coords.circle, registro.status, info, registro.cor);
        }

        if (coords.triangle && coords.triangle.length === 3) {
          const trianglePoints = coords.triangle.map((p: any) => new LatLng(p.lat, p.lng));
          const center = L.latLngBounds(trianglePoints).getCenter();
          this.occurrenceCoordinates.push(center);
          bounds.extend(trianglePoints);
          this.addTriangleMarker(coords.triangle, registro.status, info, registro.cor);
        }
      } catch (error) {
        console.error(`Erro ao processar ocorrência ${index}:`, error);
      }
    });


    
 // Inicia movimento automático
 this.startAutoNavigation();
    this.updateHeatLayer(heatData);
    this.totalOcorrenciasVisiveis = ocorrencias.length;

    if (!bounds.isValid()) {
      this.map.fitBounds(this.angolaBounds);
    } else {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 17
      });
    }
  }

  private startAutoNavigation(): void {
    this.stopAutoNavigation();
    
    if (this.occurrenceCoordinates.length === 0) return;

    this.currentOccurrenceIndex = 0;
    
    this.autoMoveInterval = setInterval(() => {
      if (this.currentOccurrenceIndex >= this.occurrenceCoordinates.length) {
        this.currentOccurrenceIndex = 0; // Reinicia ciclo
      }
      
      const nextCoord = this.occurrenceCoordinates[this.currentOccurrenceIndex];
      this.map.flyTo(nextCoord, 18, {
        animate: true,
        duration: 2 // Duração mais longa para transição suave
      });

      this.currentOccurrenceIndex++;
    }, 5000); // Muda a cada 5 segundos
  }

  private stopAutoNavigation(): void {
    if (this.autoMoveInterval) {
      clearInterval(this.autoMoveInterval);
      this.autoMoveInterval = null;
    }
  }
  private addCircleMarker(center: any, status: string, info: string, color?: string): void {
    const latLng = new LatLng(center.lat, center.lng);
    
    const marker = this.createPulseMarker(latLng, status, info, color);
    this.markerGroups[this.getStatusKey(status)].addLayer(marker);

    const circle = L.circle(latLng, {
      radius: center.radius || 100,
      color: color || '#0000FF',
      fillColor: color || '#0000FF',
      fillOpacity: 0.2
    }).bindPopup(info);
    
    circle.addTo(this.map);
    this.shapes.push(circle);
  }

  private addTriangleMarker(coords: any[], status: string, info: string, color?: string): void {
    const triangleLatLngs = coords.map(p => new LatLng(p.lat, p.lng));
    const center = L.latLngBounds(triangleLatLngs).getCenter();
    
    const marker = this.createPulseMarker(center, status, info, color);
    this.markerGroups[this.getStatusKey(status)].addLayer(marker);

    const triangle = L.polygon(triangleLatLngs, {
      color: color || '#0000FF',
      fillColor: color || '#0000FF',
      fillOpacity: 0.5
    }).bindPopup(info);
    
    triangle.addTo(this.map);
    this.shapes.push(triangle);
  }

  private createPulseMarker(latLng: LatLng, status: string, info: string, color?: string): Marker {
    const statusClass = this.getStatusClass(status);
    const markerSize = 20;
    
    const marker = L.marker(latLng, {
      icon: L.divIcon({
        className: 'pulse-marker-container',
        html: `<div class="pulse-marker ${statusClass}"></div>`,
        iconSize: [markerSize, markerSize],
        popupAnchor: [0, -markerSize/2]
      }),
      riseOnHover: true
    });

    return marker.bindPopup(info, {
      maxWidth: 300,
      minWidth: 200,
      className: `map-popup-container ${statusClass}`
    });
  }

  private extractCoordinates(registro: any): {circle?: any, triangle?: any} {
    try {
      return {
        circle: registro.coordinates_circle ? JSON.parse(registro.coordinates_circle) : null,
        triangle: registro.coordinates_triangle ? JSON.parse(registro.coordinates_triangle) : null
      };
    } catch (e) {
      console.error('Erro ao processar coordenadas:', e);
      return {};
    }
  }

  private generatePopupContent(registro: any): string {
    return `
      <div class="map-popup">
        <h4>${registro.categoria || 'Ocorrência'}</h4>
        <p><strong>Descrição:</strong> ${registro.descricao || 'Não informada'}</p>
        <p><strong>Estado:</strong> <span class="status-${this.getStatusClass(registro.status)}">${registro.status || 'Pendente'}</span></p>
        <p><strong>Local:</strong> ${registro.local || 'Local não especificado'}</p>
        <p><strong>Data:</strong> ${registro.data_ocorrido || 'Não informada'}</p>
      </div>
    `;
  }

  private getStatusKey(status: string): string {
    if (!status) return 'pendente';
    const normalized = status.toLowerCase().replace(/ /g, '_');
    return this.markerGroups[normalized] ? normalized : 'pendente';
  }

  private getStatusClass(status: string): string {
    if (!status) return 'pendente';
    status = status.toLowerCase();
    if (status.includes('concluído') || status.includes('resolvido')) return 'concluido';
    if (status.includes('andamento')) return 'em-andamento';
    return 'pendente';
  }

  private clearAllMarkers(): void {
    Object.values(this.markerGroups).forEach(group => group.clearLayers());
    this.shapes.forEach(shape => this.map.removeLayer(shape));
    this.shapes = [];
  }

  private resetCounts(): void {
    this.countsByStatus = {
      pendente: 0,
      em_andamento: 0,
      concluido: 0
    };
  }

  private updateHeatLayer(points: [number, number][]): void {
    if (this.heatLayer) this.map.removeLayer(this.heatLayer);
    if (points.length > 0) {
      this.heatLayer = (L as any).heatLayer(points, { 
        radius: 25, 
        blur: 15, 
        gradient: { 0.4: 'blue', 0.7: 'lime', 1.0: 'red' } 
      });
      this.heatLayer.addTo(this.map);
    }
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  public locateUser(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não suportada pelo navegador');
      return;
    }

    this.loadingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.loadingLocation = false;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!this.isValidCoordinate(lat, lng)) return;

        const userLatLng = new LatLng(lat, lng);
        this.map.flyTo(userLatLng, 15, { animate: true, duration: 1.5 });

        this.markerGroups['usuario'].clearLayers();
        L.marker(userLatLng, {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="pulse-marker user"></div>',
            iconSize: [20, 20]
          }),
          title: 'Sua localização',
          zIndexOffset: 1000
        }).addTo(this.markerGroups['usuario'])
          .bindPopup('<b>Você está aqui!</b>')
          .openPopup();
      },
      (error) => {
        this.loadingLocation = false;
        console.error('Erro ao obter localização:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return isFinite(lat) && isFinite(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  }

  public countByStatus(status: string): number {
    return this.countsByStatus[status] || 0;
  }

  public exportShapesToCSV(): void {
    const csvRows: string[] = [];
    csvRows.push('tipo,lat,lng,raio,info');

    this.shapes.forEach(shape => {
      if (shape instanceof Circle) {
        const center = (shape as Circle).getLatLng();
        const info = shape.getPopup()?.getContent() || '';
        csvRows.push([
          'circle',
          center.lat,
          center.lng,
          (shape as Circle).getRadius(),
          `"${typeof info === 'string' ? info.replace(/"/g, '""') : ''}"`
        ].join(','));
      } else if (shape instanceof Polygon) {
        const latLngs = (shape as Polygon).getLatLngs()[0];
        const info = shape.getPopup()?.getContent() || '';
        (Array.isArray(latLngs) ? latLngs : []).forEach((latLng, i) => {
          csvRows.push([
            `triangle_${i+1}`,
            Array.isArray(latLng) ? latLng[0].lat : latLng.lat,
            Array.isArray(latLng) ? latLng[0].lng : latLng.lng,
            '',
            `"${typeof info === 'string' ? info.replace(/"/g, '""') : ''}"`
          ].join(','));
        });
      }
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'ocorrencias.csv';
    a.click();
    URL.revokeObjectURL(csvUrl);
  }

  private FullScreenMap = L.Control.extend({
    options: {
      position: 'topleft' as ControlPosition,
    },

    onAdd: (map: Map) => {
      const container = DomUtil.create(
        'input',
        'leaflet-control-zoom leaflet-bar leaflet-control'
      );
      container.type = 'button';
      container.title = 'Ver em tela cheia';
      container.style.backgroundImage =
        'url(https://cdn-icons-png.flaticon.com/512/2089/2089670.png)';
      container.style.backgroundSize = '15px 15px';
      container.style.backgroundRepeat = 'no-repeat';
      container.style.backgroundPosition = '50% 50%';
      container.style.width = '32px';
      container.style.height = '32px';
      container.style.padding = '2px';
      container.style.lineHeight = '30px';
      container.style.fontSize = '22px';
      container.style.fontWeight = 'bold';
      container.style.cursor = 'pointer';

      container.onclick = () => {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          if (!document.fullscreenElement) {
            mapElement.requestFullscreen().catch(err => {
              console.error('Erro ao ativar tela cheia:', err);
            });
          } else {
            document.exitFullscreen();
          }
        }
      };

      return container;
    }
  });

  private fullScreenMap = (options?: { position?: L.ControlPosition }) =>
    new this.FullScreenMap(options);
}