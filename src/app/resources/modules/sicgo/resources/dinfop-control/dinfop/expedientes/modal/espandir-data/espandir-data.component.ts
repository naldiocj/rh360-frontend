import { Component, Input, OnInit } from '@angular/core';
import { ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import iziToast from 'izitoast';

@Component({
  selector: 'app-expediente-espandir-data',
  templateUrl: './espandir-data.component.html',
  styleUrls: ['./espandir-data.component.css']
})
export class EspandirDataComponent implements OnInit {
  novaDataTermino: string = '';  
  @Input() expediente: any = null;  

  constructor(private expedienteService: ExpedienteService) { }

  ngOnInit() {
    if (this.expediente?.endEditDate) {
      console.log("endEditDate recebido:", this.expediente?.endEditDate);
      const dataFim = new Date(this.expediente?.endEditDate);
      
      if (isNaN(dataFim.getTime())) {
        console.error("Erro ao converter endEditDate para Date.");
        return;
      }
  
      this.novaDataTermino = this.formatarData(dataFim);
    }
  }
  

  get maxDataPermitida(): string {
    if (!this.expediente?.endEditDate) return '';

    const dataFim = this.adicionarDiasUteis(new Date(this.expediente.endEditDate), 90);

    return this.formatarData(dataFim);
  }

  prorrogarExpediente() {
    if (!this.novaDataTermino) {
      alert('Selecione uma nova data de término válida.');
      return;
    }
  
    if (!this.expediente || this.expediente.length === 0) {
      console.error("Nenhum expediente encontrado!");
      return;
    }
    
    const expedienteId = this.expediente?.id;
    
    if (!expedienteId) {
      console.error("ID do expediente não encontrado!");
      return;
    }
    
    console.log('Nova data de término selecionada:', this.novaDataTermino);
  
    // Converter a string 'YYYY-MM-DD' para um objeto Date
    const dataProrrogada = new Date(this.novaDataTermino + 'T00:00:00'); 

    this.expedienteService.prorrogarExpediente(expedienteId, dataProrrogada)
      .subscribe(
        response => {
           iziToast.warning({
            title: "Atenção",
            message: "Expediente prorrogado com sucesso!",
            position: "topRight"
          });
          window.location.reload();
        },
        error => { 
          iziToast.warning({
            title: "Atenção",
            message: "Erro ao prorrogar expediente. Verifique os dados e tente novamente.",
            position: "topRight"
          });
          console.error(error);
        }
      );
  }
  

  // Método para adicionar apenas dias úteis (evitando sábados e domingos)
  adicionarDiasUteis(dataInicio: Date, dias: number): Date {
    let result = new Date(dataInicio);
    let addedDays = 0;

    while (addedDays < dias) {
      result.setDate(result.getDate() + 1);

      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }

    return result;
  }

  // Método para formatar a data como 'YYYY-MM-DD' (padrão do input date)
  formatarData(data: Date): string {
    return data.toISOString().split('T')[0];
  }

  getDiasRestantes(endEditDate: string): number {
    const currentDate = new Date(); // Data atual
  
    // Garantir que endEditDate seja um Date válido
    const endDate = new Date(endEditDate);
  
    if (isNaN(endDate.getTime())) {
      throw new Error('Data final inválida.');
    }
  
    let daysRemaining = 0;
    let tempDate = new Date(currentDate);
  
    // Calcular o número de dias úteis restantes
    while (tempDate < endDate) {
      tempDate.setDate(tempDate.getDate() + 1);
      
      // Se não for sábado (6) ou domingo (0), conta como dia útil
      if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        daysRemaining++;
      }
    }
  
    return daysRemaining;
  }
}
