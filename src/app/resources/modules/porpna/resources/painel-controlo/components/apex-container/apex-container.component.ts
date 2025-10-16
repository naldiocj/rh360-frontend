import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'porpna-apex-container',
  templateUrl: './apex-container.component.html',
  styleUrls: ['./apex-container.component.css']
})
export class ApexContainerComponent implements OnInit {

  public chartOptions: Partial<ChartOptions> | any
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Documentos enviados",
          data: [10, 41, 51, 49, 62, 69, 91, 148]
        },
        {
          name: "Documentos recebidos",
          data: [20, 61, 71, 89, 22, 79, 81, 18]
        },
        {
          name: "Pedido de férias",
          data: [40, 66, 72, 8, 2, 19, 111, 8]
        },
        {
          name: "Notificações recebidas",
          data: [0, 1, 1, 8, 12, 0, 100, 18]
        },
        {
          name: "Mensagens enviadas",
          data: [60, 1, 7, 0, 2, 49, 8, 48]
        }
      ],
      chart: {
        height: 500,
        type: 'area'
      },
      title: {
        text: "Minha estáticas"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
      },
      responsive: [
        {
          breakpoint: 480,
          options: {}
        }
      ],
      colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800']
    }
   }

  ngOnInit(): void {
  }

}
