import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';

@Component({
  selector: 'app-listar-documento',
  templateUrl: './listar-documento.component.html',
  styleUrls: ['./listar-documento.component.css']
})
export class ListarDocumentoComponent implements OnInit {

 public correspondencia: any;
  public documentoId: any
  public outCorrespondencia: any

  public estados = [
    {
      cor: '#FFA500',
      texto: 'Normal'
    },  
    {
      cor: '#006400',
      texto: 'Confidencial',
    },
    {
      cor: '#FF0000',
      texto: 'Secreto',
    },
    {
      cor: 'rgb(0, 0, 0)',
      texto: 'Muito Secreto',
    },
    {
      cor: 'rgb(64, 232, 22)',
      texto: 'Empresárial'
    }
    ]

  corStatus(status: string): string {
    switch (status) {
      case 'Normal':
        return '#FFA500'; //Laranja - Urgente
      case 'Secreto': 
        return '#FF0000'; //Vermelho - Secreto
      case 'Muito Secreto': 
        return 'rgb(0, 0, 0)'; //Vermelho - Secreto
      case 'Confidencial':
        return '#006400';
      case 'Empresário':
        return 'rgb(64, 232, 22)'; //Verde escuro - Confidecial
      default:
        return 'transparent';
    }
  }

  constructor(
    private correspondenciaService: CorrespondenciaService,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    //this.buscarCorrespondencia();

  }
  /*public buscarCorrespondencia() {
    this.correspondenciaService
      .listarUm(this.getId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.correspondencia = response;
        },
      });
  }*/

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