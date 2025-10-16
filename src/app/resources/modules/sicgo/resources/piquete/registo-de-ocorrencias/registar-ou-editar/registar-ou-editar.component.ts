import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import Swal from 'sweetalert2';
import { MapaService } from '@resources/modules/sicgo/core/service/mapa/mapa.service';

@Component({
  selector: 'sicgo-registar-ou-editar-piquete',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements AfterViewInit, OnDestroy{
  @Input() ocorrencia: any = null;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();
  @ViewChild('modalRef') modalRef!: ElementRef;
 @ViewChild('resizeContainer') resizeContainer!: ElementRef;
  currentStep: number = 1;
  exibirModal: boolean = false;
 private resizeObserver!: ResizeObserver;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private shapeCoordinatesService: MapaService
  ) {}
  ngAfterViewInit(): void {
    // Verifica se o modalRef está definido e aplica estilos iniciais
    if (this.modalRef) {
      this.renderer.setStyle(this.modalRef.nativeElement, 'display', 'none');
    }

    // Adiciona um listener para redimensionar o container, se necessário
    if (this.resizeContainer) {
      this.renderer.listen(window, 'resize', () => {
        this.adjustContainerSize();
      });
    }
  }

  private adjustContainerSize(): void {
    if (this.resizeContainer) {
      const container = this.resizeContainer.nativeElement;
      const windowHeight = window.innerHeight;
      const newHeight = Math.max(windowHeight * 0.8, 300); // Define um tamanho mínimo de 300px
      this.renderer.setStyle(container, 'height', `${newHeight}px`);
      
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver && this.resizeContainer) {
      this.resizeObserver.unobserve(this.resizeContainer.nativeElement);
    }
  }
  // Propriedades do usuário
  get nomeUtilizador() {
    return this.authService.user.nome_completo;
  }

  get orgao() {
    return this.authService.orgao.sigla;
  }

  isDTSerUser(): boolean {
    return this.orgao === 'DTSer';
  }

  // Métodos de navegação
  goToStep(step: number): void {
    if (this.isStepAccessible(step)) {
      this.currentStep = step;
    } else {
      alert('Preencha os passos anteriores corretamente antes de prosseguir.');
    }
  }

  isStepAccessible(step: number): boolean {
    // Lógica simplificada - ajuste conforme necessário
    return true;
  }

  // Métodos de modal
// Função para fechar a modal// No seu componente 3edx1rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrws2
async fecharModal(): Promise<void> {
  if (await this.confirmarSaida()) {
    // Esconde a modal
    this.modalRef.nativeElement.style.display = 'none';
    this.renderer.setStyle(this.modalRef.nativeElement, 'display', 'none');
    
    // Remove o backdrop (se existir)
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
    
    // Remove a classe modal-open do body e restaura o scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }
}
// Confirmação antes de sair da modal
  private confirmarSaida(): Promise<boolean> {
    return Swal.fire({
      title: "Atenção!",
      html: `Sr(a). <strong>${this.nomeUtilizador}</strong>, você tem alterações não salvas. Tem certeza de que deseja sair?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, Sair!",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-primary px-2 mr-1",
        cancelButton: "btn btn-danger ms-2 px-2",
      },
    }).then(result => result.isConfirmed);
  }

  // Comunicação com o mapa
  onShapeCoordinatesReceived(data: { type: string; coordinates: any }): void {
    console.log('Forma recebida:', data.type, 'Coordenadas:', data.coordinates);
  }

  // Emissor de eventos
  propagarEvento(isRegistrar: boolean) {
    this.eventRegistarOuEditar.emit(isRegistrar);
  }
}