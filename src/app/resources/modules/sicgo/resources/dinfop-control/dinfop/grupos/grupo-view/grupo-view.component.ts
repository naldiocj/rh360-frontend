import { Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { finalize } from 'rxjs';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sicgo-grupo-view',
  templateUrl: './grupo-view.component.html',
  styleUrls: ['./grupo-view.component.css']
})
export class GrupoViewComponent implements OnInit {
 // Trabalho de partilha de informações entre components
 @Input() toggleBanner = new EventEmitter<boolean>();
 @Input() isview:  number | any;
 activeTab: string = 'grupo'; 
// Inicialmente, o banner está visível
@Input() showBannerup: number | any; // Inicialmente, o banner está visível
public grupos: any[] = [];
public delituosos: any[] = []; // Nome corrigido para 'delituosos'
@ViewChild('navigationMenu') navigationMenu!: ElementRef;

fileUrlFrontal: string | null = null;
fileUrlLateralDireita: string | null = null;
fileUrlLateralEsquerda: string | null = null;
isLoading: boolean | undefined;
fileUrl: any;
idade: number | null = null;
fotodfault = './assets/assets_sicgo/img/kv.jpg';

constructor(
  private renderer: Renderer2,
  private ficheiroService: FicheiroService,
  private grupo: DinfopGrupoDelitousoService
) {}

ngOnInit(): void {
  this.buscarDelituoso();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['showBannerup'] && this.showBannerup) {
    this.buscarDelituoso();
  }
}

buscarDelituoso() {
  const id = Number(this.showBannerup); // Converte para número
  if (isNaN(id)) {
    return; // Ou trate de forma adequada
  }

  this.grupo
    .ver(id) // Passa o ID convertido
    .pipe(finalize(() => { /* Aqui você pode esconder um loader se necessário */ }))
    .subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.grupos = response; // Atribui diretamente se for um array
        } else {
          this.grupos = [response]; // Converte o objeto em um array para evitar o erro
        }

        // Itera sobre os grupos
        this.grupos.forEach((grupo: any) => {
          // Verifica se o grupo contém delituosos
          if (grupo.delituosos && Array.isArray(grupo.delituosos)) {
            this.delituosos = grupo.delituosos; // Atribui os delituosos
            console.log('Delituosos do grupo:', this.delituosos);

            // Visualiza cada delituoso
            this.delituosos.forEach((delituoso: any) => {
              this.visualizarDelituoso(delituoso);
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Erro ao buscar delituoso:', err);
      }
    });
}

public toggle(id: any): void {
  // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir
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

// Exibe as fotos e detalhes de todos os delituosos
visualizarDelituoso(delituoso: any) {
  // Exibe a foto frontal
  if (delituoso.fotografias.image_frontal) {
    this.ficheiroService
      .getFileUsingUrl(delituoso.fotografias.image_frontal)
      .pipe(finalize(() => {}))
      .subscribe((file) => {
        delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
      });
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