import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexResponsive
// } from "ng-apexcharts";
import { AgenteService } from '../../core/service/agente.service';
import { SolicitacaoService } from '../../core/service/solicitacao.service';
import { AgenteArquivoService } from '../../core/service/agente-arquivo.service';
import { AgenteReclamationService } from '../../core/service/agente-reclamation.service';
import { MeiosDistribuidosService } from '@resources/modules/sigpq/core/service/Meios-distribuidos.service';
import { EscalaTrabalhaService } from '../../core/service/escala-trabalha.service';

// export type ChartOptions = {
//   series?: ApexAxisChartSeries;
//   chart?: ApexChart;
//   xaxis?: ApexXAxis;
//   responsive?: ApexResponsive;
// };
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // @ViewChild("chart") chart?: ChartComponent;
  // public chartOptions: Partial<ChartOptions> | any
  public solicitacaoes: any
  public arquivos: any
  public reclamacoes: any
  public escalaTrabalho: any

  public meios: any

  constructor(private agenteService: AgenteService, private solicitacaoService: SolicitacaoService, private agenteArquivo: AgenteArquivoService, private reclamacoesService: AgenteReclamationService, private meiosDistribuidosService: MeiosDistribuidosService, private escalaService: EscalaTrabalhaService) {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "Documentos enviados",
    //       data: [10, 41, 51, 49, 62, 69, 91, 148]
    //     },
    //     {
    //       name: "Documentos recebidos",
    //       data: [20, 61, 71, 89, 22, 79, 81, 18]
    //     },
    //     {
    //       name: "Pedido de férias",
    //       data: [40, 66, 72, 8, 2, 19, 111, 8]
    //     },
    //     {
    //       name: "Notificações recebidas",
    //       data: [0, 1, 1, 8, 12, 0, 100, 18]
    //     },
    //     {
    //       name: "Mensagens enviadas",
    //       data: [60, 1, 7, 0, 2, 49, 8, 48]
    //     }
    //   ],
    //   chart: {
    //     height: 500,
    //     type: 'area'
    //   },
    //   title: {
    //     text: "Minha estáticas"
    //   },
    //   xaxis: {
    //     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {}
    //     }
    //   ],
    //   colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800']
    // }
  }

  ngOnInit(): void {

    this.buscarSolicitacao();
    this.buscarArquivo()
  }
  public buscarSolicitacao(): void {


  }

  buscarArquivo() {
    this.agenteArquivo
      .listar(this.getPessoaId, {})
      .subscribe((response: any) => {
        this.arquivos = response.data;

      });


    this.solicitacaoService.listar({agente_id: this.getPessoaId})
      .subscribe({
        next: (response: any) => {

          this.solicitacaoes = response.data
        },
        error: (error: any) => {
          console.error(error);
        },
      });


    this.reclamacoesService
      .listar(this.getPessoaId, {})
      .subscribe((response: any) => {
        this.reclamacoes = response
      });

    this.meiosDistribuidosService
      .listarMeiosDistribuidos(this.getPessoaId, {})
      .subscribe((response) => {

        this.meios = response

      })

    this.escalaService.listar({ pessoafisicaId: this.getPessoaId }).subscribe({
      next: (response: any) => {
        this.escalaTrabalho = response
      }
    })

  }

  public get getPessoaId() {
    return this.agenteService.id
  }
}

