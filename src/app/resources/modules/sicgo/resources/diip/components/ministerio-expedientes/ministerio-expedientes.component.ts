import { Component, OnInit } from '@angular/core';
import { ExpedienteDiipService } from '@resources/modules/sicgo/core/service/piquete/iip/diip/expediente-diip.service';
import { Expediente } from '@resources/modules/sicgo/shared/model/diit';

 
@Component({
  selector: 'app-ministerio-expedientes',
  templateUrl: './ministerio-expedientes.component.html',
  styleUrls: ['./ministerio-expedientes.component.css']
})
export class MinisterioExpedientesComponent implements OnInit {
  expedientes: any[]= [];
  public estados = [
    {
      cor: '#cc0000',
      texto: 'Pendente',
    },
    {
      cor: '#ffcc00',
      texto: 'Em andamento',
    },
    {
      cor: '#00cc00',
      texto: 'Concluido',
    },
    {
      cor: 'rgb(0, 143, 251)',
      texto: 'Enviado',
    },
  ];
  public filtro = {
    search: '',
    perPage: 10,
    page: 1,
    tipoOcorrencia: null,
    nivelSeguranca: null,
    controloPrendido: null,
    importancia: null,
    gravidade: null,
    zona_localidade: null,
    enquadramento_legal: null,
    provincias: null,
    municipios: null,
    dataAte: null,
    dataDe: null,
  };
  public options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };
  constructor(private expedienteService: ExpedienteDiipService) { }

  ngOnInit(): void {
    this.carregarExpedientes()
   }
 
   carregarExpedientes() {
     this.expedienteService.listarExpedientesPorResponsavel('MinisterioPublico')
     .subscribe((data: Expediente[]) => {
      // Deserializar testemunhas e evidencias
      this.expedientes = data.map(expediente => {
        return {
          ...expediente,
          testemunhas: JSON.parse(expediente.testemunhas as unknown as string || '[]'),
          evidencias: JSON.parse(expediente.evidencias as unknown as string || '[]')
        };
      });
      console.log(this.expedientes); // Verifique a estrutura dos dados
    });
   }
   
  
  
  remeterMinisterio(id: number) {
    const nup = prompt('Informe o NUP atribuído pelo Ministério Público:')
    if (nup) {
      this.expedienteService.remeterMinisterio(id, nup).subscribe(() => this.carregarExpedientes())
    }
  }
}
