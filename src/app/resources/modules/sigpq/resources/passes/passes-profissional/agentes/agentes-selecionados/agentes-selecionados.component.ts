import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, } from 'rxjs';
import { ListarComponent } from '../../listar/listar.component';
import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation';

@Component({
  selector: 'app-agentes-selecionados',
  templateUrl: './agentes-selecionados.component.html',
  styleUrls: ['./agentes-selecionados.component.css']
})
export class AgentesSelecionadosComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @Input() agentesSelecionados: any
  @ViewChild(ListarComponent) listarComponent!: ListarComponent;

  constructor(
    public funcValidacao: FuncionarioValidation,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

  }

  removerAgenteSelecionado(item: any) {
    const posicao = this.agentesSelecionados.findIndex((o: any) => o.id === item.id);
    this.agentesSelecionados.splice(posicao, 1)
  }

  removerTodos() {
    this.agentesSelecionados.splice(0, this.agentesSelecionados.length)
  }

  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
