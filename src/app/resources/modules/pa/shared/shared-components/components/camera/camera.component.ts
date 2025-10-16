import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IziToastService } from '@core/services/IziToastService.service';


@Component({
  selector: 'piips-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnChanges {

  public mediaStream!: any;
  public camera: any
  public cameraOptions: any
  public devices: any
  public canvas!: any
  public fotoFile: any
  public fotoTirada: boolean = false;
  @Output() public onFechar!: EventEmitter<any>
  @Input() public podeAbrir: boolean = false;


  public width: number = 300;
  public height: number = 300;
  public streaming: boolean = false;


  public constraints: any = {
    audio: false,
    video: {
      facingMode: 'user',
      height: { ideal: 300 },
      width: { ideal: 300 },


    }
  }

  public options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }
  constructor(private iziToast: IziToastService) {
    this.onFechar = new EventEmitter<any>()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.podeAbrir == true && changes['podeAbrir'].previousValue != changes['podeAbrir'].currentValue) {
      this.configuracaoInitial()
    }
  }


  public async configuracaoInitial(): Promise<any> {
    this.camera = document.querySelector('#camera') as HTMLVideoElement;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.cameraOptions = document.querySelector('.video-options>select');
    this.devices = await navigator.mediaDevices.enumerateDevices();
    this.fotoTirada = false;
    // this.inicarOnFechar()
    this.fotoFile = null;
    // this.onFechar = new EventEmitter<any>()

    const videoDevices: any = this.devices.filter((device: any) => device.kind === 'videoinput');
    const options: any = videoDevices.map((videoDevice: any) => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });

    this.cameraOptions.innerHTML = options.join('');
    this.constraints.video.deviceId = videoDevices[0].deviceId;
    this.abrirCamera(this.constraints)


  }

  private inicarOnFechar(): void {
    this.onFechar = new EventEmitter<any>()
  }


  private async abrirCamera(constraint: any): Promise<any> {
    try {

      if (navigator.mediaDevices) {

        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraint)

        this.camera.srcObject = this.mediaStream

        this.camera.addEventListener('canplay', (evt: any) => {
          if (!this.streaming) {
            this.height = this.camera.videoHeight / (this.camera.videoWidth / this.width);

            if (isNaN(this.height)) {
              this.height = this.width / (4 / 3);
            }
            this.camera.setAttribute("width", '300');
            this.camera.setAttribute("height", '300');

          }
        })

      }
    } catch (e) {
      this.iziToast.erro('Não foi possível abrir a camera')
    }

  }

  public fecharCamera(): void {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach((track: any) => {
        track.stop();
      })

      this.mediaStream = null;
      this.camera.classList.toggle('d-none')
      this.onFechar.emit({ file: null })
      this.fotoFile = null;
    }
  }

  public handlerDevices(event: any) {
    this.constraints.video.deviceId = event.target.value;
    this.abrirCamera(this.constraints)
  }

  public tirarFoto() {
    const context = this.canvas.getContext("2d");
    if (this.width && this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      context.drawImage(this.camera, 0, 0, this.width, this.height);

      const data = this.canvas.toDataURL("image/ ");

      const blob = this.download(data, "image/png");
      const file = new File([blob], "image.png", { type: "image/png" });

      if (file) {
        this.fotoTirada = true
        this.fotoFile = file;
      }
    } else {
      return
    }
  }

  public onGuardar() {

    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach((track: any) => {
        track.stop();
      })

      this.mediaStream = null;
      this.onFechar.emit({ file: this.fotoFile })


    }
  }
  public download(data: any, type: any) {
    data = data.replace(`data:${type};base64,`, "");
    const base64 = new Uint8Array(
      atob(data)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const blob = new Blob([base64], { type: type });

    return blob;
  }

}
