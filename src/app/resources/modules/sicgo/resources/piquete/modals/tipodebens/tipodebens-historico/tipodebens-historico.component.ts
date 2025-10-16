import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { TipobensService } from '@resources/modules/sicgo/core/service/piquete/tipobens.service';
import { finalize } from "rxjs";

@Component({
  selector: 'app-tipodebens-historico',
  templateUrl: './tipodebens-historico.component.html',
  styleUrls: ['./tipodebens-historico.component.css']
})
export class TipodebensHistoricoComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  textareaValue: string = '';
  formulario: FormGroup;
  @Input() ocorrenciaId:                number | any;
  @Input() carateristica_nome: string | any;
  @Input() descricao: string | any;
  @Input() onAdd: any;
  historicos: any[] = [];

  constructor(private fb: FormBuilder, private historicoService: TipobensService) {
    this.formulario = this.fb.group({
      data: [''], // Inicializa com valores padrão
      hdescricao: [''], // Inicializa com valores padrão
    });
  }

 

 

  ngOnInit(): void {
    this.Historicos();
  }

  

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta para o conteúdo
  }

  Historicos() {
    this.historicoService.historicos$.subscribe((dados) => {
      this.historicos = dados; // Atualiza os dados quando houver mudanças
    });
  }

  // switch

  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }

 

  enviarDados(): void {
    const novoHistorico = this.formulario.value; // Obtém os valores do formulário
    const historicosAtuais = this.historicoService.getHistoricos();
    const novosDados = [...historicosAtuais, novoHistorico]; // Adiciona o novo dado aos existentes
    this.historicoService.setHistoricos(novosDados); // Envia para o serviço
  }
}


