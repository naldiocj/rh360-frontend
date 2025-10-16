import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfil-delituoso',
  templateUrl: './perfil-delituoso.component.html',
  styleUrls: ['./perfil-delituoso.component.css']
})
export class PerfilDelituosoComponent implements OnInit {
  delituosoId: any;
  delituosoDetails: any;

  activeTab: string = 'delituoso'; // Aba inicial
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;


  delituoso: any[] = [];
  digitais: any[] = []; // Dados das digitais
  biometria: string | null = null; // Dados das digit 
  imgThumb:  string | null = null;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any; 
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/kv.jpg';

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private dinfopDelitousoService: DinfopDelitousoService,
    private ficheiroService: FicheiroService
  ) {}

  
  ngOnInit(): void {
    // Capturando o parâmetro codificado da URL
    const encodedId = this.route.snapshot.paramMap.get('encodedId');
    
    if (encodedId) {
      // Decodificando o ID da URL (base64)
      this.delituosoId = atob(encodedId); // Decodifica o ID do base64

      console.log('ID do delituoso decodificado:', this.delituosoId);

      // Buscar os detalhes do delituoso pelo ID
      this.dinfopDelitousoService
      .ver(this.delituosoId) // Passa o ID convertido
      .pipe(finalize(() => { /* Aqui você pode esconder um loader se necessário */ }))
      .subscribe({
        next: (response: any) => {
          // Certifique-se de que a resposta seja um array
          this.delituoso = Array.isArray(response) ? response : [response];
        
           
          // Exibe as fotos de todos os delituosos automaticamente
          this.delituoso.forEach((delituoso: any) => {
            this.visualizarDelituoso(delituoso);
          });

          // Exibe todos os dados biometricos do delituosos automaticamente
          this.delituoso.forEach((delituoso: any) => {
            this.visualizarBiometricoDelituoso(delituoso);
          });
        },

        error: (err) => {
          console.error('Erro ao buscar delituoso:', err);
          // Você pode mostrar uma mensagem de erro ao usuário aqui
        }
      });
  
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
 


    // Exibe as fotos e detalhes de todos os delituosos
    visualizarDelituoso(delituoso: any) {
      if (!delituoso || !delituoso.fotografias) {
        console.error('Delituoso ou fotografias não definidos');
        return;
      }
    
      const { image_frontal, image_lateral_direita, image_lateral_esquerda } = delituoso.fotografias;
    
      // Exibe a foto frontal
      if (image_frontal) {
        this.ficheiroService.getFileUsingUrl(image_frontal)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem frontal:', error)
          );
      }
    
      // Exibe a foto lateral direita
      if (image_lateral_direita) {
        this.ficheiroService.getFileUsingUrl(image_lateral_direita)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral direita:', error)
          );
      }
    
      // Exibe a foto lateral esquerda
      if (image_lateral_esquerda) {
        this.ficheiroService.getFileUsingUrl(image_lateral_esquerda)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral esquerda:', error)
          );
      }
    }
    
  
    // Exibe as os dados biometricos delituosos
    visualizarBiometricoDelituoso(delituoso: any) {
   
      // Exibe a foto frontal
      if (delituoso.digitais[0].impressaoCaminho) {
        this.ficheiroService.getFileUsingUrl(delituoso.digitais[0].impressaoCaminho)
          .pipe(finalize(() => { }))
          .subscribe((file) => {
            delituoso.digitais[0].imgThumb = this.ficheiroService.createImageBlob(file);
      
          });
      }
  
   
    }
  



























  }