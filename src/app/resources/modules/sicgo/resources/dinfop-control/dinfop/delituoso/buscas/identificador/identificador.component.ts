import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-identificador',
  templateUrl: './identificador.component.html',
  styleUrls: ['./identificador.component.css']
})
export class IdentificadorComponent implements OnInit {
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  public detectedAge: number | null = null;
  public detectedGender = '';
  public detectedEmotion = '';
  public isGuiding = false;
  public guidanceText = '';
  public guidanceDirection = '';
  public isCameraActive = false;
  public capturedImages: string[] = [];
  public recognitionResults: any[] = [];
  public isFaceMatched = false;
  public matchConfidence = 0;
  public activeFeature: 'detection' | 'emotion' | 'demographics' | 'recognition' = 'detection';
  public isCameraSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  public currentCamera: 'user' | 'environment' = 'user';
  public faceDescriptors: string[] = [];
  public isLoading = false;

  private readonly modelUrl = 'assets/assets_sicgo/models/';
  private readonly videoConfig = { width: 400, height: 400 };
  private stream: MediaStream | null = null;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.loadModels();
  }

  private async loadModels() {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(this.modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(this.modelUrl),
        faceapi.nets.faceExpressionNet.loadFromUri(this.modelUrl),
        faceapi.nets.ageGenderNet.loadFromUri(this.modelUrl),
        faceapi.nets.ssdMobilenetv1.loadFromUri(this.modelUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(this.modelUrl)
      ]);
      console.log('✅ Modelos carregados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao carregar modelos:', error);
    }
  }

  public toggleCamera() {
    this.isCameraActive ? this.stopCamera() : this.startCamera();
  }

  public async startCamera() {
    if (!this.isCameraSupported) {
      alert('Seu navegador não suporta acesso à câmera.');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: this.videoConfig });
      const video = this.videoContainer.nativeElement;
      video.srcObject = this.stream;
      this.isCameraActive = true;

      video.onloadedmetadata = () => {
        video.play();
        this.detectFaceInRealTime(video);
      };
    } catch (error) {
      console.error('❌ Erro ao acessar a câmera:', error);
      alert('Erro ao acessar a câmera.');
    }
  }

  public stopCamera() {
    const video = this.videoContainer.nativeElement;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      this.isCameraActive = false;
    }
  }

  public captureImage(): string {
    const video = this.videoContainer.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return '';
  }

  private async detectFaceInRealTime(video: HTMLVideoElement) {
    const parent = this.videoContainer.nativeElement.parentElement;
    const canvas = faceapi.createCanvasFromMedia(video);
    parent?.querySelector('canvas')?.remove(); // Remover canvas antigo
    parent?.appendChild(canvas);

    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0', left: '0', right: '0',
      zIndex: '1', pointerEvents: 'none',
      width: `${video.videoWidth}px`,
      height: `${video.videoHeight}px`
    });

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detectLoop = async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length) {
        const resized = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);

        for (const d of resized) {
          await this.searchInDatabase(d.descriptor);
          this.drawExtraInfo(ctx, d);
        }
      }

      requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }

  private drawExtraInfo(ctx: CanvasRenderingContext2D, detection: faceapi.WithFaceDescriptor<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>>>>) {
    const { x, y, width, height } = detection.detection.box;
    const age = Math.round(detection.age);
    const gender = detection.gender === 'male' ? 'Masculino' : 'Feminino';

    const expressions = detection.expressions;
    const emotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a as keyof typeof expressions] > expressions[b as keyof typeof expressions] ? a : b
    );

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(`Idade: ${age}`, x, y - 40);
    ctx.fillText(`Gênero: ${gender}`, x, y - 25);
    ctx.fillText(`Emoção: ${emotion}`, x, y - 10);
  }

  public async processImageForDescriptor(imageSrc: string): Promise<Float32Array | null> {
    const img = await faceapi.fetchImage(imageSrc);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn("❗ Nenhum rosto detectado.");
      return null;
    }

    return detection.descriptor;
  }

  public async searchInDatabase(descriptor: Float32Array) {
    this.isLoading = true;

    try {
      const response = await this.http.post<FaceSearchResponse>(
        'http://127.0.0.1:3333/api/v1/sicgo/dinfop_delitouso/face-search',
        { facedata: Array.from(descriptor) }
      ).toPromise();

      if (response) {
        this.isFaceMatched = response.match;
        this.matchConfidence = response.confidence;

        if (response.match && response.user) {
          console.log('🔎 Usuário reconhecido:', response.user);
        }

        if (response.object?.facedata) {
          const stored = new Float32Array(response.object.facedata[0]);
          console.log('🎯 Descriptor armazenado:', stored);
        }
      }
    } catch (error) {
      console.error("❌ Erro na busca facial:", error);
    } finally {
      this.isLoading = false;
    }
  }
}

interface FaceSearchResponse {
  match: boolean;
  confidence: number;
  user?: any;
  object?: { facedata?: number[][] };
}
