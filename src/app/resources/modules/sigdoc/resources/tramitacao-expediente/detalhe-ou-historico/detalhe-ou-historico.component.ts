import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntradaExpedienteService } from '@resources/modules/sigdoc/core/service/entrada-expediente.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalhe-ou-historico-modal',
  templateUrl: './detalhe-ou-historico.component.html',
  styleUrls: ['./detalhe-ou-historico.component.css'],
})
export class DetalheOuHistoricoComponent implements OnChanges, OnInit {

  @Input() documentoId!: number;
  public detalhedocumento: any;
  public loading: boolean = false;

  constructor(private correspondenciaService: EntradaExpedienteService) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if(this.documentoId) {
      this.buscarDetalheDocumento();
    }
  }

  public carregarDetalhe(id: number): void {
    this.documentoId = id;
    this.buscarDetalheDocumento();
}


private buscarDetalheDocumento() {
  if (!this.documentoId) return;
  
  this.loading = true;
  this.correspondenciaService
    .listarUm(this.documentoId)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (response) => {
        console.log("Ver Detalhes ", response); // Para verificar a resposta
        this.detalhedocumento = response;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes:', err); // Para verificar erros
        this.detalhedocumento = null;
      }
    });
}


}
