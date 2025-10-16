import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'sicgo-buca-face-dinfop',
  template: `


            <div class=" modal-body bg-light" >
              <div class="modal-header bg-primary text-white">
                <h4 class="modal-title"><b>Registro de Delituoso</b></h4>
                <a
                (click)="stopCamera()"
                type="button"
                    data-bs-dismiss="modal" aria-label="Close"
                  >
                  <i  class="bi bi-backspace-reverse-fill cursor-pointer rounded-lg "
                  style="font-size: 1.2em"></i>
                  </a>
            </div>


                               <div class="col-10 video-wrapper">
                                <video autoplay muted #video></video>
                              </div>

                          <div id="foto" role="tabpanel" aria-labelledby="foto-civil-tab" tabindex="0">






            </div>

  </div>




  `,
  styleUrls: ['./buscar-delituoso.component.css'],
  animations: [
    // Animação para o fade da sobreposição (overlay)

  ]
})
export class BuscarDelituosoComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef;
  result: any = null;
  errorMessage: string | null = null;
  isLoading = false;
  @Input() isCameraActive = false;
  private destroy$ = new Subject<void>();

  constructor(private faceRecognitionService: DinfopDelitousoService) { }

  async ngOnInit() {
    this.isLoading = true;
    try {
      await this.loadModels();
      this.startCamera();
    } catch (error) {
      this.errorMessage = 'Erro ao carregar modelos de detecção facial.';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadModels() {
    const modelUrl = '/assets/assets_sicgo/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      faceapi.nets.ageGenderNet.loadFromUri(modelUrl),
      faceapi.nets.mtcnn.loadFromUri(modelUrl),
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
    ]);
  }

  startCamera() {
    const video = this.videoRef.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } })
      .then(stream => {
        video.srcObject = stream;
        this.detectFace(video);
      })
      .catch(err => {
        this.errorMessage = 'Erro ao acessar a câmera. Verifique as permissões.';
        console.error('Erro ao acessar a câmera: ', err);
      });
  }

  stopCamera() {
    const videoElement = this.videoRef.nativeElement;
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
      this.isCameraActive = false;
    }
  }

  async detectFace(video: HTMLVideoElement) {
    const options = new faceapi.TinyFaceDetectorOptions();

    video.addEventListener('play', async () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const interval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, options)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        if (detections.length > 0) {
          const faceDescriptor = detections[0].descriptor;
         // this.searchFace(faceDescriptor);
        }
      }, 300); // Aumentado para 300ms

      // Limpar intervalo quando o componente for destruído
      this.destroy$.subscribe(() => clearInterval(interval));
    });
  }

 /* searchFace(faceDescriptor: Float32Array) {
    const faceDescriptorString = JSON.stringify(Array.from(faceDescriptor));

    this.faceRecognitionService.searchFacess(faceDescriptorString)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.result = response;
          this.errorMessage = null;
        },
        error => {
          console.error('Erro ao buscar delituoso:', error);
          this.result = null;
          this.errorMessage = 'Nenhum rosto correspondente encontrado.';
        }
      );
  }*/
}
