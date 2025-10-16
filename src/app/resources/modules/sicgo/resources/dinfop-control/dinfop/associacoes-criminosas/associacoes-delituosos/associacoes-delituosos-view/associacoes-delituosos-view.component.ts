import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AssociarDelituosoComDelituoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-delituoso-com-delituoso.service';
import { finalize } from 'rxjs';

interface Delituoso {
  id: number;
  codigo_sistema: number,
  nome: string;
  alcunha: string;
  nomePai: string;
  nomeMae: string;
  genero: string;
  dataNascimento: string;
  natural: string;
  estado_civil: string;
  profissao: string;
  habilitacaoL: string;
  residencia: string;
  pais: string;
  municipio: string;
  provincia: string;
  numero_identidade: string;
  dataEmissao: string;
  localEmissao: string;
  dataentrada_angola: string;
  fronteira: string;
  fotografias: {
    image_frontal: string;
    image_lateral_direita: string;
    image_lateral_esquerda: string;
  };
  fileUrlFrontal: string;
  fileUrlLateralDireita: string;
  fileUrlLateralEsquerda: string;
}

interface AssociacaoDelituosa {
  delituoso: Delituoso[];
  delituosos: Delituoso[];
  id: number,
  codigo_sistema: string;
  local_atuacao: string;
  ponto_concentracao: string;
  hora_concentracao: string;
  hora_atuacao: string;
  meios_id: number;
  modo_operante_id: number;
  activo: number;
  delituoso_id: number;
  delituosos_id: number;
  antecedentes: any,
  modooperantes: any,
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'sicgo-dinfop-associacoes-delituosos-view',
  templateUrl: './associacoes-delituosos-view.component.html',
  styleUrls: ['./associacoes-delituosos-view.component.css']
})
export class AssociacoesDelituososViewComponent implements OnInit {
  isLoading!: boolean;
  totalBase: any;
  pagination: any;
  @Input() toggleBanner = new EventEmitter<boolean>();
  @Input() associacaoId: number | any;

  associacaoDelituosa: AssociacaoDelituosa = {
    delituoso: [],
    delituosos: [],
    id: 0,
    codigo_sistema: '',
    local_atuacao: '',
    ponto_concentracao: '',
    hora_concentracao: '',
    hora_atuacao: '',
    meios_id: 0,
    modo_operante_id: 0,
    activo: 0,
    delituoso_id: 0,
    delituosos_id: 0,
    antecedentes: '',
    modooperantes: '',
    created_at: '',
    updated_at: ''
  };
  public isOffcanvasVisible: number | any;


  fileUrl: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/kv.jpg';

  activeTab: string = 'assodelituosos';  
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private ficheiroService: FicheiroService,
    private associarDelituoso: AssociarDelituosoComDelituoService) { }


  ngOnInit() {
    this.buscarDelituoso()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['associacaoId'] && this.associacaoId) {
      this.buscarDelituoso();
    }
  }

  buscarDelituoso() {
    if (!this.associacaoId) {
      console.warn('ID de associação inválido:', this.associacaoId);
      return;
    }
  
    this.isLoading = true;
  
    this.associarDelituoso.ver(this.associacaoId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(
      (response: any) => {
        this.associacaoDelituosa = response;
        this.cdRef.detectChanges();
  
        console.log('Delituosos encontrados:', this.associacaoDelituosa.delituosos);
  
        this.associacaoDelituosa.delituosos.forEach((delituoso: any) => {
          this.visualizarDelituoso(delituoso);
        });
  
        if (response.meta) {
          this.totalBase = response.meta.current_page
            ? (response.meta.current_page === 1 ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1)
            : this.totalBase;
  
          this.pagination = this.pagination.deserialize(response.meta);
        } else {
          console.warn("A estrutura da resposta não contém 'meta'.");
        }
      },
      (error) => {
        console.error('Erro ao buscar delituoso:', error);
      }
    );
  }
  

  // Exibe as fotos e detalhes de todos os delituosos
  visualizarDelituoso(delituoso: any) {
    if (!delituoso || !delituoso.fotografias) {
      console.error('Delituoso ou fotografias são null ou undefined', delituoso);
      // Defina imagens padrão
      delituoso.fotografias = {
        image_frontal: './assets/assets_sicgo/img/kv.jpg',
        image_lateral_direita: './assets/assets_sicgo/img/kv.jpg',
        image_lateral_esquerda: './assets/assets_sicgo/img/kv.jpg'
      };
    }

    const fotografias = delituoso.fotografias;
    console.log('Fotografias:', fotografias);  // Verifique se a estrutura das imagens está correta

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


  public toggle(id: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;
      if (this.associacaoId == id) {
        this.associacaoId = null;
        this.associacaoId == id;

        if (asideLeft == '' || asideLeft == '0px') {
          asideLeft = '-300px';
          mainLeft = '0px';
        }
        // Alterna a visibilidade
      } else if (this.associacaoId != id) {
        this.associacaoId = id; // Abre o novo sidebar e fecha o anterior

        asideLeft = '0px';
        mainLeft = '400px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }
 


  calculateAge(birthData: string | number | Date) {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      let idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
      }

      this.idade = idade;
    } else {
      alert('Por favor, insira uma data de nascimento válida.');
    }
  }



  
// Função para alternar entre as abas
openTab(tab: string): void {
  this.activeTab = tab;
}



ngAfterViewInit(): void {
  const links = this.navigationMenu.nativeElement.querySelectorAll('a');

  // Adicionando evento de clique a todos os links
  links.forEach((link: HTMLElement) => {
    this.renderer.listen(link, 'click', (event: Event) => {
      event.preventDefault(); // Previne a navegação padrão

      // Remove a classe 'active' de todos os itens
      links.forEach((lnk: HTMLElement) =>
        this.renderer.removeClass(lnk.parentElement, 'active')
      );

      // Adiciona a classe 'active' ao item clicado
      this.renderer.addClass(link.parentElement, 'active');
    });
  });
}

prepareRoute(outlet: RouterOutlet) {
  return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
}
}
