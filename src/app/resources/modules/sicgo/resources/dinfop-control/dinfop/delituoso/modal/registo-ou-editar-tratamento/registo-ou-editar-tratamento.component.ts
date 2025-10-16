import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DelituosoTratamentoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/delituoso_tratamento/delituoso_tratamento.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-registo-ou-editar-tratamento',
  templateUrl: './registo-ou-editar-tratamento.component.html',
  styleUrls: ['./registo-ou-editar-tratamento.component.css']
})
export class RegistoOuEditarTratamentoComponent implements OnInit {
  @Input() delituosoId: any = [];
  @Output() eventRegistarOuEditar = new EventEmitter<any>();
  isLoading: boolean = true;
  descricao = '';
  stado: any = [];
  constructor(
    private dinfopDelitousoService: DinfopDelitousoService,
    private delituosoTratamentoService: DelituosoTratamentoService) { }

  ngOnInit(): void {
  }
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

   // Função para controlar o status dos delituosos
    Status(items: any, id: Number, descricao: string): void {
      if (!items || !id) {
        console.error('Item inválido ou ID não encontrado.');
        return;
      }
    
      // Verifique o estado atual e determine o novo estado
      const estadoAtual = items.status;
      const novoEstado = estadoAtual === 'Ativo' ? 'Passivo' : 'Ativo';
    
      // Atualize localmente para feedback imediato
      const estadoAnterior = items.status; // Salva o estado anterior
      items.status = novoEstado;
    
      // Inicia o processo de atualização no backend
      this.isLoading = true;
    
      this.delituosoTratamentoService
        .status1(id, novoEstado, descricao) // Envia o estado correto para o backend
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            console.log(`Status do ID ${items.id} alterado de '${estadoAtual}' para '${novoEstado}' com sucesso.`);
             // Atualiza a lista após sucesso
             // Emite evento para o componente pai
            this.eventRegistarOuEditar.emit(true); // Indica que a operação foi concluída
          },
          error: (error: any) => {
            console.error('Erro ao alterar status:', error);
            alert('Não foi possível alterar o status. Tente novamente.');
            items.status = estadoAnterior; // Reverte o estado local em caso de erro
          },
        });
    }

 
}
