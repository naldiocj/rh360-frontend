import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import { Pagination } from '@shared/models/pagination';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

interface DelituosoResponse {
  data: any[];  // ou o tipo correto de cada delituoso
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    // outras propriedades de paginação
  };
}
@Component({
  selector: 'app-sicgo-dinfop-expediente-associar-suspeitos',
  templateUrl: './associar-suspeitos.component.html',
  styleUrls: ['./associar-suspeitos.component.css']
})
export class AssociarSuspeitosComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  @Input() delituososSelecionados: any = [];
  @Input() expedienteId: any = 0;
  @Output() eventRegistarOuEditar  = new EventEmitter<any>();
 
 
  form: FormGroup; 
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
   fileUrl: any; 
   idade: number | null = null;
   fotodfault='./assets/assets_sicgo/img/logopolice.png';
 
  delituosos: any[] = []; // Lista de delituosos
  selectedDelituosos: number[] = []; // IDs dos delituosos selecionados
  totalBase: number = 0;
  public pagination = new Pagination();
  
  constructor( 
    private expedienteService: ExpedienteService,
    private delituosoService: DinfopDelitousoService,
    private ficheiroService: FicheiroService,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      delituosoIds: [[], Validators.required], // Ajuste o tipo conforme necessário
      grupoIds: [[], Validators.required],      // Ajuste o tipo conforme necessário
    });
    
  }
  

  ngOnInit(): void {
    this.buscarDelituoso();
  }

  
  ngOnDestroy(): void {
    // Se houver lógica de limpeza, você pode implementar aqui
  }
  
  
  public filtro = {
    search: '',
    page: 1,
    perPage: 5, 
    nacionalidade: null,
    genero: null,
    estadocivil_id: null,
    provincia_id: null,
    municipio_id: null,
  }

  // Função para atualizar o filtro de pesquisa e buscar delituosos
  filtrarPagina(key: any, $e: any) {
    // Atualiza o filtro conforme a chave fornecida
    if (key === 'page') {
      this.filtro.page = $e;  // Atualiza a página
    } else if (key === 'perPage') {
      this.filtro.perPage = $e.target.value;  // Atualiza o número de itens por página
    } else if (key === 'search') {
      this.filtro.search = $e;  // Atualiza o termo de busca
    } else if (key === 'genero') {
      this.filtro.genero = $e;  // Atualiza o filtro de gênero
    } else if (key === 'nacionalidade') {
      this.filtro.nacionalidade = $e;  // Atualiza o filtro de nacionalidade
    }  
  
    
  
    // Chama a função de busca com os filtros atualizados
    this.buscarDelituoso();
  }

  private buscarDelituoso(): void {
    this.isLoading = true; // Ativar loader
  
    this.delituosoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false)) // Desativar loader
      .subscribe({
        next: (response: DelituosoResponse) => {  // Garantindo que response seja DelituosoResponse
          if (!response || !Array.isArray(response.data)) {  // Verifica se 'data' é um array
            console.error('Resposta inesperada ao buscar delituosos');
            return;
          }
  
          this.delituosos = response.data.filter(delituoso => delituoso && delituoso.fotografias); // Filtra delituosos sem fotografias
          console.log('Delituosos:', this.delituosos);
  
          // Agora chama a função de visualizar delituoso para cada delituoso que tem fotografias
          this.delituosos.forEach(delituoso => {
            if (delituoso.fotografias) {
              this.visualizarDelituoso(delituoso);
            }
          });
  
          // Acessando a propriedade 'meta' corretamente
          this.totalBase = response.meta?.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;  // Valor padrão se 'meta' for null ou undefined
  
          this.pagination = this.pagination.deserialize(response.meta);
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
        }
      });
  }
  
  

  // Exibe as fotos e detalhes de todos os delituosos
