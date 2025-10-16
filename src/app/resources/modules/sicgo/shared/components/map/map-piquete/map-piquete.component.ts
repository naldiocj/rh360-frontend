import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import L, { ControlPosition, DomUtil,Map, Util } from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import * as geocoder from 'leaflet-control-geocoder';
 
@Component({
  selector: 'app-map-piquete',
  templateUrl: './map-piquete.component.html',
  styleUrls: ['./map-piquete.component.css']
})
export class MapPiqueteComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private shapes: L.Layer[] = [];
  private heatLayer!: L.HeatLayer;
  private autoRefreshInterval: any;
  private markerGroups: { [key: string]: L.LayerGroup } = {};
  private geocoderControl: any;
  private searchControl: any; // Added searchControl property

  public ocorrencias: any[] = [];
  public totalOcorrenciasVisiveis = 0;
  public loadingLocation = false;
  public autoRefreshActive = true;
  public refreshInterval = 30000;
  public countsByStatus: { [key: string]: number } = {};
@Input() dados: any[] = [];
  
  @Input() public placeName!: string;
  @Input() public placeNameB!: string;

  private angolaBounds = L.latLngBounds(
    L.latLng(-18.042076, 11.681435),
    L.latLng(-4.391868, 24.085626)
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
    this.buscarOcorrencias();
    this.locateUser();
    this.startAutoRefresh();
    this.loadPoliceStations(); // ← policias
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    if (this.map) this.map.remove();
  }

  private initializeMarkerGroups(): void {
    this.markerGroups = {
      pendente: L.layerGroup(),
      em_andamento: L.layerGroup(),
      concluido: L.layerGroup(),
      utitlizador: L.layerGroup(),
      policia: L.layerGroup() // Novo grupo para marcadores policiais
    };
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

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
    this.markerGroups['policia'].addTo(this.map); 
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
  
private loadPoliceStations(): void {
  const postosPoliciais = [
    {
      nome: "Esquadra da Mutamba",
      tipo: "esquadra",
      coordenadas: [-8.8147, 13.2343],
      endereco: "Av. Comandante Gika, Luanda",
      telefone: "+244 222 123 456",
      horario: "24 horas",
      responsavel: "Comissário João Silva",
      jurisdicao: "Centro da Cidade",
      servicos: ["Atendimento geral", "Denúncias", "BO"]
    },
    {
      nome: "Posto Policial do Prenda",
      tipo: "posto",
      coordenadas: [-8.8276, 13.2451],
      endereco: "Rua Amílcar Cabral, Luanda",
      telefone: "+244 222 789 012",
      horario: "07:00 - 22:00",
      responsavel: "Inspetora Maria Fernandes"
    },
    {
      nome: "Comando Provincial de Luanda",
      tipo: "comando",
      coordenadas: [-8.8189, 13.2314],
      endereco: "Av. 4 de Fevereiro, Luanda",
      telefone: "+244 222 333 444",
      horario: "08:00 - 18:00 (Seg-Sex)",
      responsavel: "Superintendente José Kiala",
      jurisdicao: "Toda província",
      servicos: ["Administração", "Comando", "Coordenação"]
    },
    // Add more stations...
  ];

  postosPoliciais.forEach(posto => this.addPoliceMarker(posto));
}

private addPoliceMarker(posto: any): void {
  const icon = L.divIcon({
    className: 'police-marker',
    html: `<div class="police-icon">${this.getPoliceIcon(posto.tipo)}</div>`,
    iconSize: [32, 32]
  });

  const marker = L.marker([posto.coordenadas[0], posto.coordenadas[1]], { 
    icon,
    title: posto.nome
  })
    .bindPopup(this.createPolicePopupContent(posto))
    .addTo(this.markerGroups['policia']);

  // Add click event to center map on marker
  marker.on('click', () => {
    this.map.flyTo(marker.getLatLng(), 16, { 
      duration: 0.5,
      easeLinearity: 0.25
    });
  });

  // Add to search index if you have search functionality
  if (this.searchControl) {
    this.searchControl.addLayer(marker, posto.nome);
  }
}

private getPoliceIcon(tipo: string): string {
  const icons = {
    esquadra: '🏢',    // Police station
    posto: '🚓',       // Police post
    comando: '🎖️',    // Command
    especial: '🛡️',   // Special units
    transito: '🚦',    // Traffic police
    turismo: '🏨',     // Tourism police
    default: '👮'      // Default
  };
  return icons[tipo.toLowerCase() as keyof typeof icons] || icons.default;
}

private createPolicePopupContent(posto: any): string {
  const servicosHTML: string = posto.servicos && Array.isArray(posto.servicos)
    ? `<ul>${posto.servicos.map((s: string) => `<li>${s}</li>`).join('')}</ul>` 
    : '';

  return `
    <div class="police-popup">
      <h4>${posto.nome}</h4>
      <div class="police-type-badge">${this.translatePoliceType(posto.tipo)}</div>
      <p><i class="fas fa-map-marker-alt"></i> ${posto.endereco}</p>
      ${posto.telefone ? `<p><i class="fas fa-phone"></i> <a href="tel:${posto.telefone}">${posto.telefone}</a></p>` : ''}
      ${posto.horario ? `<p><i class="fas fa-clock"></i> ${posto.horario}</p>` : ''}
      ${posto.responsavel ? `<p><i class="fas fa-user-tie"></i> ${posto.responsavel}</p>` : ''}
      ${posto.jurisdicao ? `<p><i class="fas fa-map-marked-alt"></i> Jurisdição: ${posto.jurisdicao}</p>` : ''}
      ${servicosHTML}
      <div class="popup-footer">
        <small>Fonte: IGP Angola • Última atualização: ${new Date().toLocaleDateString()}</small>
      </div>
      <button class="btn-directions" onclick="getDirections(${posto.coordenadas[0]}, ${posto.coordenadas[1]})">
        <i class="fas fa-route"></i> Como chegar
      </button>
    </div>
  `;
}

private translatePoliceType(tipo: string): string {
  const types: Record<string, string> = {
    esquadra: 'Esquadra',
    posto: 'Posto Policial',
    comando: 'Comando',
    especial: 'Unidade Especial',
    transito: 'Polícia de Trânsito',
    turismo: 'Polícia Turística',
    default: 'Posto Policial'
  };
  return types[tipo.toLowerCase()] || types['default'];
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
      if (e.geocode.bbox) {
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

        setTimeout(() => {
          this.map.removeLayer(marker);
        }, 5000);
      }
    });

    this.geocoderControl.addTo(this.map);
}




  buscarOcorrencias(): void {
    const options = { ...this.filtro };
    this.ocorrenciaService.listar(options).subscribe({
      next: (response: any) => {
        this.ocorrencias = response.data || [];
        this.processOcorrencias(this.ocorrencias);
      },
      error: (err) => console.error('Erro ao buscar ocorrências:', err),
    });
  }

  private processOcorrencias(ocorrencias: any[]): void {
    this.clearAllMarkers();
    this.resetCounts();
    const heatData: [number, number][] = [];

    ocorrencias.forEach(registro => {
      const coords = this.extractCoordinates(registro);
      if (!coords) return;

      const info = this.generatePopupContent(registro);
      const statusKey = this.getStatusKey(registro.status);
      
      this.countsByStatus[statusKey] = (this.countsByStatus[statusKey] || 0) + 1;

      if (coords.circle) {
        heatData.push([coords.circle.lat, coords.circle.lng]);
        this.addCircleMarker(coords.circle, registro.status, info, registro.cor);
      }

      if (coords.triangle && coords.triangle.length === 3) {
        this.addTriangleMarker(coords.triangle, registro.status, info, registro.cor);
      }
    });

    this.updateHeatLayer(heatData);
    this.totalOcorrenciasVisiveis = ocorrencias.length;
  }

  private addCircleMarker(center: any, status: string, info: string, color?: string): void {
    const latLng = L.latLng(center.lat, center.lng);
    
    const marker = this.createPulseMarker(latLng, status, info, color);
    this.markerGroups[this.getStatusKey(status)].addLayer(marker);

    const circle = L.circle(latLng, {
      radius: center.radius || 100,
      color: color || '#0000FF',
      fillColor: color || '#0000FF',
      fillOpacity: 0.2
    });
    
    circle.bindPopup(info);
    circle.addTo(this.map);
    this.shapes.push(circle);
  }

  private addTriangleMarker(coords: any[], status: string, info: string, color?: string): void {
    const triangleLatLngs = coords.map(p => L.latLng(p.lat, p.lng));
    const center = L.latLngBounds(triangleLatLngs).getCenter();
    
    const marker = this.createPulseMarker(center, status, info, color);
    this.markerGroups[this.getStatusKey(status)].addLayer(marker);

    const triangle = L.polygon(triangleLatLngs, {
      color: color || '#0000FF',
      fillColor: color || '#0000FF',
      fillOpacity: 0.5
    });
    
    triangle.bindPopup(info);
    triangle.addTo(this.map);
    this.shapes.push(triangle);
  }

  private createPulseMarker(latLng: L.LatLng, status: string, info: string, color?: string): L.Marker {
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

    if (info) {
      marker.bindPopup(info, {
        maxWidth: 300,
        minWidth: 200,
        className: `map-popup-container ${statusClass}`
      });
    }

    return marker;
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
// FullScreenMap
  FullScreenMap = L.Control.extend({
  initialize: function (options: { position: ControlPosition }) {
    Util.setOptions(this, options);
  },
  options: {
    position: 'topleft',
  },
  onAdd: (map: Map) => {
    const container = DomUtil.create(
      'input',
      'leaflet-control-zoom leaflet-bar leaflet-control'
    );
    container.type = 'button';
    container.title = 'Ver en pantalla completa';
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
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
      if (!document.fullscreenElement) {
        document.getElementById('map')?.requestFullscreen();
        container.title = 'SICGO, Sair da tela cheia';
      } else {
        document.exitFullscreen();
        container.title = 'SICGO, Ver em tela cheia';
      }
    };

    return container;
  },
});

    fullScreenMap = (options?: { position?: L.ControlPosition }) =>
  new this.FullScreenMap(options);

