import { Component, Input, OnInit } from '@angular/core'; 
import { DinfopDelituosoOrigemService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_delituoso_origem.service';
@Component({
  selector: 'app-sicgo-lista-origem',
  templateUrl: './lista-origem.component.html',
  styleUrls: ['./lista-origem.component.css']
})
export class ListaOrigemComponent implements OnInit {
  @Input() entidadeIdentificadora: any = [];
   public DelituosoOrigem: any = [];
  constructor(private dinfopDelituosoOrigemService:DinfopDelituosoOrigemService) { }

  ngOnInit(): void {
  }

  Editar(origin: any): void {
    this.dinfopDelituosoOrigemService.updateOrigem(origin); 
  }

  
  public setAr(data: any): void {
    // Filtra apenas os campos desejados
    this.DelituosoOrigem = {
      origem_id: data.id || 0,
      delituoso_id: data.delituoso_id || 0,
    };
    
    console.log('Dados filtrados:', this.DelituosoOrigem);
    this.dinfopDelituosoOrigemService.updateDelituoso(this.DelituosoOrigem);
  }
  
   
  canAddActivity(record: any): boolean {
    const today = new Date();
    const endEditDate = new Date(record.endEditDate);
    return today <= endEditDate; // Verifica se ainda está dentro do prazo
  }
}
