import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { SeccaoService } from '@resources/modules/sigdoc/core/service/seccao.service';

@Component({
  selector: 'app-ver-um-seccao',
  templateUrl: './ver-um-seccao.component.html',
  styleUrls: ['./ver-um-seccao.component.css'],
})
export class VerUmSeccaoComponent implements OnInit {
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
    },]

    public seccaoId: any;  

  constructor(
    private seccaoService: SeccaoService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private secureService: SecureService
  ) { this.seccaoId = this.getSeccaoNome; }

  ngOnInit(): void {
    this.buscarCorrespondencia();

  }
  public buscarCorrespondencia() {
    this.seccaoService
      .listarUm(this.getId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.correspondencia = response;
        },
      });
  }

  public get getSeccaoNome() {
    return this.secureService.getTokenValueDecode()?.orgao_detalhes?.sigpq_tipo_seccao.nome_completo;
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