// FullScreenMap
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

  public toggleAutoRefresh(): void {
    this.autoRefreshActive = !this.autoRefreshActive;
    if (this.autoRefreshActive) this.startAutoRefresh();
    else this.stopAutoRefresh();
  }

  public updateRefreshInterval(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.refreshInterval = parseInt(select.value) * 1000;
    if (this.autoRefreshActive) this.startAutoRefresh();
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.buscarOcorrencias();
    }, this.refreshInterval);
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }

  public locateUser(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não suportada.');
      return;
    }

    this.loadingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.loadingLocation = false;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!this.isValidCoordinate(lat, lng)) return;

        const userLatLng = L.latLng(lat, lng);
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
      if (shape instanceof L.Circle) {
        const center = shape.getLatLng();
        const info = shape.getPopup()?.getContent() || '';
        csvRows.push([
          'circle',
          center.lat,
          center.lng,
          shape.getRadius(),
          `"${typeof info === 'string' ? info.replace(/"/g, '""') : ''}"`
        ].join(','));
      } else if (shape instanceof L.Polygon) {
        const latLngs = (shape.getLatLngs() as L.LatLng[][])[0];
        const info = shape.getPopup()?.getContent() || '';
        latLngs.forEach((latLng, i) => {
          csvRows.push([
            `triangle_${i+1}`,
            latLng.lat,
            latLng.lng,
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
}