import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { AssociarDelituosoComDelituoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-delituoso-com-delituoso.service';
import { DelituosoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/cart.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';


interface Delituoso {
  id: number;
  nome: string; 
}
@Component({
  selector: 'sicgo-dinfop-associar-delituosos',
  templateUrl: './associar-delituosos.component.html',
  styleUrls: ['./associar-delituosos.component.css']
})

export class AssociarDelituososComponent implements OnInit {
  receivedData: string | any;
  currentStep = 1;
  receiveData(data: string) {
    this.receivedData = data;
  }
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  @Input() delituososSelecionados: any = [];
  @Input() grupoId: any = 0;
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();

  form: FormGroup;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/logopolice.png';
  totalBase: number = 0;
  public pagination = new Pagination();
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

  delituosos: any[] = []; // Lista de delituosos
  selectedDelituosos: number[] = []; // IDs dos delituosos selecionados
  delituoso: any;
  public objectoCrimes: Array<Select2OptionData> = [];

  constructor(
    private associarDelituoso: AssociarDelituosoComDelituoService,
    private ficheiroService: FicheiroService,
    private objectoCrimeService: ObjectoCrimeService,
    private dinfopDelitousoService: DinfopDelitousoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private delituosoS: DelituosoService
  ) {
    this.form = this.fb.group({
      local_atuacao: ['', Validators.required],
      ponto_concentracao: ['', Validators.required],
      hora_concentracao: ['', Validators.required],
      hora_atuacao: ['', Validators.required],
      meios_id: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    // this.buscarDelituoso();
    this.buscarObjectoCrime();
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['delituosoId'] && this.delituosoId) {
      this.buscarDelituoso();
    }
  }

  removeDelituoso(id: number) {
    this.delituosoS.removeDelituoso(id);
  }

  clearDelituoso() {
    this.delituosoS.clearDelituoso();
  }

  addDelituoso(id: number, nome: string, foto: string, datanascimento: string): void {
    // Aqui, caso queira armazenar outros dados do delituoso em um serviço
    this.delituosoS.addDelituoso({
      id: id,
      nome: nome,
      foto: foto,
      datanascimento: datanascimento
    });
  }





  buscarDelituoso(): void {
    this.isLoading = true;
    const options = { ...this.filtro };
    this.dinfopDelitousoService.listarTodos(this.filtro)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          
          // Filtrar delituosos para remover o delituoso com o id igual a delituosoId
          this.delituosos = response.data.filter((delituoso: any) => delituoso.id !== this.delituosoId);
         
          // Chamar a função visualizarDelituoso para cada delituoso filtrado
          this.delituosos.forEach(delituoso => this.visualizarDelituoso(delituoso));

          
          this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
 
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
        }
      });
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


 

  buscarObjectoCrime() {
    const options = {};
    this.objectoCrimeService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.objectoCrimes = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }


  toggleDelituoso(delituosoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedDelituosos.push(delituosoId);
    } else {
      this.selectedDelituosos = this.selectedDelituosos.filter(id => id !== delituosoId);
    }
  }


  addDelituosoToDelituoso(): void {
    if (this.form.invalid) {
      console.log('Formulário inválido');
      return;
    }

    const ids = this.delituososSelecionados.map((item: any) => item.id);
      
    
    const payload = {
      ...this.form.value,
      delituosos_id: ids,
      delituoso_id: this.delituosoId
    };

    this.associarDelituoso.addDelituosoDelituososs(payload).subscribe({
      next: () => {
        this.eventRegistarOuEditar.emit(true);
        this.reiniciarFormulario();
        setTimeout(() => {
          window.location.reload();
        }, 400);
      },
      error: error => console.error('Erro ao associar delituosos:', error)
    });
  }




  submitAssociacao(): void {
    this.nextStep();
  }

  canAssociacaoSubmit(): boolean {
    return this.selectedDelituosos.filter((field) => field.valueOf.length > 0)
      .length !== 3
      ? true
      : false;
  }


  // Progresso em %
  getProgressPercent(): number {
    return (this.currentStep / 2) * 100;
  }

  // Manipulação de passos
  nextStep(): void {
    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }


  removeDelituosos(): void {
    this.associarDelituoso.removeDelituoso(this.delituososSelecionados, this.grupoId)
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

  // Calcular idade
  calculateAge(birthDate: string | Date): void {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    this.idade = today.getFullYear() - birth.getFullYear();

    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      this.idade--;
    }
  }

  selecionarDelituosoParaDelituoso(item: any): void {
    const conjuntoUnico = new Set(this.delituososSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.delituososSelecionados = Array.from(conjuntoUnico);
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

     // Função para recarregar a página e buscar os dados novamente
     recarregarPagina(): void {
      this.filtro.page = 1;
      this.filtro.perPage = 5;
      this.filtro.search = '';
      this.buscarDelituoso();
    }
    

  reiniciarFormulario() {
    this.form.reset();
  }
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}


