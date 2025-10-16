import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DinfopDelitousoFotoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/foto_delitouso.service';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'sicgo-registo-facial',
  templateUrl: './registo-facial.component.html',
  styleUrls: ['./registo-facial.component.css']
})
export class RegistoFacialComponent implements OnInit {
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas')
  public canvasRef!: ElementRef;
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();
  public useCamera = true; // Define se o usuário quer usar a câmera ou fazer upload manual
// Propriedades de estado
public isGuiding: boolean = false;
public guidanceText: string = '';
public guidanceDirection: string = '';
  public isCameraSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  public currentCamera: 'user' | 'environment' = 'user';
  public capturedImages: string[] = [];
  public faceDescriptors: string[] = [];
  public isLoading = false;
  public isCameraActive = false;
  private stream: MediaStream | null = null;
  @Input() public ocorrenciId: any;

  constructor(
    private http: HttpClient,
    private elRef: ElementRef,
    private dinfopDelitousoService: DinfopDelitousoFotoService
  ) { }

  ngOnInit() {
    // Inicialização se necessário
    this.loadModels();
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
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
    ]);
  }
  ngAfterViewInit() {
    if (!this.videoContainer) {
      console.error('Elemento videoContainer não foi encontrado ou não está inicializado.');
    }
  }

  public async startCamera() {
    if (this.isCameraActive) return;

    // Verifica suporte ao getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia não é suportado neste navegador.');
      alert('Seu navegador não suporta acesso à câmera.');
      return;
    }

    // Verifica se o elemento `videoContainer` foi inicializado
    if (!this.videoContainer || !this.videoContainer.nativeElement) {
      console.error('Elemento videoContainer não foi encontrado ou não está inicializado.');
      alert('Erro interno: Não foi possível acessar o elemento de vídeo.');
      return;
    }

    try {
      // Tenta acessar a câmera com as configurações fornecidas
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      const videoElement = this.videoContainer.nativeElement;
      videoElement.srcObject = videoStream;
      this.isCameraActive = true;

      // Detecção contínua de rosto na câmera
      this.detectFaceInRealTime(videoElement);
    } catch (error: any) {
      // Trata diferentes erros
      console.error('Erro ao acessar a câmera:', error);
      switch (error.name) {
        case 'NotAllowedError':
          alert('Permissão para acessar a câmera foi negada. Verifique as permissões do navegador.');
          break;
        case 'NotFoundError':
          alert('Nenhuma câmera encontrada no dispositivo.');
          break;
        case 'OverconstrainedError':
          alert('As configurações da câmera são incompatíveis com o dispositivo.');
          break;
        default:
          alert('Erro desconhecido ao acessar a câmera.');
      }
    }
  }


  detection: any;
  displayValues: any;
  resizedDetections: any;
  canvas: any;
  displaySize: any;
  vid: any;
  ctx: any;

  async detectF() {
    // this.vid = document.getElementById('video');
    this.elRef.nativeElement
      .querySelector('video')
      .addEventListener('play', async () => {
        this.canvas = await faceapi.createCanvasFromMedia(this.vid);
        // console.log(this.video);
        const canvasContainer = document.getElementById('canvasEL');

        if (canvasContainer !== null) {
          // Só executa se o elemento com ID 'canvasEL' foi encontrado
          canvasContainer.appendChild(this.canvas);
          this.canvas.setAttribute('id', 'canvass');
          this.canvas.setAttribute(
            'style',
            `position: fixed;
            top: 0;
            left: 0;`
          );
        } else {
          console.error("Elemento com id 'canvasEL' não encontrado!");
        }

        this.displaySize = {
          width: this.vid.width,
          height: this.vid.height,
        };
        faceapi.matchDimensions(this.canvas, this.displaySize);
        setInterval(async () => {
          this.detection = await faceapi
            .detectAllFaces(this.vid, new faceapi.TinyFaceDetectorOptions({
              inputSize: 320, // Aumenta a resolução da detecção
              scoreThreshold: 0.5  // Ajusta a confiança mínima para considerar uma detecção válida
            }))
            .withFaceLandmarks()
            .withFaceExpressions();

          this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );

          this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
          // faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
          faceapi.draw.drawDetections(this.canvas, this.resizedDetections.map((detection: any) => {
            const detectionCopy = { ...detection };
            const newBox = detectionCopy.detection.box;

            // Aumenta o tamanho da caixa de detecção
            newBox.width *= 1.2;  // Aumenta 20% a largura da caixa
            newBox.height *= 1.2; // Aumenta 20% a altura da caixa

            // Ajusta a posição da caixa para manter o centro
            newBox.x -= (newBox.width - detectionCopy.detection.box.width) / 2;
            newBox.y -= (newBox.height - detectionCopy.detection.box.height) / 2;

            return detectionCopy;
          }));

          faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
          faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);
        }, 100);
      });
  }
  public stopCamera() {
    const videoElement = this.videoContainer.nativeElement;
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
      this.isCameraActive = false;
    }
  }

  private captureImage(): string {
    const videoElement = this.videoContainer.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return '';
  }

  public captureFrontal() {
    this.captureAndStoreImage(0, 'Posicione o rosto frontalmente e clique em OK para capturar a imagem.');
  }

  public captureLateralDireita() {
    this.captureAndStoreImage(1, 'Posicione o rosto para o lado direito e clique em OK para capturar a imagem.');
  }

  public captureLateralEsquerda() {
    this.captureAndStoreImage(2, 'Posicione o rosto para o lado esquerdo e clique em OK para capturar a imagem.');
  }

  public captureNuca() {
    this.captureAndStoreImage(3, 'Posicione o rosto para o lado da nuca e clique em OK para capturar a imagem.');
  }

  public async autoCapture() {
    if (!this.isCameraActive) {
      alert('A câmera não está ativa. Por favor, ligue a câmera primeiro.');
      return;
    }

    const video = this.videoContainer.nativeElement;
    const requiredAngles = ['frontal', 'left', 'right', 'back'];

    for (const angle of requiredAngles) {
      await this.guideUserPosition(angle);
      const image = this.captureImage();
      this.capturedImages.push(image);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Captura automática concluída:', this.capturedImages);
  }

  private async guideUserPosition(angle: string) {
    const guidanceMessages = {
      frontal: 'Por favor, olhe diretamente para a câmera',
      left: 'Vire lentamente para a esquerda',
      right: 'Vire lentamente para a direita',
      top: 'Incline a cabeça para cima'
    };

    this.guidanceText = guidanceMessages[angle as keyof typeof guidanceMessages];
    this.isGuiding = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.isGuiding = false;
        resolve(null);
      }, 2000);
    });
  }

  private captureAndStoreImage(index: number, message: string) {
    alert(message);
    setTimeout(() => {
      const image = this.captureImage();
      this.capturedImages[index] = image;
      // Processa os descriptors apenas para a foto frontal (índice 0)
      if (index === 0) {
        this.processImageForDescriptor(image, index);
      }
    }, 1000);
  }

  private async processImageForDescriptor(image: string, index: number) {
    const imgElement = await faceapi.fetchImage(image);
    const fullFaceDescription = await faceapi
      .detectSingleFace(imgElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    if (fullFaceDescription) {
      const faceDescriptor = fullFaceDescription.descriptor;
      this.faceDescriptors[index] = JSON.stringify(Array.from(faceDescriptor)); // Armazena o descriptor facial
    } else {
      alert('Nenhum rosto detectado na imagem capturada.');
    }
  }
  

  async toggleCamera() {
    if (!this.isCameraActive) {
      await this.startCamera();
      this.isCameraActive = true;
    } else {
      this.useCamera = !this.useCamera;
      await this.startCamera();
    }
  }


  public async onSubmit() {
    if (this.capturedImages.length < 4) {
      alert('Por favor, capture todas as três imagens antes de enviar.');
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    try {
      const request$ = this.buscarId()
        ? this.dinfopDelitousoService.editar(formData, this.buscarId())
        : this.dinfopDelitousoService.registar(formData);

      await request$.toPromise();
      setTimeout(() => {
        window.location.reload();
      }, 400);
      this.eventRegistarOuEditar.emit(true);
      this.resetForm();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }


  handleFileUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.capturedImages[index] = base64String; // Armazena a imagem no índice correto
      };
      reader.readAsDataURL(file);
    }
  }



  private prepareFormData(): FormData {
    const formData = new FormData();

    this.capturedImages.forEach((image, index) => {
      const file = this.convertBase64ToBlob(image);
      formData.append(`image_${index}`, file, `image_${index}.png`);
      // Adiciona o descriptor apenas para a foto frontal (índice 0)
      if (index === 0 && this.faceDescriptors[index]) {
        formData.append(`facedata_${index}`, this.faceDescriptors[index]);
      }
    });

    formData.append('delituoso_id', this.getDelituosoId().toString());


    return formData;
  }

  private convertBase64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ab[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }




  public async detectFaceInRealTime(videoElement: HTMLVideoElement) {
    const parentElement = this.videoContainer.nativeElement.parentElement;

    videoElement.onloadedmetadata = async () => {
      console.log('Vídeo carregado com dimensões:', videoElement.videoWidth, videoElement.videoHeight);

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.error('Erro: O vídeo não carregou corretamente.');
        return;
      }

      videoElement.onplay = async () => {
        // Remover canvas existente para evitar sobreposição
        parentElement?.querySelector('canvas')?.remove();

        // Criar um novo canvas para exibição das detecções
        const canvas = faceapi.createCanvasFromMedia(videoElement);
        parentElement?.appendChild(canvas);

        Object.assign(canvas.style, {
          position: 'absolute',
          top: '0',
          left: '20px',
          right: '0',
          zIndex: '1',
          pointerEvents: 'none',
          width: `${videoElement.videoWidth}px`,
          height: `${videoElement.videoHeight}px`
        });

        const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const detectFaces = async () => {
          if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
            console.warn('Vídeo não está pronto ainda.');
            requestAnimationFrame(detectFaces);
            return;
          }

          // Detectar rostos e obter landmarks, expressões, idade e gênero
          const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors();

          const context = canvas.getContext('2d');
          if (!context) {
            console.error('Erro ao obter o contexto do canvas.');
            return;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);

          if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            

            
          }

          requestAnimationFrame(detectFaces);
        };

        detectFaces();

        if (videoElement.readyState === 4) {
          videoElement.play();
        }
      };
    };
  }



  private handleError(error: any) {
    const errorMessage = error.error?.message || `Erro desconhecido ao enviar as imagens. Status: ${error.status}`;
    console.error('Erro ao enviar imagens:', errorMessage);
    alert(errorMessage);
  }

  getDelituosoId(): number {
    return this.delituosoId as number;
  }

  private buscarId(): number | null {
    return null;
  }

  private resetForm(): void {
    this.capturedImages = [];
  }


  public removeImage(index: number) {
    this.capturedImages[index] = '';
  }
}
