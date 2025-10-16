import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';

@Component({
  selector: 'app-ver-um-direcao',
  templateUrl: './ver-um-direcao.component.html',
  styleUrls: ['./ver-um-direcao.component.css'],
})
export class VerUmDirecaoComponent implements OnInit {
  public correspondencia: any;
  public documentoId: any
  public outCorrespondencia: any

  public estados = [
    {
      cor: '#FFA500',
      texto: 'Pendente'
    },  
    {
      cor: '#8B4513',
      texto: 'Recebido',
    },
    {
      cor: '#4682B4',
      texto: 'Em Tratamento',
    },
    /*{
      cor: '#826AF9',
      texto: 'Expedido',
    },*/ 
    {
      cor: 'rgb(64, 232, 22)',
      texto: 'Despacho'
    },
    /*{
      cor: '#E31212',
      texto: 'Saida'
    },*/
    {
      cor: '#000000',
      texto: 'Parecer'
    },
    {
      cor: '#FFFF00',
      texto: 'Pronuciamento'
    },
    ]
  constructor(
    private correspondenciaService: CorrespondenciaService,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.buscarCorrespondencia();

  }
  public buscarCorrespondencia() {
    this.correspondenciaService
      .listarUm(this.getId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.correspondencia = response;
        },
      });
  }

  public get getId() {
    return this.route.snapshot.params['id'];
  }
  public get getTipo() {
    return this.route.snapshot.params['tipo'];
  }

  public get eEnviada() {
    return this.getTipo.toString().includes('enviado');
  }

  public get eRecebida() {
    return this.getTipo.toString().includes('recebido');
  }

  public capitalize(text: any) {
    return this.utilService.getCapitalize(text)
  }
  public setDocumentoId(id: number | null) {
    this.documentoId = id
  }

  public setCorrespondencia(correspondencia: any) {
    this.outCorrespondencia = correspondencia
  }
}

