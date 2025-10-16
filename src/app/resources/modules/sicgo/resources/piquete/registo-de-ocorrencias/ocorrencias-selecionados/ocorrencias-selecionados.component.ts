import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListarOcorrenciaComponent } from '../../listar/listar.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ocorrencias-selecionados',
  templateUrl: './ocorrencias-selecionados.component.html',
  styleUrls: ['./ocorrencias-selecionados.component.css']
})
export class OcorrenciasSelecionadosComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @Input() ocorrenciasSelecionados: any
  @ViewChild(ListarOcorrenciaComponent) listarComponent!: ListarOcorrenciaComponent;

  constructor( 
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

  }

  removerOcorrenciaSelecionado(item: any) {
    const posicao = this.ocorrenciasSelecionados.findIndex((o: any) => o.id === item.id);
    this.ocorrenciasSelecionados.splice(posicao, 1)
  }

  removerTodos() {
    this.ocorrenciasSelecionados.splice(0, this.ocorrenciasSelecionados.length)
  }

  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
