import { Component, OnInit } from '@angular/core';
import { NipService } from '../../core/service/nip.service';
import { GuiaService } from '../../core/service/guia.service';
import { QrService } from '../../core/service/qr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public numNip: number = 0;
  public numQr: number = 0;
  public numGuia: number = 0;

  public ATNip: any;
  public NaNip: any;
  public ATQr: any;

  constructor(
    private nip: NipService,
    private guia: GuiaService,
    private qr: QrService
  ) {}
  ngOnInit(): void {
    this.initValues();
  }

  initValues() {
    this.qr.filtrar().subscribe((par) => {
      this.ATQr = par.filter((p: any) => p.eliminado != 0);
      this.ATQr = this.ATQr.length;
      this.numQr = par.length;
    });

    this.guia.filtrar().subscribe((par) => {
      this.numGuia = par.length;
    });

    this.nip.filtrar().subscribe((par) => {
      this.ATNip = par.filter((p: any) => p.estado == 1);
      this.ATNip = this.ATNip.length;
      this.NaNip = par.filter((p: any) => p.estado == 0);
      this.NaNip = this.NaNip.length;
      this.numNip = par.length;
    });
  }
}
