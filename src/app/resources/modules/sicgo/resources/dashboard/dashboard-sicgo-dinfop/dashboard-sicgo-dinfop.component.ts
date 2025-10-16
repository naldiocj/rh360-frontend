import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProvinciaService } from '@resources/modules/sicgo/core/config/Provincia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Chart } from 'chart.js';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-sicgo-dinfop',
  templateUrl: './dashboard-sicgo-dinfop.component.html',
  styleUrls: ['./dashboard-sicgo-dinfop.component.css']
})
export class DashboardSicgoDinfopComponent implements OnInit {
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
    private provinciaService: ProvinciaService,
    private dinfopDelitousoService: DinfopDelitousoService
  ) { }

  ngOnInit(): void {
    this.getDelituososData(); // Carregar dados ao inicializar o componente
    this.getProvincias(); // Carregar lista de províncias
    this.getGruposData(); 
  }

  // Função para carregar a lista de províncias
  // Carregar lista de províncias
  getProvincias(): void {
    this.provinciaService
      .listarTodos({})
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response: any[]) => {
          this.provincias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

 // Função para buscar dados da API grupos
 getGruposData() {
  this.grupo.listarTodos({}).subscribe(
    (response: any) => {
      console.log('Dados recebidos da API grupo:', response); // Verificar a resposta completa
      const transformedData = this.transformDataToChartDataGrupo(response); // Passar diretamente se for um array
      console.log('Dados transformados para gráfico grupo:', transformedData);
      // this.createChartGrupo(transformedData.labels, transformedData.data); // Criar gráfico
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


 
  // Função para buscar dados da API delitusos
  getDelituososData() {
    this.dinfopDelitousoService.listarTodos({}).subscribe(
      (response: any) => {
        console.log('Dados recebidos da API:', response); // Verificar a resposta completa
        const transformedData = this.transformDataToChartData(response); // Passar diretamente se for um array
        console.log('Dados transformados para gráfico:', transformedData);
        this.createChart(transformedData.labels, transformedData.data); // Criar gráfico
        this.total = transformedData.total; // Atualiza o total
        this.totalSuspeitos = transformedData.counts.suspeitos;
        this.totalDelituosos = transformedData.counts.delituosos;
        this.porcentagemSuspeitos = transformedData.data[0];
        this.porcentagemDelituosos = transformedData.data[1];
        this.cdr.detectChanges(); // Força a atualização da visualização
      },
      (error) => {
        console.error('Erro ao buscar dados da API', error);
      }
    );
  }

  // Transformar dados da API em formato para o gráfico
  transformDataToChartData(objects: any[]) {
    // Verifica se 'objects' é um array
    if (!Array.isArray(objects)) {
      console.error('Dados fornecidos não são uma lista:', objects);
      return {
        labels: ['Sem Dados'],
        data: [100], // Exibe um gráfico vazio como fallback
        total: 0, // Total como 0 quando não houver dados
        counts: { suspeitos: 0, delituosos: 0 }
      };
    }

    // Contadores para cada categoria
    const counts = { suspeitos: 0, delituosos: 0 };

    // Processa cada item para contar as categorias
    objects.forEach((obj) => {
      if (obj.stado?.estado === 'S') {
        counts.suspeitos += 1;
      } else if (obj.stado?.estado === 'D') {
        counts.delituosos += 1;
      }
    });

    // Calcula a porcentagem para cada categoria
    const total = counts.suspeitos + counts.delituosos;
    const data = total > 0
      ? [
        ((counts.suspeitos / total) * 100).toFixed(2),
        ((counts.delituosos / total) * 100).toFixed(2),

      ]
      : [0, 0]; // Caso total seja 0

    return {
      labels: ['Suspeitos', 'Delituosos'],
      data: data.map(Number), // Converte as porcentagens para números
      total: total, // Incluindo o total no retorno
      counts: counts, // Incluindo os totais de cada categoria
    };
  }

  // Criar gráfico com Chart.js
  createChart(labels: string[], data: number[]) {
    const pieCanvas = document.getElementById('pieChart') as HTMLCanvasElement;

    // Verifica se o canvas foi encontrado
    if (!pieCanvas) {
      console.error('Canvas para o gráfico não encontrado!');
      return;
    }

    const ctx = pieCanvas.getContext('2d');
    if (!ctx) {
      console.error('Não foi possível obter o contexto 2D do canvas');
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Destruir gráfico anterior, se existir
    }

    // Criar gráfico
    this.chart = new Chart(ctx, {
      type: 'pie', // Tipo de gráfico
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
  // Criar gráfico com Chart.js
  // createChartGrupo(labels: string[], data: number[]) {
  //   const pieCanvasgrupo = document.getElementById('pieChartGrupos') as HTMLCanvasElement;

  //   // Verifica se o canvas foi encontrado
  //   if (!pieCanvasgrupo) {
  //     console.error('Canvas para o gráfico não encontrado!');
  //     return;
  //   }

  //   const ctx = pieCanvasgrupo.getContext('2d');
  //   if (!ctx) {
  //     console.error('Não foi possível obter o contexto 2D do canvas');
  //     return;
  //   }

  //   if (this.chart) {
  //     this.chart.destroy(); // Destruir gráfico anterior, se existir
  //   }

  //   // Criar gráfico
  //   this.chart = new Chart(ctx, {
  //     type: 'line', // Tipo de gráfico
  //     data: {
  //       labels: labels, // Rótulos das categorias
  //       datasets: [
  //         {
  //           data: data, // Dados de percentagens
  //           backgroundColor: ['#FFCE56', '#FF6384'], // Cores das fatias
  //           hoverBackgroundColor: ['#FFCE56', '#FF6384'],
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'right',
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: (tooltipItem: any) => {
  //               const value = tooltipItem.raw;
  //               return `${tooltipItem.label}: ${value}%`; // Mostrar percentagem no tooltip
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }


    // Função para buscar delituosos por província
    getDelituososByProvincia(provinciaId: number): void {
      console.log(`Buscando delituosos para a província com ID: ${provinciaId}`);
      this.dinfopDelitousoService.buscarPorProvincia(provinciaId).subscribe(
        (response: any) => {  // Aqui a resposta será um objeto, e não mais um array direto.
          const pessoas = response.object;  // Acessa o campo 'object' da resposta.
          
          console.log('Resposta da API para delituosos por província:', pessoas);  // Log para verificar os dados
    
          if (pessoas && pessoas.length > 0) {
            const counts = this.calculateStats(pessoas);  // Passa o array de pessoas para a função de cálculo.
            this.provinciaStats = counts;
            this.createChartByProvince(counts);
          } else {
            console.log('Nenhum dado encontrado para esta província');
            this.provinciaStats = { delituosos: 0, suspeitos: 0 };
            this.createChartByProvince({ delituosos: 0, suspeitos: 0 });
          }
        },
        (error) => {
          console.error('Erro ao buscar dados da província', error);
        }
      );
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
    
  
    // Criar gráfico de delituosos por província
    createChartByProvince(counts: { delituosos: number; suspeitos: number }): void {
      console.log('Criando gráfico de delituosos por província:', counts);
  
      const provinciaCanvas = document.getElementById('provinceChart') as HTMLCanvasElement;
      if (!provinciaCanvas) {
        console.error('Canvas para gráfico por província não encontrado!');
        return;
      }
  
      const ctx = provinciaCanvas.getContext('2d');
      if (!ctx) {
        console.error('Não foi possível obter o contexto 2D do canvas');
        return;
      }
  
      if (this.chartByProvince) {
        this.chartByProvince.destroy(); // Destruir gráfico anterior, se existir
      }
  
      // Criar o gráfico
      this.chartByProvince = new Chart(ctx, {
        type: 'pie', // Tipo de gráfico
        data: {
          labels: ['Delituosos', 'Suspeitos'],
          datasets: [
            {
              data: [counts.delituosos, counts.suspeitos],
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
  
    // Atualiza os dados ao selecionar uma nova província
    onProvinciaChange(provincia: string): void {
      console.log(`Província selecionada: ${provincia}`);
      this.selectedProvincia = provincia;
      const provinciaId = this.provincias.find(p => p.text === provincia)?.id;
  
      if (provinciaId) {
        this.getDelituososByProvincia(provinciaId);
      } else {
        console.error('Província não encontrada!');
      }
    }
}
