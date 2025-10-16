import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { EntradaExpedienteService } from '@resources/modules/sigdoc/core/service/entrada-expediente.service';
import { Pagination } from '@shared/models/pagination';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { finalize } from 'rxjs';
const QRCode = require('qrcode');

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}