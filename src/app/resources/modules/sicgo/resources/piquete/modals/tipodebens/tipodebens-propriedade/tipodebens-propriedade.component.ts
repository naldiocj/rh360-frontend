import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TipobensService } from '@resources/modules/sicgo/core/service/piquete/tipobens.service';
import { finalize } from "rxjs";

@Component({
  selector: 'app-tipodebens-propriedade',
  templateUrl: './tipodebens-propriedade.component.html',
  styleUrls: ['./tipodebens-propriedade.component.css']
})
export class TipodebensPropriedadeComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  public testemunhas: any;
  @Input() ocorrenciaId: number | any;
  @Input() carateristica_nome: string | any;
  @Input() descricao: string | any;
  @Input() onAdd: any;
  propriedades: any[] = [];
 textareaValue: string = '';
 
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private tipobensService: TipobensService) {
    this.formulario = this.fb.group({
      caracteristica: [''], // Inicializa com valores padrão
      pdescricao: [''], // Inicializa com valores padrão
    });
  }


  ngOnInit(): void {
    this.Propriedades();
  }

 

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta para o conteúdo
  }

  Propriedades() {
    this.tipobensService.propriedades$.subscribe((dados) => {
      this.propriedades = dados; // Atualiza os dados quando houver mudanças
    });
  }


  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }
 
  enviarDados(): void {
    const novoHistorico = this.formulario.value; // Obtém os valores do formulário
    const historicosAtuais = this.tipobensService.getHistoricos();
    const novosDados = [...historicosAtuais, novoHistorico]; // Adiciona o novo dado aos existentes
    this.tipobensService.setPropriedades(novosDados); // Envia para o serviço
  }
}


