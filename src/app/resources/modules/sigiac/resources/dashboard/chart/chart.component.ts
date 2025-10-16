import { Component, Input, OnInit } from '@angular/core';
import { DisciplinarService } from '@resources/modules/sigpj/core/service/Disciplinar.service';
import { DiversoService } from '@resources/modules/sigpj/core/service/Diverso.service';
import { ReclamacaoService } from '@resources/modules/sigpj/core/service/Reclamacao.service';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpj-dashboard-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  Values = new Array()

  @Input() dashboard: any = null

  public label: string[] = [];
  public numeros: number[] = [];
  public tipo: ChartType = 'doughnut';
  public grafico: any = []

  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  constructor(private disciplinar: DisciplinarService,
    private reclamacao: ReclamacaoService,
    private diverso: DiversoService) { }

  ngOnInit(): void {
    this.inicio()
  }

  inicio(){
    this.label.push('Documentos Pendentes ')
    this.numeros.push(0)
    this.getDiverso()
  }

  getDiverso() {
    this.diverso.listarTotal().pipe(
      finalize(() => {
        this.getReclamacao()
      })).subscribe(response => {
        this.label.push(response.nome)
        this.numeros.push(response.total)
      })
  }

  getReclamacao() {
    this.reclamacao.listarTotal().pipe(
      finalize(() => {
        this.getDisciplinar()
      })).subscribe(response => {
        this.label.push(response.nome)
        this.numeros.push(response.total)
      })
  }

  getDisciplinar() {
    this.disciplinar.listarTotal()
      .pipe(
        finalize(() => { })
      )
      .subscribe(response => {
        
        this.label.push(response.nome)
        this.numeros.push(response.total)

        const label: ChartData<'doughnut'> = {
          labels: this.label,
          datasets: [{ data: this.numeros }]
        };

        this.grafico = label

      })
  }

  get getDashboard() {
    return this.dashboard
  }

}
