import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-sicgo-dinfop-grupo',
  templateUrl: './dashboard-sicgo-dinfop-grupo.component.html',
  styleUrls: ['./dashboard-sicgo-dinfop-grupo.component.css']
})
export class DashboardSicgoDinfopGrupoComponent implements OnInit {
chart: any; // Referência ao gráfico
  total: any;
  totalSuspeitos: number = 0; // Total de suspeitos
  totalDelituosos: number = 0; // Total de delituosos
  porcentagemSuspeitos: number = 0; // Porcentagem de suspeitos
  porcentagemDelituosos: number = 0; // Porcentagem de delituosos

  //grupos
  totalGrupos: any;
  totalDelituososGrupos: number = 0; // Total de delituosos
  porcentagemGrupos: number = 0; // Porcentagem de suspeitos
  porcentagemDelituososGrupos: number = 0; // Porcentagem de delituosos

  chartByProvince: any; // Novo gráfico para delituosos por província
  public provincias: any[] = []; // Lista de províncias
  selectedProvincia: string = 'Luanda'; // Província selecionada
  provinciaStats: { delituosos: number, suspeitos: number } = { delituosos: 0, suspeitos: 0 }; // Estatísticas por província

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private grupo:DinfopGrupoDelitousoService,
    ) { }

  ngOnInit(): void {
    this.getGruposData(); 
  }

 

 // Função para buscar dados da API grupos
 getGruposData() {
  this.grupo.listarTodos({}).subscribe(
    (response: any) => {
      console.log('Dados recebidos da API grupo:', response); // Verificar a resposta completa
      const transformedData = this.transformDataToChartDataGrupo(response); // Passar diretamente se for um array
      console.log('Dados transformados para gráfico grupo:', transformedData);
      this.createChartGrupo(transformedData.labels, transformedData.data); // Criar gráfico
      this.totalGrupos = transformedData.total; // Atualiza o total
      this.totalDelituososGrupos = transformedData.counts.delituosos;
      this.porcentagemGrupos = transformedData.data[0];
      this.porcentagemDelituososGrupos = transformedData.data[1];
      this.cdr.detectChanges(); // Força a atualização da visualização
    },
    (error) => {
      console.error('Erro ao buscar dados da API', error);
    }
  );
}

  // Transformar dados da API em formato para o gráfico
  transformDataToChartDataGrupo(objects: any[]) {
    // Verifica se 'objects' é um array
    if (!Array.isArray(objects)) {
      console.error('Dados fornecidos não são uma lista:', objects);
      return {
        labels: ['Sem Dados'],
        data: [100], // Exibe um gráfico vazio como fallback
        total: 0, // Total como 0 quando não houver dados
        counts: { grupos: 0, delituosos: 0 }
      };
    }

    // Contadores para cada categoria
    const counts = { grupos: 0, delituosos: 0 };

    // Processa cada item para contar as categorias
    objects.forEach((obj) => {
      if (obj) {
        counts.grupos += 1;
      } else if (obj?.delituosos) {
        counts.delituosos += 1;
      }
    });

    // Calcula a porcentagem para cada categoria
    const total = counts.grupos + counts.delituosos;
    const data = total > 0
      ? [
        ((counts.grupos / total) * 100).toFixed(2),
        ((counts.delituosos / total) * 100).toFixed(2),

      ]
      : [0, 0]; // Caso total seja 0

    return {
      labels: ['Grupos', 'Delituosos'],
      data: data.map(Number), // Converte as porcentagens para números
      total: total, // Incluindo o total no retorno
      counts: counts, // Incluindo os totais de cada categoria
    };
  }

  // Criar gráfico com Chart.js
  createChartGrupo(labels: string[], data: number[]) {
    const pieCanvasgrupo = document.getElementById('pieChartGrupos') as HTMLCanvasElement;

    // Verifica se o canvas foi encontrado
    if (!pieCanvasgrupo) {
      console.error('Canvas para o gráfico não encontrado!');
      return;
    }

    const ctx = pieCanvasgrupo.getContext('2d');
    if (!ctx) {
      console.error('Não foi possível obter o contexto 2D do canvas');
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Destruir gráfico anterior, se existir
    }

    // Criar gráfico
    this.chart = new Chart(ctx, {
      type: 'line', // Tipo de gráfico
      data: {
        labels: labels, // Rótulos das categorias
        datasets: [
          {
            data: data, // Dados de percentagens
            backgroundColor: ['#FFCE56', '#FF6384'], // Cores das fatias
            hoverBackgroundColor: ['#FFCE56', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value}%`; // Mostrar percentagem no tooltip
              },
            },
          },
        },
      },
    });
  }

 
 
 

 
    // Função de cálculo de estatísticas
    calculateStats(objects: any[]): { delituosos: number; suspeitos: number } {
      let delituosos = 0;
      let suspeitos = 0;
    
      objects.forEach((obj) => {
        console.log(obj);  // Log para inspecionar os objetos de cada pessoa
        if (obj.stado && obj.stado.estado === 'D') { // Se o campo correto for "estado" ou outro nome
          delituosos += 1;
        } else if (obj.stado && obj.stado.estado === 'S') {
          suspeitos += 1;
        }
      });
    
      return { delituosos, suspeitos };
    }
    
  
    
    
}