// Exibe as fotos e detalhes de todos os delituosos
visualizarDelituoso(delituoso: any) {
  if (!delituoso || !delituoso.fotografias) {
    console.error('Delituoso ou fotografias são null ou undefined');
    return;
  }

  const fotografias = delituoso.fotografias;
  const carregarImagem = (url: string | null) =>
    url ? this.ficheiroService.getFileUsingUrl(url).pipe(finalize(() => {})).toPromise() : Promise.resolve(null);

  Promise.all([
    carregarImagem(fotografias.image_frontal),
    carregarImagem(fotografias.image_lateral_direita),
    carregarImagem(fotografias.image_lateral_esquerda)
  ]).then(([fileFrontal, fileLateralDireita, fileLateralEsquerda]) => {
    delituoso.fileUrlFrontal = fileFrontal ? this.ficheiroService.createImageBlob(fileFrontal) : null;
    delituoso.fileUrlLateralDireita = fileLateralDireita ? this.ficheiroService.createImageBlob(fileLateralDireita) : null;
    delituoso.fileUrlLateralEsquerda = fileLateralEsquerda ? this.ficheiroService.createImageBlob(fileLateralEsquerda) : null;
  }).catch(error => {
    console.error('Erro ao carregar as imagens:', error);
  });
}



  private carregarImagens(delituoso: any): void {
    this.carregarImagem(delituoso, 'image_frontal', 'fileUrlFrontal');
    this.carregarImagem(delituoso, 'image_lateral_direita', 'fileUrlLateralDireita');
    this.carregarImagem(delituoso, 'image_lateral_esquerda', 'fileUrlLateralEsquerda');
  }

  private carregarImagem(delituoso: any, imageType: string, fileUrlKey: string): void {
    if (delituoso.fotografias[imageType]) {
      this.ficheiroService.getFileUsingUrl(delituoso.fotografias[imageType])
        .pipe(finalize(() => { })) // Você pode adicionar lógica aqui se necessário
        .subscribe({
          next: (file: any) => {
            delituoso[fileUrlKey] = this.ficheiroService.createImageBlob(file);
          },
          error: (err: any) => {
            console.error(`Erro ao carregar a imagem ${imageType}:`, err);
          }
        });
    }
  }

  toggleDelituoso(delituosoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedDelituosos.push(delituosoId);
    } else {
      this.selectedDelituosos = this.selectedDelituosos.filter(id => id !== delituosoId);
    }
  }


  addDelituosoExpediente(): void {
    this.expedienteService.addDelituosoExpediente(this.expedienteId, this.delituososSelecionados)
      .subscribe({
        next: (response) => {
           this.eventRegistarOuEditar.emit(true);
          // Adicionar lógica para mostrar mensagem de sucesso
          setTimeout(() => {
            window.location.reload();
          }, 400);
        },
        error: (error) => {
          console.error('Erro ao adicionar grupos:', error);
          // Adicionar lógica para mostrar mensagem de erro
        }
      });
  }

  removeDelituosoExpediente(): void {
    this.expedienteService.removeDelituosoExpediente(this.delituososSelecionados, this.expedienteId)
      .subscribe({
        next: (response) => {
          console.log('Grupos removidos:', response);
          // Adicionar lógica para mostrar mensagem de sucesso
        },
        error: (error) => {
          console.error('Erro ao remover grupos:', error);
        }
      });
  }
 
  

   // Função para recarregar a página e buscar os dados novamente
   recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarDelituoso();
  }

  calculateAge(birthData: string | number | Date): void {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      this.idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        this.idade--;
      }
    } else {
       
    }
  }

  selecionarDelituosoParaExpediente(item: any): void {
    console.log('Selecionando delituoso:', item);
    const conjuntoUnico = new Set(this.delituososSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.delituososSelecionados = Array.from(conjuntoUnico);
  
    console.log('Delituosos Selecionados após mudança:', this.delituososSelecionados);
  }
  

  validarSelecionado(id: number | undefined): boolean {
    return !!this.delituososSelecionados.find((o: any) => o.id === id);
  }

  limparVariaveis(): void {
    this.delituososSelecionados = [];
  }

  removerDelituosoSelecionado(item: any): void {
    const posicao = this.delituososSelecionados.findIndex((o: any) => o.id === item.id);
    if (posicao !== -1) {
      this.delituososSelecionados.splice(posicao, 1);
    }
  }

  removerTodos(): void {
    this.delituososSelecionados = [];
  }
}
