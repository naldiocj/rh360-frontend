import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';

@Component({
  selector: 'app-sicgo-busca-facial-delituoso',
  templateUrl: './busca-facial-delituoso.component.html',
  styleUrls: ['./busca-facial-delituoso.component.css'],
})
export class BuscaFacialComponent implements OnInit, AfterViewInit {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @Input() isCameraActive = false;
backendBaseUrl = 'http://localhost:3333';
  result: any = null;
  errorMessage: string | null = null;
  private isLocked = false;
  private modelsLoaded = false;

  loading = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private faceRecognitionService: DinfopDelitousoService
  ) {}

  /** Lifecycle: carrega modelos e lista de fotografias */
  async ngOnInit(): Promise<void> {
    try {
      await this.loadModels();
      this.modelsLoaded = true;
      console.log('Modelos carregados e prontos para uso.');
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      this.errorMessage = 'Erro ao carregar modelos de reconhecimento facial.';
    }
  }

  private async loadModels() {
    const modelUrl = 'assets/assets_sicgo/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      faceapi.nets.ageGenderNet.loadFromUri(modelUrl),
      faceapi.nets.mtcnn.loadFromUri(modelUrl),
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
    ]);
  }

  startCamera() {
    if (!this.modelsLoaded) {
      this.errorMessage = 'Modelos de reconhecimento facial não carregados.';
      console.error(this.errorMessage);
      return;
    }

    const video = this.videoRef.nativeElement;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          video.play();
          this.detectFaceInRealTime(video);
        });
      })
      .catch((err) => {
        console.error('Erro ao acessar a câmera:', err);
        this.errorMessage = 'Erro ao acessar a câmera.';
      });
  }

  stopCamera() {
    const videoElement = this.videoRef.nativeElement;
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
      this.isCameraActive = false;
    }
  }

  async detectFaceInRealTime(videoElement: HTMLVideoElement) {
    const parentElement = this.videoRef.nativeElement.parentElement;

    videoElement.onplay = async () => {
      const existingCanvas = parentElement?.querySelector('canvas');
      if (existingCanvas) existingCanvas.remove();

      const detectionOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.6,
      });

      const canvas = faceapi.createCanvasFromMedia(videoElement);
      parentElement?.appendChild(canvas);

      Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '20px',
        right: '0',
        zIndex: '1',
        pointerEvents: 'auto',
        width: `${videoElement.videoWidth}px`,
        height: `${videoElement.videoHeight}px`,
      });

      const displaySize = {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const detectFaces = async () => {
        const detections = await faceapi
          .detectSingleFace(videoElement, detectionOptions)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          requestAnimationFrame(detectFaces);
          return;
        }

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const context = canvas.getContext('2d');

        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          context.globalCompositeOperation = 'source-over';
          context.beginPath();
          context.fillStyle = 'rgba(0, 0, 0, 0.7)';

          const landmarks = resizedDetections.landmarks;
          landmarks.positions.slice(0, 5).forEach((point, i) => {
            if (i === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          });

          context.closePath();
          context.fill();

          // Enviar para busca se necessário:
          //this.searchFace(detections.descriptor);
        }

        requestAnimationFrame(detectFaces);
      };

      detectFaces();
    };
  }

async handleSearchFace() {
  this.loading = true;
  this.result = null;
  this.errorMessage = null;

  const video = this.videoRef.nativeElement;

  try {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      this.result = null;
      this.loading = false;
      return;
    }

    const faceData = Array.from(detections.descriptor);
    this.searchFace(faceData);
  } catch (err: any) {
    this.errorMessage = 'Erro ao capturar rosto: ' + (err.message || 'desconhecido');
    this.loading = false;
  }
}

searchFace(facedata: number[]) {
  this.faceRecognitionService.searchFacess(facedata).subscribe({
    next: (res) => {
      // Só exibe dados se houver match e confiança >= 30%
      if (res.match && res.confidence >= 0.3) {
        this.result = res;
      } else {
        this.result = {
          match: false,
          confidence: res.confidence || 0
        };
      }

      this.loading = false;
      this.errorMessage = null;
    },
    error: (err) => {
      this.errorMessage = 'Erro ao procurar rosto: ' + (err.error?.message || err.message);
      this.result = null;
      this.loading = false;
    }
  });
}

  ngAfterViewInit(): void {
    const inputs = this.el.nativeElement.querySelectorAll('#radiento input');
    inputs.forEach((input: HTMLInputElement) => {
      this.renderer.listen(input, 'click', (event: Event) => {
        if (performance.mark) performance.mark('click');
        this.syncCheckedStateToAttribute(
          inputs,
          event.target as HTMLInputElement
        );
      });
    });

    const observer = new MutationObserver(async (mutations) => {
      if (this.isLocked) return;
      const checkedMutations = mutations.filter(
        (m) => m.type === 'attributes' && m.attributeName === 'checked'
      );
      if (checkedMutations.length !== 2) return;

      if (performance.mark) performance.mark('mutation-process');
      this.isLocked = true;

      const [mutation1, mutation2] = checkedMutations;
      const checked1 = (mutation1.target as HTMLInputElement).checked;
      const checked2 = (mutation2.target as HTMLInputElement).checked;

      (mutation1.target as HTMLInputElement).checked = !checked1;
      (mutation2.target as HTMLInputElement).checked = !checked2;

      const transition = (document as any).startViewTransition(() => {
        (mutation1.target as HTMLInputElement).checked = checked1;
        (mutation2.target as HTMLInputElement).checked = checked2;
      });

      await transition.ready;
      if (performance.mark) performance.mark('vt-ready');
      this.isLocked = false;
    });

    observer.observe(this.el.nativeElement.querySelector('#radiento'), {
      subtree: true,
      attributes: true,
    });
  }

  private syncCheckedStateToAttribute(
    candidates: NodeListOf<HTMLInputElement>,
    target: HTMLInputElement
  ): void {
    if (target.hasAttribute('checked')) return;
    const prevTarget = Array.from(candidates).find((candidate) =>
      candidate.hasAttribute('checked')
    );
    if (prevTarget) prevTarget.removeAttribute('checked');
    target.setAttribute('checked', '');
  }
}
