import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-dinfop-ficha-delituoso',
  templateUrl: './dinfop-ficha-delituoso.component.html',
  styleUrls: ['./dinfop-ficha-delituoso.component.css']
})
export class DinfopFichaDelituosoComponent implements AfterViewInit {
//Trabalho de partilha de informções  entre components
@Input() toggleBanner = new EventEmitter<boolean>();
@Input() isview:  number | any;
activeTab: string = 'delituoso'; // Aba inicial

// Inicialmente, o banner está visível
@Input() showBannerup: number | any; // Inicialmente, o banner está visível
//Fim Trabalho de partilha de informções  entre components

 delituoso:  any;
fileUrlFrontal: string | null = null;
fileUrlLateralDireita: string | null = null;
fileUrlLateralEsquerda: string | null = null;
isLoading: boolean | undefined;
 fileUrl: any;
 @Input() delituosoId: number | any;
 idade: number | null = null;
 fotodfault='./assets/assets_sicgo/img/kv.jpg';

 @ViewChild('navigationMenu') navigationMenu!: ElementRef;

 constructor(
 private renderer: Renderer2,
 private dinfopDelitousoService:DinfopDelitousoService,
 private secureService: SecureService,
 private ocorrenciaService: OcorrenciaService,
 private ficheiroService: FicheiroService,
){}

ngOnInit(): void {
 this.buscarDelituoso()
}

ngOnChanges(changes: SimpleChanges): void {
 if (changes['delituosoId'] && this.delituosoId) {
   this.buscarDelituoso();
 }
}


get orgao_nome() {
  return this.secureService.getTokenValueDecode().orgao.nome_completo;
 }

buscarDelituoso() {
 const id = Number(this.delituosoId); // Converte para número
 if (isNaN(id)) {

   return; // Ou trate de forma adequada
 }

 this.dinfopDelitousoService
   .ver(id) // Passa o ID convertido
   .pipe(finalize(() => { /* Aqui você pode esconder um loader se necessário */ }))
   .subscribe({
     next: (response: any) => {
       if (Array.isArray(response)) {
         this.delituoso = response; // Atribui diretamente se for um array
       } else {
         this.delituoso = [response]; // Converte o objeto em um array para evitar o erro
       }console.log('DFP:', this.delituoso);

     // Exibe as fotos de todos os delituosos automaticamente
     this.delituoso.forEach((delituoso: any) => {
       this.visualizarDelituoso(delituoso);
     });
     },
     error: (err) => {
       console.error('Erro ao buscar delituoso:', err);
       // Você pode mostrar uma mensagem de erro ao usuário aqui
     }
   });
}

 get orgao_id(){
   return this.secureService.getTokenValueDecode().orgao?.id;
 }

  // Exibe as fotos e detalhes de todos os delituosos
  visualizarDelituoso(delituoso: any) {
   console.log(`Nome: ${delituoso.nome}, Alcunha: ${delituoso.alcunha}`);

   // Exibe a foto frontal
   if (delituoso.fotografias.image_frontal) {
     this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_frontal)
       .pipe(finalize(() => { }))
       .subscribe((file) => {
         delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
         console.log('foto', delituoso.fileUrlFrontal);

       });
   }

   // Exibe a foto lateral direita
   if (delituoso.fotografias.image_lateral_direita) {
     this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_direita)
       .pipe(finalize(() => { }))
       .subscribe((file) => {
         delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
       });
   }

   // Exibe a foto lateral esquerda
   if (delituoso.fotografias.image_lateral_esquerda) {
     this.ficheiroService.getFileUsingUrl(delituoso.fotografias.image_lateral_esquerda)
       .pipe(finalize(() => { }))
       .subscribe((file) => {
         delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
       });
   }
 }



public toggle(id: any): void {
 // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


 const main: HTMLElement | any = document.querySelector('#main_');
 const asidebar: HTMLElement | any = document.querySelector('#asidebar');

 if (main && asidebar) {
   let asideLeft: string | any = asidebar.style.right;
   let mainLeft: string | any = main.style.marginRight;
   if (this.showBannerup == id) {
     this.showBannerup = null;
     this.showBannerup == id;

     if (asideLeft == '' || asideLeft == '0px') {
       asideLeft = '-300px';
       mainLeft = '0px';
     }
     // Alterna a visibilidade
   } else if (this.showBannerup != id) {
     this.showBannerup = id; // Abre o novo sidebar e fecha o anterior

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


public imprimir = (cv: any): void => {
  const paraImprimir: any = document.querySelector(`#${cv}`);
  if (paraImprimir) {
    setTimeout(() => {
      document.body.innerHTML = paraImprimir.outerHTML;
      window.print();
      window.location.reload();
    }, 500);
  }
}








rodape: string = `
<div class="row">


  <div style=' position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f5f5f5;
  padding: 20px;
  border-top: 1px solid #ddd; text-align: left; display: flex; justify-content: space-between;' class="container">
  <div style='text-align: left;' class="texto-esquerda">Av. 4 de Fevereiro <br>
  Marginal Edifício Sede -R/C <br>
  Telef: 222 33 94 61/ 222 33 54 20 <br>
  Email:dti.dti@pn.gov.ao <br>
  Facebook: Policia Nacional de Angola</div>
  <div style='text-align: right;' class="texto-direita"><img style="text-align: right;" alt="Imagem do cabeçalho" width="350px" height="110px"></div>
  </div>



</div>
`;
}

