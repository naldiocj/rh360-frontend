import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { AssociarDelituosoComDelituoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-delituoso-com-delituoso.service';
import { DelituosoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/cart.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

interface Delituoso {
  id: number;
  nome: string;
  foto: string;
  datanascimento: string;
}

@Component({
  selector: 'dinfo-ver-delituosos',
  templateUrl: './ver-delituosos.component.html',
  styleUrls: ['./ver-delituosos.component.css']
})
export class VerDelituososComponent implements OnInit {

  @Output() dataEmitter = new EventEmitter<string>();
  sendData() {
    const data = 'Dados do Modal';
    this.dataEmitter.emit(data);
  }

  @Input() delituososSelecionados: any = [];

  @Input() grupoId: any = 0;
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();


  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/logopolice.png';

   delituososs: Delituoso[] = [];
   delituosos: any[] = []; // Lista de delituosos
  selectedDelituosos: number[] = []; // IDs dos delituosos selecionados
  delituoso: any;
  public objectoCrimes: Array<Select2OptionData> = [];

  constructor(
    private delituosoService: DinfopDelitousoService,
    private ficheiroService: FicheiroService,
    private delituosoS: DelituosoService
  ) {

  }


  ngOnInit(): void {
    this.buscarDelituoso();

  }

  ngOnDestroy(): void {
    // Se houver lógica de limpeza, você pode implementar aqui
  }

  // addMultipleDelituosos(delituosos: Delituoso[]) {
  //   delituosos.forEach(delituoso => {
  //     this.addDelituoso(delituoso.id, delituoso.nome, delituoso.foto, delituoso.datanascimento);
  //   });
  // }

  addDelituoso(id:number,nome:string,foto:string,datanascimento:string): void {
        this.delituosoS.addDelituoso({
          id: id, // ou outra lógica para gerar ID único
          nome: nome,
          foto: foto,
          datanascimento:datanascimento
        });
  }



  buscarDelituoso(): void {
    this.isLoading = true;
  
    this.delituosoService.listarTodos({})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          const lista = response?.data ?? response; // Se a lista estiver em `data`, usa ela; senão, usa o próprio response
          if (!Array.isArray(lista)) {
            console.error('Resposta inesperada de listarTodos:', response);
            return;
          }
  
          // Filtrar delituosos para remover o delituoso com o id igual a delituosoId
          this.delituosos = lista.filter((delituoso: any) => delituoso.id !== this.delituosoId);
  
          // Chamar a função visualizarDelituoso para cada delituoso filtrado
          this.delituosos.forEach(delituoso => this.visualizarDelituoso(delituoso));
        },
        error: (err: any) => {
          console.error('Erro ao buscar delituoso:', err);
        }
      });
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

  toggleDelituoso(delituosoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedDelituosos.push(delituosoId);
    } else {
      this.selectedDelituosos = this.selectedDelituosos.filter(id => id !== delituosoId);
    }
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
      alert('Por favor, insira uma data de nascimento válida.');
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
}


