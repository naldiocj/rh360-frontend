import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs'

import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation'
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-sigpq-mobilidade-ver-selecionados',
  templateUrl: './ver-selecionados.component.html',
  styleUrls: ['./ver-selecionados.component.css']
})
export class VerSelecionadosComponent implements OnInit {

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
