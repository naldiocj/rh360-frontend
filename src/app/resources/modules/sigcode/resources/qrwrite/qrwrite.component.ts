import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IziToastService } from '@core/services/IziToastService.service';
@Component({
  selector: 'app-qrwrite',
  templateUrl: './qrwrite.component.html',
  styleUrls: ['./qrwrite.component.css'],
})
export class QrwriteComponent implements OnInit {
  public valor: any;
  public link!: SafeResourceUrl;
  public img: string = 'Gerer qualquer codigo qr';
  public formQr!: FormGroup;
  constructor(
    private toast: IziToastService,
  ) {}

  ngOnInit(): void {}
  public start() {
    console.log(this.valor);
    if (this.valor != null) {
      this.baixarQr()
    } else {
      this.toast.alerta('Preencha para gerar o qrcode!');
    }
  }

  public pegarData($event: any) {
    this.img = $event;
  }
  public getQr(event: SafeUrl) {
    this.link = event;
    console.log(event);
  }

  private async baixarQr(){
    const a:any = document.createElement('a');
    a.href = await this.link;
     a.download = 'imagem.png'; // Nome do arquivo que será baixado
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // window.URL.revokeObjectURL(this.link);
  }
}
