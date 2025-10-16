import { Component, Input, OnInit } from '@angular/core';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import L from 'leaflet';

@Component({
  selector: 'min-map',
  templateUrl: './min-map.component.html',
  styleUrls: ['./min-map.component.css']
})
export class MinMapComponent implements OnInit {
  private map!: L.Map;
  private triangleMarkers: L.Marker[] = [];
  private shapes: Array<{ type: string; shape: L.Layer; info?: string }> = [];
  private angolaBounds: L.LatLngBounds;
  totalBase: number = 0;
  public ocorrencias: any[] = [];
  @Input() public placeName!: string;
  @Input() public placeNameB!: string;

  constructor(private ocorrenciaService: OcorrenciaService) {
    this.angolaBounds = L.latLngBounds(
      L.latLng(-18.042076, 11.681435),
      L.latLng(-4.391868, 24.085626)
    );
  }

  ngOnInit(): void {
    this.initializeMap();
    this.buscarOcorrencias();
    this.locateUser();
  }

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,

  };
  buscarOcorrencias() {
    const options = { ...this.filtro };

    this.ocorrenciaService
      .listar(options)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.ocorrencias = response.data || [];
          console.log('Ocorrências recuperadas:', this.ocorrencias);

          // Limpar shapes antigos
          this.clearShapes();

          // Iterar sobre os registros para exibir as coordenadas
          this.ocorrencias.forEach((registro: any) => {
            const circleCoordinates = registro.coordinates_circle
              ? JSON.parse(registro.coordinates_circle)
              : null;

            const triangleCoordinates = registro.coordinates_triangle
              ? JSON.parse(registro.coordinates_triangle)
              : null;

            const info = ` 
              <b>Descrição:</b> ${registro.descricao}<br>
              <b>Crime:</b> ${registro.categoria}<br> 
              <b>Estado:</b> ${registro.estado}<br>
              <b>Local:</b> ${registro.local}<br>
            `;

            if (circleCoordinates || triangleCoordinates) {
              console.log('Desenhando coordenadas:', {
                circle: circleCoordinates,
                triangle: triangleCoordinates,
              });
              this.displayCoordinates(circleCoordinates, triangleCoordinates, info);
            }
          });
        },
        error: (err) => {
          console.error('Erro ao buscar ocorrências:', err);
        },
      });
  }



  displayCoordinates(circle: { lat: number; lng: number } | null, triangle: Array<{ lat: number; lng: number }> | null, info?: any): void {
    if (circle) {
      const circleLatLng = L.latLng(circle.lat, circle.lng);
      const circleShape = L.circle(circleLatLng, {
        color: 'blue',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100,
      });
  
      // Exibição de informações no clique
      circleShape.on('click', () => {
        L.popup()
          .setLatLng(circleLatLng)
          .setContent(`<b>Informação da Ocorrência:</b><br>${info || 'Sem informações disponíveis'}`)
          .openOn(this.map);
      });
  
      circleShape.addTo(this.map);
      this.shapes.push({ type: 'círculo', shape: circleShape });
      this.map.setView(circleLatLng, 13);
    }
  
    if (triangle && triangle.length === 3) {
      const triangleLatLngs = triangle.map((point) => L.latLng(point.lat, point.lng));
      const triangleShape = L.polygon(triangleLatLngs, {
        color: 'red',
        fillOpacity: 0.5,
      });
  
      // Exibição de informações no clique
      triangleShape.on('click', () => {
        const center = L.latLngBounds(triangleLatLngs).getCenter(); // Pega o centro do triângulo
        L.popup()
          .setLatLng(center)
          .setContent(`<b>Informação da Ocorrência:</b><br>${info || 'Sem informações disponíveis'}`)
          .openOn(this.map);
      });
  
      triangleShape.addTo(this.map);
      this.shapes.push({ type: 'triângulo', shape: triangleShape });
      const bounds = L.latLngBounds(triangleLatLngs);
      this.map.fitBounds(bounds);
    }
  }
  




  /** Inicializa o mapa com visão padrão em Angola */
  private initializeMap(): void {
    if (!document.getElementById('map')) {
      console.error('Elemento do mapa não encontrado!');
      return;
    }

    this.map = L.map('map', { maxBounds: this.angolaBounds }).setView(this.angolaBounds.getCenter(), 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 45,
      attribution: '© Sicgo pna',
    }).addTo(this.map);
  }

  private clearShapes(): void {
    this.shapes.forEach((shape) => this.map.removeLayer(shape.shape));
    this.shapes = [];
  }
 

  /** Menu para escolher o tipo de forma */
  private openShapeMenu(latlng: L.LatLng): void {
    const shapeType = prompt("Escolha o tipo de forma:\n1 - Círculo\n2 - Triângulo");

    if (shapeType === '1') {
      this.addCircle(latlng);
    } else if (shapeType === '2') {
      this.addTriangle(latlng);
    } else {
      alert('Seleção inválida.');
    }
  }

 

  /** Atualize os métodos de adicionar formas para enviar dados */
  private addCircle(latlng: L.LatLng): void {
    if (!this.angolaBounds.contains(latlng)) {
      alert('O ponto está fora dos limites de Angola!');
      return;
    }

    const circle = L.circle(latlng, {
      color: 'blue',
      fillOpacity: 0.5,
      radius: 500,
    }).addTo(this.map);

     
    circle.on('click', () => this.removeShape(circle));
    this.shapes.push({ type: 'círculo', shape: circle });
  }


  /** Adiciona um triângulo ao mapa */
  private addTriangle(latlng: L.LatLng): void {
    if (!this.angolaBounds.contains(latlng)) {
      alert('O ponto está fora dos limites de Angola!');
      return;
    }

    if (this.triangleMarkers.length < 3) {
      const marker = L.marker(latlng, { draggable: true }).addTo(this.map);
      this.triangleMarkers.push(marker);

      marker.on('dragend', () => this.updateTriangleShape());

      if (this.triangleMarkers.length === 3) {
        const triangleLatLngs = this.triangleMarkers.map((m) => m.getLatLng());
         // Salva as coordenadas
        this.drawTriangle(triangleLatLngs);
      }
    } else {
      alert('Triângulo completo!');
    }
  }

  
  /** Desenha um triângulo no mapa */
  private drawTriangle(latLngs: L.LatLng[]): void {
    const triangle = L.polygon(latLngs, {
      color: 'red',
      fillOpacity: 0.5,
    }).addTo(this.map);

    triangle.on('click', () => this.removeShape(triangle)); // Permite excluir o triângulo
    this.shapes.push({ type: 'triângulo', shape: triangle });

    this.triangleMarkers.forEach((marker) => this.map.removeLayer(marker)); // Remove os marcadores
    this.triangleMarkers = [];
  }

  /** Atualiza o triângulo ao mover os marcadores */
  private updateTriangleShape(): void {
    const latLngs = this.triangleMarkers.map((marker) => marker.getLatLng());
    const existingTriangle = this.shapes.find((s) => s.type === 'triângulo');
    if (existingTriangle && existingTriangle.shape instanceof L.Polygon) {
      existingTriangle.shape.setLatLngs(latLngs);
    }
  }

  /** Remove uma forma (círculo ou triângulo) do mapa */
  private removeShape(shape: L.Layer): void {
    this.map.removeLayer(shape);
    this.shapes = this.shapes.filter((s) => s.shape !== shape);
  }

  recreateShape(type: string, coordinates: any): void {
    if (type === 'círculo') {
      const circle = L.circle(coordinates, {
        color: 'green',
        radius: 500,
      }).addTo(this.map);
    } else if (type === 'triângulo') {
      const triangle = L.polygon(coordinates, {
        color: 'purple',
        fillOpacity: 0.5,
      }).addTo(this.map);
    }
  }


  public loadingLocation = false;

  public locateUser(): void {
    if (navigator.geolocation) {
      // Utilize o método navigator.geolocation.getCurrentPosition
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success Callback: Localização obtida com sucesso
          const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
  
          if (this.angolaBounds.contains(userLatLng)) {
            // Centralize o mapa na posição do usuário
            this.map.flyTo(userLatLng, 13, {
              animate: true,
              duration: 1.5, // Animação suave (1.5 segundos)
            });
  
            // Adicione um marcador no local do usuário
            L.marker(userLatLng, { title: 'Sua localização' })
              .addTo(this.map)
              .bindPopup('<b>Você está aqui!</b>')
              .openPopup();
          } else {
            // Caso o usuário esteja fora dos limites de Angola
            console.warn('Usuário fora dos limites de Angola.');
            alert('Você está fora dos limites de Angola! O mapa será centralizado no país.');
            this.map.setView(this.angolaBounds.getCenter(), 6);
          }
        },
        (error) => {
          // Error Callback: Falha ao obter a localização
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível acessar sua localização. O mapa será centralizado em Angola.');
          this.map.setView(this.angolaBounds.getCenter(), 6);
        },
        { enableHighAccuracy: true, timeout: 30000 } // Opções
      );
    } else {
      // Caso a geolocalização não seja suportada
      console.warn('Geolocalização não suportada.');
      alert('Seu navegador não suporta geolocalização. O mapa será centralizado em Angola.');
      this.map.setView(this.angolaBounds.getCenter(), 6);
    }
  }
  
}
